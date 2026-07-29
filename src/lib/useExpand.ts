import { useEffect, useState } from 'react';

/**
 * 编辑区放大/全屏开关。
 * - expanded=true 时工具卡片占满整个浏览器视口（fixed 全屏覆盖）
 * - 用户也可手动拖动 textarea 右下角（resize-y）
 * 通过 CustomEvent('tool-expand', {detail}) 与工具卡片外壳通信。
 */
export default function useExpand(): {
  expanded: boolean;
  toggle: () => void;
} {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    window.dispatchEvent(new CustomEvent('tool-expand', { detail: next }));
  };

  // Esc 退出全屏
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpanded(false);
        window.dispatchEvent(new CustomEvent('tool-expand', { detail: false }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  return { expanded, toggle };
}
