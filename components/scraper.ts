import * as puppeteer from "puppeteer";
import { Tesseract } from "tesseract.ts";
import { url } from "../constants";

async function scrapeData(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const image = await page.screenshot({
    type: "jpeg",
    quality: 100,
    omitBackground: true,
    fullPage: true,
  });
  console.log("took screen shot");
  // const base64Image = await image.toString('base64');
  // await page.screenshot({ path: "/tmp/example.png", fullPage: true });
  await browser.close();
  const personCount: string[] = [];

  await Tesseract.recognize(image, "eng").then(({ text }) => {
    const values = text.split("\n") || "";
    try {
      for (var line of values) {
        if (line.includes("Last Count")) {
          for (var each of line?.replace(/\s+/, "").match(/(\d+)/g) || "") {
            personCount.push(each);
          }
        }
      }
      console.log("read screen shot inside try");
    } catch (e) {
      console.log("oops hit the catch while using tesseract");
      console.log(e);
    }
  });
  return personCount;
}

export async function scraper() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("scraping");
      const personCount = await scrapeData(url);
      console.log("scraping done, here the person count", personCount);
      resolve(personCount);
    } catch (e) {
      reject(e);
    }
  });
}
