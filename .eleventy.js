module.exports = function (eleventyConfig) {
  const markdownIt = require("markdown-it");
  const { katex } = require("@mdit/plugin-katex");
  const markdownItAnchor = require("markdown-it-anchor");
  const { DateTime } = require("luxon");
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  const typographyByCategory = [
    { name: "Poetry", useHan: true, hanClass: "han-vertical" },
    { name: "Sketch", useHan: true, hanClass: "" },
    { name: "Philosophy", useHan: true, hanClass: "" },
    { name: "Code", useHan: false, wrapperClass: "markdown-body" },
    { name: "Physics", useHan: false, wrapperClass: "typo-physics" }
  ];
  const slugify = (value) => {
    return value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };
  const markdownLib = markdownIt({ html: true, linkify: true, breaks: true })
    .use(katex, { output: "mathml" })
    .use(markdownItAnchor, { level: [1, 2, 3, 4], slugify });

  eleventyConfig.addPassthroughCopy({ "public": "/" });
  eleventyConfig.addFilter("utcDate", (value) => {
    return DateTime.fromJSDate(value, { zone: "utc" }).toFormat("dd LLL yy 'UTC'");
  });
  eleventyConfig.addFilter("markdownify", (value = "") => {
    return markdownLib.render(value);
  });
  eleventyConfig.addFilter("tocFromHtml", (html = "", prefix = "") => {
    const items = [];
    const headingPattern = /<h([1-4])([^>]*)id="([^"]+)"([^>]*)>([\s\S]*?)<\/h\1>/g;
    let match;
    while ((match = headingPattern.exec(html)) !== null) {
      const level = Number(match[1]);
      const id = match[3];
      const text = match[5].replace(/<[^>]+>/g, "").trim();
      if (text) {
        const prefixedId = prefix ? `${prefix}--${id}` : id;
        items.push({ level, id: prefixedId, text });
      }
    }
    return items;
  });
  eleventyConfig.addFilter("prefixHeadings", (html = "", prefix = "") => {
    if (!prefix) return html;
    return html
      .replace(/<h([1-6])([^>]*)id="([^"]+)"([^>]*)>/g, (match, level, pre, id, post) => {
        return `<h${level}${pre}id="${prefix}--${id}"${post}>`;
      })
      .replace(/href="#([^"]+)"/g, (match, id) => {
        return `href="#${prefix}--${id}"`;
      });
  });
  eleventyConfig.addFilter("typographyConfig", (categories = []) => {
    const list = Array.isArray(categories) ? categories : [categories];
    const match = typographyByCategory.find((entry) => list.includes(entry.name));
    if (match) {
      return {
        useHan: match.useHan,
        hanClass: match.hanClass || "",
        wrapperClass: match.wrapperClass || ""
      };
    }
    return { useHan: true, hanClass: "", wrapperClass: "" };
  });
  eleventyConfig.addFilter("groupByCategory", (posts = []) => {
    const map = new Map();
    posts.forEach((post) => {
      const categories = post.data.categories || ["Uncategorized"];
      const list = Array.isArray(categories) ? categories : [categories];
      list.forEach((category) => {
        if (!map.has(category)) map.set(category, []);
        map.get(category).push(post);
      });
    });
    return Array.from(map.entries())
      .map(([category, items]) => ({ category, items }))
      .sort((a, b) => a.category.localeCompare(b.category));
  });
  eleventyConfig.setLibrary(
    "md",
    markdownLib
  );
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addShortcode("ruby", (kanji, romaji, lang = "zh-Latn") => {
    return `<ruby>${kanji}<rt lang="${lang}">${romaji}</rt></ruby>`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
