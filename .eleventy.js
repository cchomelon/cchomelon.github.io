module.exports = function (eleventyConfig) {
  const markdownIt = require("markdown-it");
  const { katex } = require("@mdit/plugin-katex");
  const { DateTime } = require("luxon");

  eleventyConfig.addPassthroughCopy({ "public": "/" });
  eleventyConfig.addFilter("utcDate", (value) => {
    return DateTime.fromJSDate(value, { zone: "utc" }).toFormat("dd LLL yy 'UTC'");
  });
  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true, linkify: true }).use(katex, { output: "mathml" })
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
