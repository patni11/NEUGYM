import { Period } from "@prisma/client";

import { prisma } from "../../server/db/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      // Process a POST request
      const { time, frequency, day, loc } = req.body;
      const frequencyInt = parseInt(frequency);
      console.log("POSTING");
      const post: Period = await prisma.period.create({
        data: {
          time,
          frequency: frequencyInt,
          day,
          loc,
        },
      });
      console.log("POSTED");
      res.status(200).json(post);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
