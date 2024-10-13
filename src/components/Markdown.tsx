import GlossaryOverlay from './GlossaryOverlay';
import type { MDXContent } from 'mdx/types';

function Null() {
  return null;
}

function Markdown({
  children: CompiledMarkdown,
  className,
}: {
  children?: MDXContent;
  className?: string;
}) {
  if (!CompiledMarkdown) return null;

  return (
    <div className={className}>
      <CompiledMarkdown
        components={{
          GlossaryOverlay,
          h1: Null,
        }}
      />
    </div>
  );
}

export default Markdown;
