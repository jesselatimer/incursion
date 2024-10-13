import { keyBy } from 'lodash';
import { IN_WORLD_TERMS, CYOA_TERMS } from './../data/glossary';
import GlossaryOverlay from './GlossaryOverlay';
import * as mdx from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

function Null() {
  return null;
}

const IN_WORLD_TERMS_BY_PLURAL = keyBy(IN_WORLD_TERMS, 'plural');
const CYOA_TERMS_BY_PLURAL = keyBy(CYOA_TERMS, 'plural');

function Markdown({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (!children || typeof children !== 'string') return null;
  console.log(IN_WORLD_TERMS_BY_PLURAL);

  const markdownList = children.split(/([^a-zA-z])/);
  const modifiedMarkdown = markdownList.map((str: string) => {
    const inWorldDescription =
      IN_WORLD_TERMS[str.toLowerCase() as keyof typeof IN_WORLD_TERMS]
        ?.description ??
      IN_WORLD_TERMS_BY_PLURAL[str.toLowerCase() as keyof typeof IN_WORLD_TERMS]
        ?.description;
    const cyoaDescription =
      CYOA_TERMS[str as keyof typeof CYOA_TERMS]?.description ??
      CYOA_TERMS_BY_PLURAL[str as keyof typeof CYOA_TERMS]?.description;
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
    <div className={className}>
      <Markdown
        components={{
          GlossaryOverlay,
          h1: Null,
        }}
      />
    </div>
  );
}

export default Markdown;
