import { IN_WORLD_TERMS, CYOA_TERMS } from './../data/glossary';
import GlossaryOverlay from './GlossaryOverlay';
import * as mdx from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

function Markdown({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (!children || typeof children !== 'string') return null;

  const markdownList = children.split(/([^a-zA-z])/);
  console.log(markdownList);
  const modifiedMarkdown = markdownList.map((str: string) => {
    if (
      IN_WORLD_TERMS[str.toLowerCase() as keyof typeof IN_WORLD_TERMS] !==
      undefined
    ) {
      return `<GlossaryOverlay variant="primary">${str}</GlossaryOverlay>`;
    } else if (CYOA_TERMS[str as keyof typeof CYOA_TERMS] !== undefined) {
      return `<GlossaryOverlay variant="primary">${str}</GlossaryOverlay>`;
    } else {
      return str;
    }
  });

  const compiledMarkdown = mdx.compileSync(modifiedMarkdown.join(' '), {
    outputFormat: 'function-body',
  });

  const { default: Markdown } = mdx.runSync(String(compiledMarkdown), {
    ...runtime,
    Fragment: 'fragment',
  });

  return (
    <Markdown
      className={className}
      components={{
        GlossaryOverlay,
      }}
    />
  );
}

export default Markdown;
