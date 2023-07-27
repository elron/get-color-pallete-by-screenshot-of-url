import getImageColors from "get-image-colors";
// const getColors = require('get-image-colors');

import fetch from "node-fetch";

async function arrayBufferToBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

export async function getHexColors___url_thumbio_image_getImageColors(url) {
  const imageURL = `http://image.thum.io/get/width/1200/auth/67497-4874b446276eb76c6ee94b6c2442bc25/${url}`;
  console.log('imageURL', imageURL);
  try {
    const response = await fetch(imageURL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = await arrayBufferToBuffer(arrayBuffer);
    const colors = await getImageColors(imageBuffer, "image/png");

    const hexColors = colors.map((color) => color.hex());

    return hexColors;
  } catch (error) {
    console.error(
      "Error fetching image or getting color scheme:",
      error.message
    );
    throw "getHexColors___url_thumbio_image_getImageColors";
  }
}

// Example usage
// const imageUrl =
//   'http://image.thum.io/get/width/1200/auth/67497-4874b446276eb76c6ee94b6c2442bc25/https://www.demetralambros.com';
//   getHexColors___url_thumbio_image_getImageColors(imageUrl)
//   .then((colors) => {
//     console.log('Dominant colors in the image:', colors);
//   })
//   .catch((error) => {
//     console.error('Error:', error.message);
//   });
