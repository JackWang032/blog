import useSWR, { SWRConfiguration } from "swr";
import type { IBlogPost } from "@/types";
import { BASE_URL } from "@/consts";
import { getHashKey } from "@/utils";

const blogsFetcher = (url: string) =>
    fetch(url)
        .then((res) => res.json())
        .then((data) => data.map((item) => ({ ...item, id: getHashKey(item.title) })));

export function useBlogs(options?: SWRConfiguration) {
    return useSWR<IBlogPost[]>(BASE_URL + "posts/blog-data.json", blogsFetcher, options);
}
