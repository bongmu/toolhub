import { useEffect } from 'react';
import { recordVisit } from './HomeSections';

/** 挂在工具页：进入页面时记录最近使用 */
export default function RecentTracker({ slug }: { slug: string }) {
  useEffect(() => {
    recordVisit(slug);
  }, [slug]);
  return null;
}
