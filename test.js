import { getHexColors } from "./netlify/functions/helpers/getHexColors.js";

(async () => {
  await getHexColors("https://hafonton.co.il");
  // await getHexColors("https://visite360pro.com");
})();
