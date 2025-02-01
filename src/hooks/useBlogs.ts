import useSWR, { SWRConfiguration } from "swr";
import type { IBlogPost } from "@/types";
import { BASE_URL } from "@/consts";

const blogsFetcher = (url: string) => fetch(url).then((res) => res.json());

export function useBlogs(options?: SWRConfiguration) {
    return useSWR<IBlogPost[]>(BASE_URL + "blogs/blog-data.json", blogsFetcher, options);
}
