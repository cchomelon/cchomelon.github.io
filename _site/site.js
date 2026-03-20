(function () {
  const parser = new DOMParser();
  const cache = new Map();
  const shellSelector = "[data-post-shell]";
  const panelSelector = "[data-post-panel]";
  const panelContainerSelector = "[data-post-panel-container]";
  const tocSelector = "[data-post-toc-region]";
  const labelSelector = "[data-post-panel-label]";
  const postLinkSelector = "[data-post-link]";

  const normalizeUrl = (value) => {
    const resolved = new URL(value, window.location.href);
    resolved.hash = "";
    return `${resolved.pathname}${resolved.search}`;
  };

  const sameOrigin = (value) => {
    const resolved = new URL(value, window.location.href);
    return resolved.origin === window.location.origin;
  };

  const getShell = (root = document) => root.querySelector(shellSelector);

  const collectPayload = (root = document, value = window.location.href) => {
    const shell = getShell(root);
    const panel = root.querySelector(panelSelector);
    const tocRegion = root.querySelector(tocSelector);
    const label = root.querySelector(labelSelector);

    if (!shell || !panel || !tocRegion || !label) {
      return null;
    }

    return {
      url: normalizeUrl(value),
      title: root.title || document.title,
      panelHtml: panel.outerHTML,
      tocHtml: tocRegion.innerHTML,
      panelLabel: label.textContent || "Blog Entry",
      currentPostUrl: shell.getAttribute("data-current-post-url") || normalizeUrl(value)
    };
  };

  const cachePayload = (payload) => {
    if (!payload) return;
    cache.set(payload.url, Promise.resolve(payload));
  };

  const fetchPayload = (value) => {
    const url = normalizeUrl(value);
    if (cache.has(url)) {
      return cache.get(url);
    }

    const request = fetch(url, {
      headers: {
        "X-Requested-With": "post-shell"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url}`);
        }
        return response.text();
      })
      .then((html) => {
        const nextDocument = parser.parseFromString(html, "text/html");
        const payload = collectPayload(nextDocument, url);
        if (!payload) {
          throw new Error(`Missing post shell in ${url}`);
        }
        return payload;
      })
      .catch((error) => {
        cache.delete(url);
        throw error;
      });

    cache.set(url, request);
    return request;
  };

  const updateActiveLinks = (currentPostUrl) => {
    const normalizedCurrentUrl = normalizeUrl(currentPostUrl);
    document.querySelectorAll(postLinkSelector).forEach((link) => {
      const isActive = normalizeUrl(link.href) === normalizedCurrentUrl;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const renderSwappedContent = () => {
    if (typeof window.renderHanContexts !== "function") return;

    const panel = document.querySelector(panelSelector);
    const tocRegion = document.querySelector(tocSelector);
    if (panel) {
      window.renderHanContexts(panel);
    }
    if (tocRegion) {
      window.renderHanContexts(tocRegion);
    }
  };

  const scrollToPanel = () => {
    const panelContainer = document.querySelector(panelContainerSelector);
    if (!panelContainer) return;
    panelContainer.scrollIntoView({ block: "start" });
    if (typeof panelContainer.scrollTop === "number") {
      panelContainer.scrollTop = 0;
    }
  };

  const applyPayload = (payload, options = {}) => {
    const shell = getShell();
    const panelContainer = document.querySelector(panelContainerSelector);
    const tocRegion = document.querySelector(tocSelector);
    const label = document.querySelector(labelSelector);

    if (!shell || !panelContainer || !tocRegion || !label) {
      window.location.assign(payload.url);
      return;
    }

    shell.setAttribute("data-current-post-url", payload.currentPostUrl);
    label.textContent = payload.panelLabel;
    panelContainer.innerHTML = payload.panelHtml;
    tocRegion.innerHTML = payload.tocHtml;
    document.title = payload.title;
    updateActiveLinks(payload.currentPostUrl);
    renderSwappedContent();

    if (options.push !== false) {
      window.history.pushState({ url: payload.url }, "", payload.url);
    }

    if (options.scroll !== false) {
      scrollToPanel();
    }
  };

  const navigateTo = async (value, options = {}) => {
    const shell = getShell();
    const nextUrl = normalizeUrl(value);

    if (!shell) {
      window.location.assign(nextUrl);
      return;
    }

    if (!options.force && nextUrl === normalizeUrl(window.location.href)) {
      return;
    }

    shell.setAttribute("data-post-loading", "true");

    try {
      const payload = await fetchPayload(nextUrl);
      applyPayload(payload, options);
    } catch (error) {
      if (options.push === false) {
        window.location.assign(nextUrl);
      } else {
        window.location.assign(nextUrl);
      }
    } finally {
      shell.removeAttribute("data-post-loading");
    }
  };

  const prefetch = (value) => {
    const shell = getShell();
    if (!shell) return;

    const nextUrl = normalizeUrl(value);
    if (nextUrl === normalizeUrl(window.location.href)) return;

    fetchPayload(nextUrl).catch(() => {});
  };

  const canIntercept = (event, link) => {
    if (!link || !getShell()) return false;
    if (event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.target && link.target !== "_self") return false;
    if (!sameOrigin(link.href)) return false;
    return true;
  };

  const bindVisiblePrefetch = () => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = entry.target;
        prefetch(link.href);
        observer.unobserve(link);
      });
    }, {
      rootMargin: "120px 0px"
    });

    document.querySelectorAll(postLinkSelector).forEach((link) => {
      observer.observe(link);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    const payload = collectPayload(document, window.location.href);
    if (!payload) return;

    cachePayload(payload);
    updateActiveLinks(payload.currentPostUrl);
    bindVisiblePrefetch();
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest(postLinkSelector);
    if (!canIntercept(event, link)) return;
    event.preventDefault();
    navigateTo(link.href);
  });

  document.addEventListener("mouseover", (event) => {
    const link = event.target.closest(postLinkSelector);
    if (!link) return;
    prefetch(link.href);
  });

  document.addEventListener("focusin", (event) => {
    const link = event.target.closest(postLinkSelector);
    if (!link) return;
    prefetch(link.href);
  });

  window.addEventListener("popstate", () => {
    if (!getShell()) return;
    navigateTo(window.location.href, {
      force: true,
      push: false
    });
  });
})();
