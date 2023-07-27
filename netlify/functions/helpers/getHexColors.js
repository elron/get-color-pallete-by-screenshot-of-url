import { getHexColors___url_css_files_popular_hex } from "./modules/url-css-files-popular-hex.js"; // works in netlify
import { getHexColors___url_thumbio_image_getImageColors } from "./modules/url-thumio-image-getImageColors.js"; // works in netlify
// import { getHexColors___puppeteer_url_screenshot_colorthief } from "./modules/puppeteer-url-screenshot-colortheif.js";

// Function to run three promises and return the value of the first resolved promise
function runPromises(promises) {
  // Helper function to handle promises and resolve with the first resolved value
  function resolveFirst(promises) {
    return new Promise((resolve) => {
      promises.forEach((promise) => {
        promise
          .then((value) => {
            resolve(value);
          })
          .catch(() => {
            // Ignore rejected promises
          });
      });
    });
  }

  // Call the helper function and return the first resolved value
  return resolveFirst(promises);
}

export async function getHexColors(url) {
  const hexColorsTries = [
    getHexColors___url_css_files_popular_hex(url),
    getHexColors___url_thumbio_image_getImageColors(url),
    // getHexColors___puppeteer_url_screenshot_colorthief(url), // This breaks in live netlify build: RangeError: Maximum call stack size exceeded
  ];
  const hexColors = await runPromises(hexColorsTries);

  console.log("DONE!!!!!! hexColors:", hexColors);
  return hexColors;
  // return ['test', 'worked'];
}
