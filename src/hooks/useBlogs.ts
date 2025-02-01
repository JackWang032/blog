import useSWR, { SWRConfiguration } from 'swr';
import type { IBlogPost } from '@/types';

const blogsFetcher = (url: string) =>
    fetch(url).then((res) => res.json());

export function useBlogs(options?: SWRConfiguration) {
  return useSWR<IBlogPost[]>('/blogs/blog-data.json', blogsFetcher, options);
} 