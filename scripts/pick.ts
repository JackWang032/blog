import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import { createHash } from "crypto";

const BLOGS_DIR = path.join(process.cwd(), "public", "posts");

async function downloadImage(url: string, outputDir: string): Promise<string> {
    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();

        // 使用图片URL的MD5作为文件名
        const hash = createHash("md5").update(url).digest("hex");
        const ext = path.extname(url) || ".png"; // 如果URL没有扩展名，默认用png
        const fileName = `${hash}${ext}`;
        const outputPath = path.join(outputDir, fileName);

        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, Buffer.from(buffer));

        return fileName;
    } catch (error) {
        console.error(`Failed to download image: ${url}`, error);
        return url; // 如果下载失败，返回原始URL
    }
}

async function processMarkdown(filePath: string): Promise<void> {
    try {
        const content = await fs.readFile(filePath, "utf-8");
        const imagesDir = path.join(process.cwd(), "public/images");

        // 创建images目录
        await fs.mkdir(imagesDir, { recursive: true });

        // 匹配Markdown中的图片
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let newContent = content;
        let match;

        // 处理所有匹配到的图片
        const promises: Promise<void>[] = [];
        const replacements: [string, string][] = [];

        while ((match = imageRegex.exec(content)) !== null) {
            const [fullMatch, alt, imageUrl] = match;

            // 只处理在线图片
            if (imageUrl.startsWith("http")) {
                promises.push(
                    (async () => {
                        const localFileName = await downloadImage(imageUrl, imagesDir);
                        replacements.push([fullMatch, `![${alt}](${localFileName})`]);
                    })()
                );
            }
        }

        // 等待所有图片下载完成
        await Promise.all(promises);

        // 替换所有图片链接
        replacements.forEach(([oldText, newText]) => {
            newContent = newContent.replace(oldText, newText);
        });

        // 写回文件
        await fs.writeFile(filePath, newContent, "utf-8");

        console.log(`Processed: ${filePath}`);
    } catch (error) {
        console.error(`Failed to process markdown: ${filePath}`, error);
    }
}

async function processAllMarkdowns(): Promise<void> {
    try {
        // 递归获取所有markdown文件
        async function* getFiles(dir: string): AsyncGenerator<string> {
            const items = await fs.readdir(dir, { withFileTypes: true });
            for (const item of items) {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory()) {
                    yield* getFiles(fullPath);
                } else if (item.name.endsWith(".md")) {
                    yield fullPath;
                }
            }
        }

        // 处理所有markdown文件
        for await (const file of getFiles(BLOGS_DIR)) {
            await processMarkdown(file);
        }

        console.log("All markdown files processed successfully!");
    } catch (error) {
        console.error("Failed to process markdown files:", error);
    }
}

// 执行脚本
processAllMarkdowns();
