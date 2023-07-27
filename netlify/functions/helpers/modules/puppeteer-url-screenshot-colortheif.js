// const chromium = require("@sparticuz/chromium");
// const puppeteer = require("puppeteer-core");
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import ColorThief from "colorthief";

// const ColorThief = require("colorthief");

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

const rgbToHex = ([r, g, b]) =>
  "#" +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

export async function getHexColors___puppeteer_url_screenshot_colorthief() {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      // defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: chromium.headless,
    });

    console.log("browser created");

    const page = await browser.newPage();
    await page.goto(url);
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await browser.close();
    // console.log('screenshotBuffer', screenshotBuffer);

    const imageURL =
      "data:image/png;base64," + screenshotBuffer.toString("base64");
    // console.log("imageURL", imageURL);

    // const img = resolve(process.cwd(), 'rainbow.png');

    // let imageColor;
    // await ColorThief.getColor(imageURL)
    //   .then((color) => {
    //     imageColor = color;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    let imagePallete;
    await ColorThief.getPalette(imageURL, 5)
      .then((palette) => {
        imagePallete = palette;
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log({ imageColor });
    console.log({ imagePallete });
    // [0,1,2] // rgb array
    const hexColors = imagePallete.map((rgbArray) => rgbToHex(rgbArray));
    // console.log("hexColor", rgbToHex(imageColor));
    console.log("hexColors", hexColors);
    // const hexColors = colors.map(
    //   (color) =>
    //     `#${color.map((c) => c.toString(16).padStart(2, "0")).join("")}`
    // );
    return hexColors;
  } catch (error) {
    console.error(
      "error in getHexColors___puppeteer_url_screenshot_colorthief():",
      error
    );
    throw error;
  }
}
