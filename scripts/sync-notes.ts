import fs from "fs";
import path from "path";

interface Note {
    id: string;
    title: string;
    content?: string;
    createdAt: string;
    updatedAt: string;
    deleted?: boolean;
    synced?: boolean;
}

interface ProcessedImage {
    fileName: string;
    base64: string;
}

const NOTES_DIR = path.join(process.cwd(), "public/notes");
const IMAGES_DIR = path.join(process.cwd(), "public/images");
const NOTES_DATA_FILE = path.join(NOTES_DIR, "notes-data.json");

// 确保目录存在
[NOTES_DIR, IMAGES_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

import { getImageHash, getImageExtFromBase64 } from "../src/utils/image";

// 处理 markdown 中的 base64 图片
function processMarkdownImages(content: string): { content: string; images: ProcessedImage[] } {
    const images: ProcessedImage[] = [];
    let newContent = content;

    // 匹配 markdown 中的图片
    const regex = /!\[([^\]]*)\]\(data:image\/[^;]+;base64,[^)]+\)/g;

    newContent = content.replace(regex, (match, alt) => {
        const base64 = match.slice(match.indexOf("(") + 1, -1);
        const ext = getImageExtFromBase64(base64);
        const hash = getImageHash(base64);
        const fileName = `${hash}.${ext}`;
        images.push({
            fileName,
            base64,
        });
        return `![${alt}](${fileName})`;
    });

    return { content: newContent, images };
}

// 确保目录存在
if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
}

// 读取导出的JSON文件
const exportFile = process.argv[2];
if (!exportFile) {
    console.error("请提供导出的JSON文件路径");
    process.exit(1);
}

const notes = JSON.parse(fs.readFileSync(exportFile, "utf-8"));

// 读取现有的 notes 数据
let existingNotesData: Note[] = [];
if (fs.existsSync(NOTES_DATA_FILE)) {
    existingNotesData = JSON.parse(fs.readFileSync(NOTES_DATA_FILE, "utf-8"));
}

// 合并新旧数据
const mergedNotesData = existingNotesData.slice();

// 更新或添加新的笔记至notes-data.json
notes.forEach((note: Note) => {
    const existingIndex = mergedNotesData.findIndex((n) => n.id === note.id);
    const noteData = {
        id: note.id,
        title: note.title,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
    };

    if (note.deleted) {
        // 如果笔记被删除，从合并数据中移除
        if (existingIndex !== -1) {
            mergedNotesData.splice(existingIndex, 1);
        }
    } else {
        // 更新或添加笔记
        if (existingIndex !== -1) {
            mergedNotesData[existingIndex] = noteData;
        } else {
            mergedNotesData.push(noteData);
        }
    }
});

// 写入更新后的数据
fs.writeFileSync(NOTES_DATA_FILE, JSON.stringify(mergedNotesData, null, 2));

function sanitizeFileName(name: string): string {
    return name
        .replace(/[<>:"/\\|?*]/g, "") // 移除非法字符
        .replace(/\s+/g, "_") // 空格替换为下划线
        .slice(0, 50); // 限制长度
}

// 获取现有的markdown文件列表
const existingFiles = fs.readdirSync(NOTES_DIR).filter((file) => file.endsWith(".md"));

// 将每个note内容写入单独的markdown文件
notes.forEach((note: Note) => {
    const shortId = note.id.substring(0, 6);
    const safeTitle = sanitizeFileName(note.title);
    const fileName = `${safeTitle}_${shortId}.md`;
    const filePath = path.join(NOTES_DIR, fileName);

    if (note.deleted) {
        // 如果笔记已被删除，删除对应的markdown文件
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`删除文件: ${fileName}`);
        }
    } else {
        // 处理笔记内容中的图片
        const { content: processedContent, images } = processMarkdownImages(note.content || "");

        // 保存图片文件
        images.forEach(({ fileName, base64 }) => {
            const imagePath = path.join(IMAGES_DIR, fileName);
            // 如果文件已存在，跳过
            if (fs.existsSync(imagePath)) {
                console.log(`图片已存在，跳过: ${fileName}`);
                return;
            }
            const imageData = base64.split(",")[1];
            fs.writeFileSync(imagePath, Buffer.from(imageData, "base64"));
            console.log(`写入图片: ${fileName}`);
        });

        // 写入处理后的 markdown 文件
        fs.writeFileSync(filePath, processedContent);
        console.log(`写入文件: ${fileName}`);
    }
});

// 清理已不存在的笔记对应的文件
const validFileNames = mergedNotesData.map(
    (note: any) => `${sanitizeFileName(note.title)}_${note.id.substring(0, 6)}.md`
);

existingFiles.forEach((file) => {
    if (!validFileNames.includes(file) && file !== "notes-data.json") {
        const filePath = path.join(NOTES_DIR, file);
        fs.unlinkSync(filePath);
        console.log(`删除旧文件: ${file}`);
    }
});

console.log("同步完成！");
