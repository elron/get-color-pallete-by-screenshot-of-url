const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const ColorThief = require("colorthief");

exports.handler = async (event) => {
  const url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      body: "Missing URL parameter",
    };
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url);
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await browser.close();

    const colorThief = new ColorThief();
    const colors = await colorThief.getPalette(screenshotBuffer, 5);

    const hexColors = colors.map(
      (color) =>
        `#${color.map((c) => c.toString(16).padStart(2, "0")).join("")}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify(hexColors),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
