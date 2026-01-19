module.exports = function (eleventyConfig) {
  const markdownIt = require("markdown-it");
  const { katex } = require("@mdit/plugin-katex");
  const markdownItAnchor = require("markdown-it-anchor");
  const { DateTime } = require("luxon");
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
  eleventyConfig.addFilter("tocFromHtml", (html = "") => {
    const items = [];
    const headingPattern = /<h([2-4]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
    let match;
    while ((match = headingPattern.exec(html)) !== null) {
      const level = Number(match[1]);
      const id = match[2];
      const text = match[3].replace(/<[^>]+>/g, "").trim();
      if (text) {
        items.push({ level, id, text });
      }
    }
    return items;
  });
  eleventyConfig.setLibrary(
    "md",
    markdownLib
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
