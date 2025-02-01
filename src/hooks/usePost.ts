import useSWR, { SWRConfiguration } from "swr";
import type { IBlogPost } from "@/types";
import { BASE_URL } from "@/consts";

const postFetcher = (postMetaInfo: IBlogPost) => {
    return fetch(`${BASE_URL}blogs/${postMetaInfo.id}/${postMetaInfo.title}.md`).then((res) => res.text());
};

export const usePost = (postMetaInfo: IBlogPost | undefined, options?: SWRConfiguration) => {
    return useSWR(postMetaInfo, postFetcher, options);
};
