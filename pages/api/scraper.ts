// pages/api/cron.ts

import { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import { Location } from "@prisma/client";
import * as puppeteer from "puppeteer";
import { Tesseract } from "tesseract.ts";
import axios from "axios";

const url =
  "https://connect2concepts.com/connect2/?type=circle&key=2A2BE0D8-DF10-4A48-BEDD-B3BC0CD628E7";

enum Day {
  Sun = "Sun",
  Mon = "Mon",
  Tue = "Tue",
  Wed = "Wed",
  Thu = "Thu",
  Fri = "Fri",
  Sat = "Sat",
}

const Timings = {
  MarinoEndTime: "23:49",
  MarinoWeekdayStartTime: "5:30",
  MarinoWeekendStartTime: "8:00",
  SquashWeekdayStartTime: "6:00",
  SquashWeekdayEndTime: "23:49",
  SquashWeekendEndTime: "21:00",
  SquashSatStartTime: "08:00",
  SquashSunStartTime: "10:00",
};

function stringToDay(str: string): Day {
  if (str == "Sun") {
    return Day.Sun;
  } else if (str == "Mon") {
    return Day.Mon;
  } else if (str == "Tue") {
    return Day.Tue;
  } else if (str == "Wed") {
    return Day.Wed;
  } else if (str == "Thu") {
    return Day.Thu;
  } else if (str == "Fri") {
    return Day.Fri;
  } else if (str == "Sat") {
    return Day.Sat;
  } else {
    return Day.Sun;
  }
}

function roundToNearest30(time: string) {
  const t = time.split(":");
  if (parseInt(t[1]) < 30) {
    return `${t[0]}:00`;
  } else {
    return `${t[0]}:30`;
  }
}

const timeOptions: Intl.DateTimeFormatOptions = {
  timeZone: "America/New_York",
  hour12: false,
  timeStyle: "short",
};

const dayOptions: Intl.DateTimeFormatOptions = {
  timeZone: "America/New_York",
  year: "numeric",
  month: "numeric",
  day: "numeric",

  weekday: "short",
};

async function save(
  gym: Location,
  personCount: number,
  roundedTime: string,
  day: Day
) {
  console.log(`Saving ${gym} file`);

  try {
    console.log("Saving Data");
    // await axios
    //   .post("", {
    //     time: roundedTime,
    //     frequency: personCount,
    //     day: day,
    //     loc: gym,
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //   });
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
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
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
      await save(
        Location.Marino2Floor,
        personCount[0],
        roundedTime,
        dayUpdated
      );
      await save(
        Location.MarinoGymnasium,
        personCount[1],
        roundedTime,
        dayUpdated
      );
      await save(
        Location.Marino3Floor,
        personCount[2],
        roundedTime,
        dayUpdated
      );
      await save(
        Location.MarinoCardio,
        personCount[3],
        roundedTime,
        dayUpdated
      );
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

      res.send("OK");
    } catch ({ message }) {
      res.status(500).json({ statusCode: 500, message: message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

// export default handler;
export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
