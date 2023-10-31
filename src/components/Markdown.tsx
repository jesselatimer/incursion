import ReactMarkdown, { Options } from 'react-markdown';

function Markdown(props: Readonly<Options>) {
  return (
    <ReactMarkdown
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
