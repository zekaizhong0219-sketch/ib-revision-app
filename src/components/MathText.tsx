import { memo, useMemo } from 'react';
import { toHtml } from '../lib/markup';

interface Props {
  text: string;
  className?: string;
  as?: 'div' | 'span';
}

/** Renders text containing KaTeX maths. Content is our own data or the user's own cards. */
export const MathText = memo(function MathText({ text, className, as = 'div' }: Props) {
  const html = useMemo(() => toHtml(text), [text]);
  const Tag = as;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
});
