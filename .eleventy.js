module.exports = function (eleventyConfig) {
  const markdownIt = require("markdown-it");
  const { katex } = require("@mdit/plugin-katex");
  const markdownItAnchor = require("markdown-it-anchor");
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  const normalizePostUrl = (url = "") => {
    const [path, query = ""] = String(url).split("?");
    if (!path) return "/";
    const normalizedPath = path.endsWith("/") ? path : `${path}/`;
    return query ? `${normalizedPath}?${query}` : normalizedPath;
  };

  const bilingualPoemPlugin = (md) => {
    const renderLine = (line, leftLang, rightLang) => {
      const dividerIndex = line.indexOf("||");
      const left = dividerIndex === -1 ? line : line.slice(0, dividerIndex).trimEnd();
      const right = dividerIndex === -1 ? "" : line.slice(dividerIndex + 2).trimStart();
      const leftAttr = leftLang ? ` lang="${md.utils.escapeHtml(leftLang)}"` : "";
      const rightAttr = rightLang ? ` lang="${md.utils.escapeHtml(rightLang)}"` : "";
      const leftHtml = md.renderInline(left);
      const rightHtml = right ? md.renderInline(right) : "";
      const rightClass = right ? "bilingual-poem-translation" : "bilingual-poem-translation is-empty";

      return [
        `<div class="bilingual-poem-original"${leftAttr}>${leftHtml}</div>`,
        `<div class="${rightClass}"${rightAttr}>${rightHtml}</div>`
      ].join("");
    };

    const renderBlock = (rawContent, leftLang = "", rightLang = "zh-Hant") => {
      const rows = rawContent.split(/\r?\n/).map((line) => {
        if (!line.trim()) {
          return '<div class="bilingual-poem-break" aria-hidden="true"></div>';
        }
        return renderLine(line, leftLang, rightLang);
      });

      return `<div class="bilingual-poem">${rows.join("")}</div>\n`;
    };

    const bilingualPoemRule = (state, startLine, endLine, silent) => {
      let pos = state.bMarks[startLine] + state.tShift[startLine];
      let max = state.eMarks[startLine];
      const markerLine = state.src.slice(pos, max).trim();
      const match = markerLine.match(/^:::\s*bilingual-poem(?:\s+([^\s]+))?(?:\s+([^\s]+))?\s*$/);

      if (!match) return false;
      if (silent) return true;

      const contentLines = [];
      let nextLine = startLine + 1;

      for (; nextLine < endLine; nextLine += 1) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        const line = state.src.slice(pos, max);

        if (line.trim() === ":::") {
          break;
        }

        contentLines.push(line);
      }

      if (nextLine >= endLine) return false;

      state.line = nextLine + 1;

      const token = state.push("html_block", "", 0);
      token.map = [startLine, state.line];
      token.content = renderBlock(contentLines.join("\n"), match[1], match[2]);

      return true;
    };

    md.block.ruler.before("fence", "bilingual_poem", bilingualPoemRule, {
      alt: ["paragraph", "reference", "blockquote", "list"]
    });
  };

  const typographyByCategory = {
    Poetry: "han-init-context han-vertical",
    Sketch: "han-init-context",
    Philosophy: "han-init-context",
    Literature: "han-init-context typo-literature",
    Code: "markdown-body",
    Physics: "typo-physics"
  };
  const markdownLib = markdownIt({ html: true, linkify: true, breaks: true })
    .use(katex, { output: "mathml" })
    .use(bilingualPoemPlugin)
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
  eleventyConfig.addFilter("findPostByUrl", (posts = [], targetUrl = "") => {
    const normalizedTarget = normalizePostUrl(targetUrl);
    return (posts || []).find((post) => normalizePostUrl(post.url) === normalizedTarget);
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
