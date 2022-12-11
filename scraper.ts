import * as puppeteer from "puppeteer";
import { Tesseract } from "tesseract.ts";
import * as fs from "fs";
import { url } from "./constants";

async function scrapeData(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: "example.png", fullPage: true });
  await browser.close();
  await recognizeText();
}

async function recognizeText() {
  await Tesseract.recognize("./example.png", "eng").then(({ text }) => {
    fs.writeFileSync("./siteRawData.txt", text);
  });
}

async function cleanData() {
  const personCount = [];
  const data = await fs.readFileSync("./siteRawData.txt", {
    encoding: "utf8",
    flag: "r",
  });
  const values = data.split("\n") || "";
  try {
    for (var line of values) {
      if (line.includes("Last Count")) {
        for (var each of line?.replace(/\s+/, "").match(/(\d+)/g) || "") {
          personCount.push(each);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  return personCount;
}

export async function scraper() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("scraping");
      await scrapeData(url);
      const personCount = await cleanData();
      resolve(personCount);
    } catch (e) {
      reject(e);
    }
  });
}
