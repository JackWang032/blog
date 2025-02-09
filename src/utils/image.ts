import { nanoid } from "nanoid";
import { BASE_URL } from "@/consts";

export async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function base64ToBlob(base64: string): Blob {
    const [header, data] = base64.split(",");
    const mimeMatch = header.match(/data:([^;]+);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
}

export function getImageHash(base64: string): string {
    const [, data] = base64.split(",");
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export function createObjectURL(blob: Blob): string {
    return URL.createObjectURL(blob);
}

export function revokeObjectURL(url: string): void {
    URL.revokeObjectURL(url);
}

export function isBase64Image(str: string): boolean {
    return str.startsWith("data:image/");
}

export function getImageExtFromBase64(base64: string): string {
    const match = base64.match(/^data:image\/(\w+);base64,/);
    return match ? match[1] : "png";
}

export function generateImageFileName(ext: string): string {
    return `${nanoid()}.${ext}`;
}

export function processMarkdownImages(content: string): {
    content: string;
    images: Array<{ fileName: string; base64: string }>;
} {
    const images: Array<{ fileName: string; base64: string }> = [];
    let newContent = content;

    // 匹配 markdown 中的图片
    const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const matches = Array.from(content.matchAll(regex));

    for (const match of matches) {
        const [fullMatch, alt, src] = match;
        if (isBase64Image(src)) {
            const ext = getImageExtFromBase64(src);
            const fileName = generateImageFileName(ext);

            images.push({ fileName, base64: src });
            // 替换 base64 为文件路径
            newContent = newContent.replace(src, `${BASE_URL}images/${fileName}`);
        }
    }

    return { content: newContent, images };
}
