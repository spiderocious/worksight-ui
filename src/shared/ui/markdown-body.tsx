import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import clsx from 'clsx';

interface Props {
  children: string;
  className?: string;
}

/**
 * Renders an assignment `brief` / `mainBrief` (or any markdown blob) using
 * react-markdown. CommonMark + GFM extensions (tables, strikethrough, task
 * lists, autolinks). Raw HTML in the source is intentionally NOT rendered —
 * we want safety by default. If a brief lacks markdown syntax, it renders as
 * plain paragraphs (markdown is a strict superset of plain text).
 *
 * Styling: maps the standard tags to our existing Tailwind classes so it
 * blends with the rest of the app. No external CSS, no Tailwind typography
 * plugin — that'd pull in another ~20KB and mostly produces things we'd
 * override anyway.
 */
export const MarkdownBody = ({ children, className }: Props) => (
  <div
    className={clsx(
      'text-sm text-ink leading-relaxed',
      // Spacing between block elements
      '[&>*+*]:mt-3',
      // Headings
      '[&_h1]:font-display [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-ink [&_h1]:mt-4',
      '[&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-4',
      '[&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-3',
      '[&_h4]:font-medium [&_h4]:text-sm [&_h4]:text-ink [&_h4]:mt-3',
      // Paragraphs / inline text
      '[&_p]:text-sm [&_p]:text-ink-muted [&_p]:leading-relaxed',
      '[&_strong]:font-semibold [&_strong]:text-ink',
      '[&_em]:italic',
      '[&_del]:line-through [&_del]:text-ink-soft',
      // Lists
      '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ink-muted [&_ul]:space-y-1',
      '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-ink-muted [&_ol]:space-y-1',
      '[&_li]:leading-relaxed',
      // GFM task lists — react-markdown renders <input type=checkbox>
      '[&_li>input[type="checkbox"]]:mr-2 [&_li>input[type="checkbox"]]:accent-brand-700',
      // Inline code
      "[&_code]:font-mono [&_code]:text-[0.85em] [&_code]:bg-surface-sunken [&_code]:text-ink [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded",
      // Code blocks (the <pre> wraps a <code>; reset the inline styling)
      '[&_pre]:bg-ink [&_pre]:text-brand-50 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:leading-relaxed',
      "[&_pre>code]:bg-transparent [&_pre>code]:text-inherit [&_pre>code]:p-0 [&_pre>code]:rounded-none",
      // Links
      '[&_a]:text-brand-700 [&_a]:underline-offset-4 hover:[&_a]:underline hover:[&_a]:text-brand-800',
      // Blockquotes
      '[&_blockquote]:border-l-4 [&_blockquote]:border-brand-200 [&_blockquote]:pl-4 [&_blockquote]:text-ink-muted [&_blockquote]:italic',
      // Tables (GFM)
      '[&_table]:w-full [&_table]:border-collapse [&_table]:text-xs',
      '[&_th]:border [&_th]:border-line [&_th]:bg-surface-subtle [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold',
      '[&_td]:border [&_td]:border-line [&_td]:px-3 [&_td]:py-2',
      // Horizontal rules
      '[&_hr]:my-4 [&_hr]:border-line',
      // Images, just in case (defensive — we don't expect them, but they shouldn't blow up the layout)
      '[&_img]:max-w-full [&_img]:rounded-lg',
      className
    )}
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  </div>
);
