import useSWR, { SWRConfiguration } from "swr";
import type { IBlogPost } from "@/types";

const postFetcher = (postMetaInfo: IBlogPost) => {
    return fetch(`/blogs/${postMetaInfo.id}/${postMetaInfo.title}.md`).then((res) => res.text());
};

export const usePost = (postMetaInfo: IBlogPost | undefined, options?: SWRConfiguration) => {
    return useSWR(postMetaInfo, postFetcher, options);
};
