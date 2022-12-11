// pages/api/cron.ts

import { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import { scraper } from "../../scraper";
import { save } from "../storeData";
import { Location } from "@prisma/client";
import { Day } from "../../constants";

import {
  dayOptions,
  timeOptions,
  roundToNearest30,
  Timings,
  dayToString,
  stringToDay,
} from "../../constants";
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

      res.status(200).json({ success: true });
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
