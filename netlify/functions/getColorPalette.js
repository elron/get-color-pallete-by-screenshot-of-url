const chromium = require("chrome-aws-lambda");

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
    const executablePath = await chromium.executablePath;

    // PUPPETEER_EXECUTABLE_PATH is set from my Dockerfile to /usr/bin/chromium-browser
    // for development.
    const browser = await chromium.puppeteer.launch({
      args: await chromium.args,
      executablePath: executablePath || process.env.PUPPETEER_EXECUTABLE_PATH,
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
