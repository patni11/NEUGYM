import { Location } from "@prisma/client";
import { createScheduledFunction } from "inngest";
import axios from "axios";
import { JSDOM } from "jsdom";

import {
  url,
  Day,
  Timings,
  stringToDay,
  roundToNearest30,
  timeOptions,
  dayOptions,
} from "../constants";

// async function getBrowserInstance() {
//   const chromium = require("chrome-aws-lambda");
//   const executablePath = await chromium.executablePath;

//   if (!executablePath) {
//     const puppeteer = require("puppeteer");
//     return await puppeteer.launch({
//       args: chromium.args,
//       headless: true,
//       defaultViewport: {
//         width: 1280,
//         height: 720,
//       },
//       ignoreHTTPSErrors: true,
//     });
//   }

//   return await chromium.puppeteer.launch({
//     args: chromium.args,
//     executablePath,
//     headless: true,
//     defaultViewport: {
//       width: 1280,
//       height: 720,
//     },
//     ignoreHTTPSErrors: true,
//   });
// }

const getPersonCount = async (url: string) => {
  try {
    const res = await fetch(url);
    const html = await res.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const divCounters = document.querySelectorAll(
      'div[style="text-align:center;"]'
    );

    const lastCounts: any[] = [];

    divCounters.forEach((centerDiv) => {
      const textContent = centerDiv.textContent;

      if (textContent) {
        const lastCountMatch = textContent.match(/Last Count: (\d+)/);
        if (lastCountMatch) {
          const lastCount = lastCountMatch[1];
          lastCounts.push(lastCount);
        }
      }
    });
    return lastCounts;
  } catch (e) {
    return [];
  }
};

async function scrapeData(url: string) {
  try {
    // const browser = await getBrowserInstance();
    // const page = await browser.newPage();

    // await page.goto(url);

    // const grapText = await page.evaluate(() => {
    //   // const centerDivs = document.querySelectorAll(
    //   //   'div[style="text-align:center;"]'
    //   // );

    //   const centerDivs = document.querySelectorAll("panel-body");

    //   console.log(document);

    //   const lastCounts: any[] = [];

    //   centerDivs.forEach((centerDiv) => {
    //     const textContent = centerDiv.textContent;

    //     const lastCountMatch = textContent.match(/Last Count: (d+)/);
    //     if (lastCountMatch) {
    //       const lastCount = lastCountMatch[1];
    //       lastCounts.push(lastCount);
    //     }
    //   });

    //   return lastCounts;
    // });

    const personCount: string[] = await getPersonCount(url);

    // const image = await page.screenshot({
    //   type: "jpeg",
    //   quality: 100,
    //   omitBackground: false,
    //   fullPage: true,
    // });

    // const base64Image = await image.toString('base64');
    // await page.screenshot({ path: "example.png", fullPage: true });
    // await browser.close();

    // await Tesseract.recognize(image, "eng").then(({ text }) => {
    //   console.log(text);
    //   const values = text.split("\n") || "";
    //   try {
    //     for (var line of values) {
    //       if (line.includes("Last Count")) {
    //         for (var each of line?.replace(/\s+/, "").match(/(\d+)/g) || "") {
    //           personCount.push(each);
    //         }
    //       }
    //     }
    //     console.log("read screen shot inside try");
    //   } catch (e) {
    //     console.log("oops hit the catch while using tesseract");
    //     console.log(e);
    //   }
    // });
    // console.log(personCount);
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
      console.log("scraping done");
      resolve(personCount);
    } catch (e) {
      reject(e);
    }
  });
}

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
