module.exports = function (eleventyConfig) {
  const markdownIt = require("markdown-it");
  const { katex } = require("@mdit/plugin-katex");
  const { DateTime } = require("luxon");
  const markdownLib = markdownIt({ html: true, linkify: true, breaks: true }).use(
    katex,
    {
    output: "mathml"
    }
  );

  eleventyConfig.addPassthroughCopy({ "public": "/" });
  eleventyConfig.addFilter("utcDate", (value) => {
    return DateTime.fromJSDate(value, { zone: "utc" }).toFormat("dd LLL yy 'UTC'");
  });
  eleventyConfig.addFilter("markdownify", (value = "") => {
    return markdownLib.render(value);
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
