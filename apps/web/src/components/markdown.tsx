import { Fragment, type ReactNode } from "react";

/**
 * Minimal, dependency-free Markdown renderer for the subset our content uses:
 * ## / ### headings, - bullet lists, **bold**, and paragraphs.
 */
export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`ul-${key++}`}>
        {list.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>
    );
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) {
      flushList();
      blocks.push(<h2 key={`h-${key++}`}>{inline(line.slice(3))}</h2>);
    } else if (line.startsWith("### ")) {
      flushList();
      blocks.push(<h3 key={`h-${key++}`}>{inline(line.slice(4))}</h3>);
    } else if (line.startsWith("- ")) {
      list.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      blocks.push(<p key={`p-${key++}`}>{inline(line)}</p>);
    }
  }
  flushList();

  return <div className="prose-rv">{blocks}</div>;
}

function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
