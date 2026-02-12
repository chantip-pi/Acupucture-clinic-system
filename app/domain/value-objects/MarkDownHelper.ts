import * as React from "react";

type ListItem = {
  content: string;
  indent: number;
};

export function renderText(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  let listItems: ListItem[] = [];
  let orderedItems: {
    content: string;
    bullets: ListItem[];
  }[] = [];

  let currentOrderedItem:
    | { content: string; bullets: ListItem[] }
    | null = null;

  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? React.createElement(
            "strong",
            { key: i },
            part.slice(2, -2)
          )
        : part
    );
  };

  const flushList = (key: number) => {
    if (listItems.length === 0) return;

    elements.push(
      React.createElement(
        "ul",
        {
          key: `ul-${key}`,
          className: "list-disc list-inside mb-3 ml-4 space-y-1",
        },
        listItems.map((item, i) =>
          React.createElement(
            "li",
            { key: i, className: "text-gray-700 ml-" + item.indent * 4 },
            parseBoldText(item.content)
          )
        )
      )
    );

    listItems = [];
  };

  const flushOrderedList = (key: number) => {
    if (currentOrderedItem) {
      orderedItems.push(currentOrderedItem);
      currentOrderedItem = null;
    }

    if (orderedItems.length === 0) return;

    elements.push(
      React.createElement(
        "ol",
        {
          key: `ol-${key}`,
          className: "list-decimal list-inside mb-4 ml-4 space-y-3",
        },
        orderedItems.map((item, i) =>
          React.createElement(
            "li",
            { key: i, className: "text-gray-800" },
            React.createElement(
              React.Fragment,
              null,
              ...parseBoldText(item.content),
              item.bullets.length > 0
                ? React.createElement(
                    "ul",
                    {
                      className: "list-disc ml-6 mt-2 space-y-1",
                    },
                    item.bullets.map((b, j) =>
                      React.createElement(
                        "li",
                        { key: j, className: "text-gray-700" },
                        parseBoldText(b.content)
                      )
                    )
                  )
                : null
            )
          )
        )
      )
    );

    orderedItems = [];
  };

  lines.forEach((line, index) => {
    // Header
    if (line.startsWith("### ")) {
      flushList(index);
      flushOrderedList(index);

      elements.push(
        React.createElement(
          "h3",
          { key: index, className: "text-lg font-semibold mt-4 mb-2" },
          line.replace("### ", "")
        )
      );
    }

    // Numbered list
    else if (/^\s*\d+\.\s+/.test(line)) {
      flushList(index);

      if (currentOrderedItem) {
        orderedItems.push(currentOrderedItem);
      }

      currentOrderedItem = {
        content: line.trim().replace(/^\d+\.\s+/, ""),
        bullets: [],
      };
    }

    // Bullet list
    else if (/^\s*[*-]\s+/.test(line)) {
      const leadingSpaces = line.match(/^(\s*)/)?.[1].length || 0;
      const indent = Math.floor(leadingSpaces / 4);
      const content = line.trim().replace(/^[*-]\s+/, "");

      if (currentOrderedItem) {
        currentOrderedItem.bullets.push({ content, indent });
      } else {
        listItems.push({ content, indent });
      }
    }

    // Paragraph
    else if (line.trim() !== "") {
      flushList(index);
      flushOrderedList(index);

      elements.push(
        React.createElement(
          "p",
          { key: index, className: "mb-2 text-gray-800" },
          parseBoldText(line)
        )
      );
    }
  });

  flushList(lines.length);
  flushOrderedList(lines.length);

  return elements;
}
