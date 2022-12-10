import { PrismaClient, Location } from "@prisma/client";
import { Day } from "./constants";

const prisma = new PrismaClient();

export async function save(
  gym: Location,
  personCount: number,
  roundedTime: string,
  day: Day
) {
  console.log(`Saving ${gym} file`);

  return new Promise(async (resolve, reject) => {
    try {
      const GymData = await prisma.period.create({
        data: {
          time: roundedTime,
          frequency: personCount,
          day: day,
          loc: gym,
        },
      });
      console.log(GymData);

      resolve(`Saved Data for ${gym} at ${roundedTime}`);
    } catch (e) {
      reject(e);
    }
  });
}
