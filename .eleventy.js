module.exports = function (eleventyConfig) {
  const markdownIt = require("markdown-it");
  const { katex } = require("@mdit/plugin-katex");
  const markdownItAnchor = require("markdown-it-anchor");
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  const typographyByCategory = {
    Poetry: "han-init-context han-vertical",
    Sketch: "han-init-context",
    Philosophy: "han-init-context",
    Code: "markdown-body",
    Physics: "typo-physics"
  };
  const markdownLib = markdownIt({ html: true, linkify: true, breaks: true })
    .use(katex, { output: "mathml" })
    .use(markdownItAnchor, { level: [1, 2, 3, 4] });

  eleventyConfig.addPassthroughCopy({ "public": "/" });
  eleventyConfig.addFilter("utcDate", (value) => {
    const d = new Date(value);
    const day = String(d.getUTCDate()).padStart(2, "0");
    const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
    const yr = String(d.getUTCFullYear()).slice(-2);
    return `${day} ${mon} ${yr} UTC`;
  });
  eleventyConfig.addFilter("tocFromHtml", (html = "", prefix = "") => {
    const items = [];
    const headingPattern = /<h([1-4])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
    let match;
    while ((match = headingPattern.exec(html)) !== null) {
      const level = Number(match[1]);
      const id = match[2];
      const text = match[3].replace(/<[^>]+>/g, "").trim();
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
      .replace(/(<[^>]+\s)id="([^"]+)"/g, (match, start, id) => {
        return `${start}id="${prefix}--${id}"`;
      })
      .replace(/href="#([^"]+)"/g, (match, id) => {
        return `href="#${prefix}--${id}"`;
      });
  });
  eleventyConfig.addFilter("typographyConfig", (categories = []) => {
    const list = Array.isArray(categories) ? categories : [categories];
    for (const cat of list) {
      if (typographyByCategory[cat]) return typographyByCategory[cat];
    }
    return "han-init-context";
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
