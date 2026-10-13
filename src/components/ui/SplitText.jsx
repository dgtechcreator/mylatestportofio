import { Children, isValidElement } from 'react';

/**
 * Wraps each word (and each inline element) in a masked span so it can slide
 * up with a stagger. Text children are split on whitespace; <br> is left alone.
 * Animate via `.go .w>span` / `.in .w>span` on an ancestor.
 */
export default function SplitText({ children }) {
  let index = 0;
  const out = [];

  Children.toArray(children).forEach((node, k) => {
    if (typeof node === 'string') {
      node.split(/(\s+)/).forEach((part, j) => {
        if (!part) return;
        if (!part.trim()) {
          out.push(part);
          return;
        }
        out.push(
          <span className="w" key={`${k}-${j}`}>
            <span style={{ '--i': index++ }}>{part}</span>
          </span>,
        );
      });
    } else if (isValidElement(node) && node.type === 'br') {
      out.push(node);
    } else {
      out.push(
        <span className="w" key={k}>
          <span style={{ '--i': index++ }}>{node}</span>
        </span>,
      );
    }
  });

  return out;
}
