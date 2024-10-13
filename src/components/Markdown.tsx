import { keyBy } from 'lodash';
import { IN_WORLD_TERMS, CYOA_TERMS } from './../data/glossary';
import GlossaryOverlay from './GlossaryOverlay';
import * as mdx from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { useMemo } from 'react';

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
  const CompiledMarkdown = useMemo(() => {
    if (!children || typeof children !== 'string') return null;

    const usedKeys = new Set();

    const markdownList = children.split(/([^a-zA-z])/);
    const modifiedMarkdown = markdownList.map((str: string) => {
      const inWorldDescription =
        IN_WORLD_TERMS[str.toLowerCase() as keyof typeof IN_WORLD_TERMS]
          ?.description ??
        IN_WORLD_TERMS_BY_PLURAL[
          str.toLowerCase() as keyof typeof IN_WORLD_TERMS
        ]?.description;
      const cyoaDescription =
        CYOA_TERMS[str as keyof typeof CYOA_TERMS]?.description ??
        CYOA_TERMS_BY_PLURAL[str as keyof typeof CYOA_TERMS]?.description;
      if (usedKeys.has(str.toLowerCase())) {
        return str;
      } else if (inWorldDescription !== undefined) {
        usedKeys.add(str.toLowerCase());
        return `<GlossaryOverlay variant="in-world" str="${str}" description={\`${inWorldDescription}\`}>${str}</GlossaryOverlay>`;
      } else if (cyoaDescription !== undefined) {
        usedKeys.add(str.toLowerCase());
        return `<GlossaryOverlay variant="cyoa" str="${str}" description={\`${cyoaDescription}\`}>${str}</GlossaryOverlay>`;
      } else {
        return str;
      }
    });

    const compiledMarkdown = mdx.compileSync(modifiedMarkdown.join(''), {
      outputFormat: 'function-body',
    });

    const { default: CompiledMarkdown } = mdx.runSync(
      String(compiledMarkdown),
      {
        ...runtime,
        Fragment: 'fragment',
      }
    );

    return CompiledMarkdown;
  }, []);

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
