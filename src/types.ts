export interface IBlogPost {
    id: string;
    title: string;
    description: string;
    date: string;
    themes?: {
        dark?: string;
        light?: string;
    }
}


