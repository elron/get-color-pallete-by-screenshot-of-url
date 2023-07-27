import { JSDOM } from "jsdom";
// import jsdom from "jsdom";
// const { JSDOM } = jsdom;

// import sanitizeHtml from "sanitize-html";

import { ColorTranslator } from "colortranslator";

function appendDomain(domain, url) {
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  } else {
    return `${domain}${url}`;
  }
}

export async function getHexColors___url_css_files_popular_hex(url) {
  const response = await fetch(url);
  const html = await response.text();

  //   const htmlLinks = sanitizeHtml(html, {
  //     allowedTags: [`link`],
  //     allowedAttributes: false,
  //   });

  /**
   * JSDOM
   */
  const dom = new JSDOM(html);
  console.log("dom", dom);
  const cssFiles = [
    ...dom.window.document.querySelectorAll('link[rel="stylesheet"]'),
  ].map((link) => link.href);

  const cssUrls = cssFiles.map((cssUrl) => appendDomain(url, cssUrl));

  // console.log('cssUrls', cssUrls);

  const cssContents = await Promise.all(
    cssUrls.map((cssUrl) =>
      fetch(cssUrl)
        .then((res) => res.text())
        .catch(() => "")
    )
  );

  // const regex = /#[a-fA-F0-9]{6}/g;

  // const regex =
  /#(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*(?:1|0?\.\d+))?\s*\)|hsla?\(\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?%\s*,\s*\d+(?:\.\d+)?%\s*(?:,\s*(?:1|0?\.\d+))?\s*\)|\b(?:aliceblue|antiquewhite|aqua(?:marine)?|azure|beige|bisque|black|blanchedalmond|blue(?:violet)?|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan(?:ic)?|dark(?:blue|cyan|goldenrod|gray|grey|khaki|green|olive|orange|orchid|red|salmon|seagreen|slate(?:blue|gray|grey)|turquoise|violet)|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|grey|green(?:yellow)?|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender(?:blush)?|lawn(?:green)?|lemonchiffon|light(?:blue|coral|cyan|goldenrodyellow|gray|grey|green|pink|salmon|seagreen|yellow)|lime(?:green)?|linen|magenta|maroon|medium(?:aquamarine|blue|orchid|purple)|midnightblue|mintcream|mistyrose|moccasin|navy|oldlace|olive|orange(?:red)?|orchid|pale(?:goldenrod|green|turquoise|violet(?:red)?)|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red(?:violet)?|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet(?:red)?|wheat|white|whitesmoke|yellow(?:green)?|transparent)\b/g;
  // This regular expression matches hex colors (#abc, #abcdef), RGB and RGBA colors (rgb(255, 0, 0), rgba(255, 0, 0, 0.5)), HSL and HSLA colors (hsl(0, 100%, 50%), hsla(0, 100%, 50%, 0.5)), and named colors (red, blue, cornflowerblue,
  const regex =
    /#(?:[a-fA-F0-9]{3,6})(?!\w)|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*(?:1|0?\.\d+))?\s*\)|hsla?\(\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?%\s*,\s*\d+(?:\.\d+)?%\s*(?:,\s*(?:1|0?\.\d+))?\s*\)|\b(?:aliceblue|antiquewhite|aqua(?:marine)?|azure|beige|bisque|black|blanchedalmond|blue(?:violet)?|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan(?:ic)?|dark(?:blue|cyan|goldenrod|gray|grey|khaki|green|olive|orange|orchid|red|salmon|seagreen|slate(?:blue|gray|grey)|turquoise|violet)|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|grey|green(?:yellow)?|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender(?:blush)?|lawn(?:green)?|lemonchiffon|light(?:blue|coral|cyan|goldenrodyellow|gray|grey|green|pink|salmon|seagreen|yellow)|lime(?:green)?|linen|magenta|maroon|medium(?:aquamarine|blue|orchid|purple)|midnightblue|mintcream|mistyrose|moccasin|navy|oldlace|olive|orange(?:red)?|orchid|pale(?:goldenrod|green|turquoise|violet(?:red)?)|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red(?:violet)?|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet(?:red)?|wheat|white|whitesmoke|yellow(?:green)?|transparent)\b/g;

  const colors = cssContents.join("").match(regex);

  const hexColors = colors
    ?.map((color) => {
      try {
        return ColorTranslator.toHEX(color);
      } catch (error) {
        return "";
      }
    })
    .filter((empty) => empty);

  const sortedColors = getMostPopularColors(hexColors);

  return sortedColors.slice(0, 6);
}

const getMostPopularColors = (colorArray) => {
  const colorMap = {};

  // Iterate through the colors and count their frequency
  colorArray.forEach((color) => {
    if (colorMap[color]) {
      colorMap[color] += 1;
    } else {
      colorMap[color] = 1;
    }
  });

  // Sort the colors based on their frequency
  const sortedColors = Object.keys(colorMap).sort(
    (a, b) => colorMap[b] - colorMap[a]
  );

  return sortedColors;
};
