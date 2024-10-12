import { IN_WORLD_TERMS, CYOA_TERMS } from './../data/glossary';
import GlossaryOverlay from './GlossaryOverlay';
import * as mdx from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

function Null() {
  return null;
}

function Markdown({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (!children || typeof children !== 'string') return null;

  const markdownList = children.split(/([^a-zA-z])/);
  const modifiedMarkdown = markdownList.map((str: string) => {
    const inWorldDescription =
      IN_WORLD_TERMS[str.toLowerCase() as keyof typeof IN_WORLD_TERMS];
    const cyoaDescription = CYOA_TERMS[str as keyof typeof CYOA_TERMS];
    if (inWorldDescription !== undefined) {
      return `<GlossaryOverlay variant="in-world" str="${str}" description={\`${inWorldDescription}\`}>${str}</GlossaryOverlay>`;
    } else if (cyoaDescription !== undefined) {
      return `<GlossaryOverlay variant="cyoa" str="${str}" description={\`${cyoaDescription}\`}>${str}</GlossaryOverlay>`;
    } else {
      return str;
    }
  });

  const compiledMarkdown = mdx.compileSync(modifiedMarkdown.join(''), {
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
        h1: Null,
      }}
    />
  );
}

export default Markdown;
