import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import MarkdownPreview from "./MarkdownPreview";

const render = (markdown: string): string => {
  return renderToStaticMarkup(<MarkdownPreview markdown={markdown} />);
};

describe("<MarkdownPreview />", () => {
  it("should render headings, emphasis and code", () => {
    const html = render("# Title\n\nsome **bold** and `code`\n");

    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<code>code</code>");
  });

  it("should render lists", () => {
    const html = render("- one\n- two\n\n1. first\n2. second\n");

    expect(html).toContain("<ul><li>one</li><li>two</li></ul>");
    expect(html).toContain("<ol start=\"1\">");
  });

  it("should render tables", () => {
    const html = render("| a | b |\n| - | -: |\n| 1 | 2 |\n");

    expect(html).toContain("<table>");
    expect(html).toContain("<th>a</th>");
    expect(html).toContain("text-align:right");
  });

  it("should render links with a safe target", () => {
    const html = render("[example](https://example.com)");

    expect(html).toContain("href=\"https://example.com\"");
    expect(html).toContain("rel=\"noreferrer noopener\"");
  });

  it("should not render markup contained in the document", () => {
    const html = render("<script>alert(1)</script>\n\n<b>not bold</b>\n");

    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("should not render dangerous link targets", () => {
    const html = render(
      "[click](javascript:alert(1))\n\n![i](javascript:alert(2))\n",
    );

    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<a ");
    expect(html).toContain("<img");
  });
});
