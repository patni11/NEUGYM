// pages/api/cron.ts

// import { NextApiRequest, NextApiResponse } from "next";
// import { verifySignature } from "@upstash/qstash/nextjs";
import { Location } from "@prisma/client";
import puppeteer from "puppeteer";
import { Tesseract } from "tesseract.ts";
import axios from "axios";
import { createScheduledFunction } from "inngest";
import chrome from "chrome-aws-lambda";
import { executablePath } from "puppeteer";

import {
  url,
  Day,
  Timings,
  stringToDay,
  roundToNearest30,
  timeOptions,
  dayOptions,
} from "../constants";

async function save(
  gym: Location,
  personCount: number,
  roundedTime: string,
  day: Day
) {
  console.log(`Saving ${gym} file`);

  try {
    console.log("Saving Data");
    await axios
      .post("http://localhost:3000/api/save", {
        time: roundedTime,
        frequency: personCount,
        day: day,
        loc: gym,
      })
      .then((res) => {
        console.log(res.data);
      });
  } catch (error) {
    console.log(error);
  }
}

async function scrapeData(url: string) {
  let options = {};
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [
        ...chrome.args,
        "--hide-scrollbars",
        "--no-sandbox",
        "--disable-web-security",
        "--disable-setuid-sandbox",
      ],
      defaultViewport: null,
      executablePath: executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    };
  } else {
    options = {
      args: [
        ...chrome.args,
        "--hide-scrollbars",
        "--no-sandbox",
        "--disable-web-security",
        "--disable-setuid-sandbox",
      ],
      defaultViewport: null,
      executablePath: executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  //1600 × 1666

  try {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    await page.setViewport({
      width: 800,
      height: 833,
      deviceScaleFactor: 1,
    });

    await page.goto(url);
    const image = await page.screenshot({
      type: "jpeg",
      quality: 100,
      omitBackground: true,
      fullPage: true,
    });

    console.log("took screen shot");
    // const base64Image = await image.toString('base64');
    await page.screenshot({ path: "example.png", fullPage: true });
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
  } catch (e) {
    console.log(e);
  }
}

async function scraper() {
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

//random comment
const handler = async () => {
  try {
    //Day
    const wholeDate = new Date().toLocaleString("en-US", dayOptions); //Whole day looks like 'Wed, 9/21/2022'
    const day = wholeDate.split(",")[0];
    const dayUpdated: Day = day ? stringToDay(day) : Day.Sun;

    //Count
    let personCount: Array<number> = (await scraper()) as Array<number>;
    console.log(personCount);

    //Time
    const CT = new Date().toLocaleString("en-US", timeOptions); // current Time
    const roundedTime = roundToNearest30(CT);

    console.log("running Saves");
    await save(Location.Marino2Floor, personCount[0], roundedTime, dayUpdated);
    await save(
      Location.MarinoGymnasium,
      personCount[1],
      roundedTime,
      dayUpdated
    );
    await save(Location.Marino3Floor, personCount[2], roundedTime, dayUpdated);
    await save(Location.MarinoCardio, personCount[3], roundedTime, dayUpdated);
    await save(Location.MarinoTrack, personCount[4], roundedTime, dayUpdated);

    if (["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day)) {
      if (roundedTime >= Timings.SquashWeekdayStartTime) {
        await save(
          Location.SquashBusters,
          personCount[5],
          roundedTime,
          dayUpdated
        );
      }
    } else {
      if (day == "Sat") {
        if (roundedTime >= Timings.SquashSatStartTime) {
          await save(
            Location.SquashBusters,
            personCount[5],
            roundedTime,
            dayUpdated
          );
        }
      } else {
        if (roundedTime >= Timings.SquashSunStartTime) {
          await save(
            Location.SquashBusters,
            personCount[5],
            roundedTime,
            dayUpdated
          );
        }
      }
    }

    console.log("done");
  } catch ({ message }) {
    console.log(message);
  }
};

// export default handler;  // WORKS LOCALLY
// export default verifySignature(handler);  // WORKS LOCALLY

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// DOES NOT WORK AT ALL throws error - TypeError: resolver is not a function
export default createScheduledFunction(
  "handler", // The name of your function, used for observability.
  "0,30 5-23 * * *", // The cron syntax for the function
  handler // The function code, defined above.
);
