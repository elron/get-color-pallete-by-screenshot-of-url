import { getHexColors } from "./helpers/getHexColors.js";

export async function handler(event) {
  const url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      body: "Missing URL parameter",
    };
  }

  console.log("url is fine");

  try {
    const hexColors = await getHexColors(url);

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
