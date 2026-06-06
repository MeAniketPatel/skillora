import { describe, it, expect } from "vitest";
import { sanitizeRichHtml, sanitizeInlineHtml } from "./sanitize";

describe("sanitizeRichHtml", () => {
  it("strips script tags entirely", () => {
    const input = `<p>Hello</p><script>alert('xss')</script>`;
    const out = sanitizeRichHtml(input);
    expect(out).not.toContain("<script");
    expect(out).not.toContain("alert");
  });

  it("strips on* event handlers", () => {
    const input = `<p onclick="alert(1)">click me</p>`;
    const out = sanitizeRichHtml(input);
    expect(out).not.toMatch(/onclick/i);
    expect(out).not.toMatch(/alert/i);
  });

  it("strips javascript: URLs", () => {
    const input = `<a href="javascript:alert(1)">link</a>`;
    const out = sanitizeRichHtml(input);
    expect(out).not.toMatch(/javascript:/i);
  });

  it("preserves safe formatting tags", () => {
    const input = `<h1>Title</h1><p>Body with <strong>bold</strong> and <em>em</em>.</p><ul><li>One</li></ul>`;
    const out = sanitizeRichHtml(input);
    expect(out).toContain("<h1>Title</h1>");
    expect(out).toContain("<strong>bold</strong>");
    expect(out).toContain("<em>em</em>");
    expect(out).toContain("<li>One</li>");
  });

  it("preserves <code> and <pre> blocks", () => {
    const input = `<pre><code>const x = 1;</code></pre>`;
    const out = sanitizeRichHtml(input);
    expect(out).toContain("<pre>");
    expect(out).toContain("<code>");
    expect(out).toContain("const x = 1;");
  });

  it("strips <iframe>", () => {
    const input = `<iframe src="https://evil.example"></iframe><p>safe</p>`;
    const out = sanitizeRichHtml(input);
    expect(out).not.toMatch(/<iframe/i);
    expect(out).toContain("<p>safe</p>");
  });

  it("handles empty input", () => {
    expect(sanitizeRichHtml("")).toBe("");
    expect(sanitizeRichHtml("   ")).toBeTruthy();
  });
});

describe("sanitizeInlineHtml", () => {
  it("strips block tags", () => {
    const input = `<p>hello</p><div>world</div>`;
    const out = sanitizeInlineHtml(input);
    expect(out).not.toMatch(/<p>/i);
    expect(out).not.toMatch(/<div>/i);
  });

  it("preserves inline formatting", () => {
    const input = `Hello <strong>world</strong>`;
    const out = sanitizeInlineHtml(input);
    expect(out).toContain("<strong>world</strong>");
  });

  it("strips scripts", () => {
    const input = `<script>alert(1)</script>hello`;
    const out = sanitizeInlineHtml(input);
    expect(out).not.toMatch(/<script/i);
  });
});
