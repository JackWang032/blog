import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function throttle<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let lastTime = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    return function (this: any, ...args: Parameters<T>) {
        const now = Date.now();
        const remaining = wait - (now - lastTime);

        if (remaining <= 0) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            func.apply(this, args);
            lastTime = now;
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastTime = Date.now();
                timeoutId = null;
            }, remaining);
        }
    };
}

export function generateCustomId(): string {
    return Math.random().toString(36).substring(2, 15);
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getHashKey(base: string) {
    const hash = base.split("").reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);

    return Math.abs(hash).toString(36).substring(0, 5);
}
