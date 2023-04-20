const chromium = require("chrome-aws-lambda");

const ColorThief = require("colorthief");

const rgbToHex = ([r, g, b]) =>
  "#" +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

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
    //   executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || executablePath,
      headless: true,
    });

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
