import ReactMarkdown, { Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Markdown(props: Readonly<Options>) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      {...props}
      components={{
        h1() {
          return null;
        },
      }}
    />
  );
}

export default Markdown;
