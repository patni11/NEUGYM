import { Location } from "@prisma/client";
export const daysOfWeek = ["Sun", "Sat", "Fri", "Thu", "Wed", "Tue", "Mon"];
const monthsStr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
// A function to run at Specified Time(5:00AM EST) everyday
// get the today's date, day, month, year

export enum Day {
  Sun = "Sun",
  Mon = "Mon",
  Tue = "Tue",
  Wed = "Wed",
  Thu = "Thu",
  Fri = "Fri",
  Sat = "Sat",
}

const gymToFile = {
  Marino2Floor: [
    "./data/MarinoCenter2Floor.json",
    "./data/moreData/MarinoCenter2Floor.csv",
  ],
  Marino3Floor: [
    "./data/MarinoCenter3FloorWeight.json",
    "./data/moreData/MarinoCenter3FloorWeight.csv",
  ],
  MarinoGymnasium: [
    "./data/MarinoCenterGym.json",
    "./data/moreData/MarinoCenterGym.csv",
  ],
  MarinoTrack: ["./data/MarinoTrack.json", "./data/moreData/MarinoTrack.csv"],
  MarinoCardio: [
    "./data/MarinoCenter3FloorCardio.json",
    "./data/moreData/MarinoCenter3FloorCardio.csv",
  ],
  SquashBusters: [
    "./data/MarinoSquashBusters.json",
    "./data/moreData/MarinoSquashBusters.csv",
  ],
};

export const allGyms = [
  "Marino2Floor",
  "MarinoGymnasium",
  "Marino3Floor",
  "MarinoCardio",
  "MarinoTrack",
  "SquashBusters",
];

export const Timings = {
  MarinoEndTime: "23:49",
  MarinoWeekdayStartTime: "5:30",
  MarinoWeekendStartTime: "8:00",
  SquashWeekdayStartTime: "6:00",
  SquashWeekdayEndTime: "23:49",
  SquashWeekendEndTime: "21:00",
  SquashSatStartTime: "08:00",
  SquashSunStartTime: "10:00",
};

export const timeFields = [
  "5:00",
  "5:30",
  "6:00",
  "6:30",
  "7:00",
  "7:30",
  "8:00",
  "8:30",
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

export function dayToString(day: Day) {
  if (day == Day.Sun) {
    return "Sun";
  } else if (day == Day.Mon) {
    return "Mon";
  } else if (day == Day.Tue) {
    return "Tue";
  } else if (day == Day.Wed) {
    return "Wed";
  } else if (day == Day.Thu) {
    return "Thu";
  } else if (day == Day.Fri) {
    return "Fri";
  } else if (day == Day.Sat) {
    return "Sat";
  }
}

export function stringToDay(str: string): Day {
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

export function whatday(str: string) {
  switch (str) {
    case "Mon":
      return 1;
    case "Tue":
      return 2;
    case "Wed":
      return 3;
    case "Thu":
      return 4;
    case "Fri":
      return 5;
    case "Sat":
      return 6;
    case "Sun":
      return 7;
    default:
      return "Wrong, please enter a number between 1 and 7";
  }
}

export const timeStringToMinutes = (timeStr: string, separator: string) =>
  timeStr
    .split(separator)
    .reduce((h: string, m: string) => parseInt(h) * 60 + m);

export const minutesToTimeString = (minutes: number, separator: string) => {
  const minutesPart = (minutes % 60).toString().padStart(2, "0");
  const hoursPart = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  return hoursPart + separator + minutesPart;
};

export const url =
  "https://connect2concepts.com/connect2/?type=circle&key=2A2BE0D8-DF10-4A48-BEDD-B3BC0CD628E7";

export function roundToNearest30(time: string) {
  const t = time.split(":");
  if (parseInt(t[1]) < 30) {
    return `${t[0]}:00`;
  } else {
    return `${t[0]}:30`;
  }
}

export const timeOptions: Intl.DateTimeFormatOptions = {
  timeZone: "America/New_York",
  hour12: false,
  timeStyle: "short",
};

export const dayOptions: Intl.DateTimeFormatOptions = {
  timeZone: "America/New_York",
  year: "numeric",
  month: "numeric",
  day: "numeric",

  weekday: "short",
};

//Don't really need files anymore Shubh, what do we do here instead now?
// Idk how to write a for loop in TS lol plz look it up
// async function createFields(file) {
//   const savedDataFile = await fs.readFileSync(file);
//   let gymData = JSON.parse(savedDataFile);

//   for (var i = 4; i < csvFields.length; i++) {
//     for (each of daysOfWeek) {
//       if (!gymData[each][csvFields[i]]) {
//         gymData[each][csvFields[i]] = { Average: 0, Count: 0, CurrentCount: 0 };
//       }
//     }
//   }
//   await fs.writeFileSync(file, JSON.stringify(gymData));
// }

//FROM STACKOVERFLOW

export function generateTimeSlots(
  startStr: string,
  endStr: string,
  periodInMinutes: number,
  separator = ":"
) {
  let startMinutes = timeStringToMinutes(startStr, separator);
  let endMinutes = timeStringToMinutes(endStr, separator);
  const oneDayInMinutes = 1440;
  const endMinutesUpdated: number =
    parseInt(endMinutes) >= oneDayInMinutes
      ? oneDayInMinutes - 1
      : parseInt(endMinutes);
  // if (parseInt(endMinutes) >= oneDayInMinutes) {
  //   const endMinutes = oneDayInMinutes - 1;
  //if (startMinutes <= 0) startMinutes = 0;

  const startMinutesUpdated: number =
    parseInt(startMinutes) <= 0 ? 0 : parseInt(startMinutes);

  return Array.from(
    {
      length:
        Math.floor(
          (endMinutesUpdated - startMinutesUpdated) / periodInMinutes
        ) + 1,
    },
    (_, i) =>
      minutesToTimeString(startMinutesUpdated + i * periodInMinutes, separator)
  );
}

//new Date().toLocaleString("en-US",
