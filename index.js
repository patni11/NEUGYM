// const { save } = require("./storeData.ts");
// const {
//   gymToFile,
//   Timings,
//   daysOfWeek,
//   dayOptions,
//   generateTimeSlots,
//   allGyms,
//   weekDays,
//   weekEnds,
//   timeOptions,
//   roundToNearest30,
// } = require("./constants");

// const GymValues = Object.keys(gymToFile);
// const fs = require("fs");
// const cron = require("node-cron");
// const { scraper } = require("./scraper");

// let personCount;
// let HalfHourJob;

// function main() {
//   const wholeDate = new Date().toLocaleString("en-US", dayOptions); //Whole day looks like 'Wed, 9/21/2022'
//   const day = wholeDate.split(",")[0];
//   const CurrentTime = new Date().toLocaleString("en-US", timeOptions);

//   if (CurrentTime >= "23:53") {
//     HalfHourJob.destroy();
//     console.log("Finished Today's work destroying cron");
//     return;
//   }
//   console.log("running main");
//   const HalfHourJob = cron.schedule(
//     "*/1 * * * *",
//     async () => {
//       try {
//         console.log("Running cron");
//         personCount = await scraper();
//         console.log(personCount);
//         const CT = new Date().toLocaleString("en-US", timeOptions); // current Time
//         const roundedTime = roundToNearest30(CT);

//         console.log("running Saves");
//         await save("Marino2Floor", personCount[0], roundedTime, day);
//         await save("MarinoGymnasium", personCount[1], roundedTime, day);
//         await save("Marino3Floor", personCount[2], roundedTime, day);
//         await save("MarinoCardio", personCount[3], roundedTime, day);
//         await save("MarinoTrack", personCount[4], roundedTime, day);

//         if (["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day)) {
//           if (roundedTime >= Timings.SquashWeekdayStartTime) {
//             await save("SquashBusters", personCount[5], roundedTime, day);
//           }
//         } else {
//           if (day == "Sat") {
//             if (roundedTime >= Timings.SquashSatStartTime) {
//               await save("SquashBusters", personCount[5], roundedTime, day);
//             }
//           } else {
//             if (roundedTime >= Timings.SquashSunStartTime) {
//               await save("SquashBusters", personCount[5], roundedTime, day);
//             }
//           }
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     },
//     {
//       timezone: "America/New_York",
//     }
//   );
// }

// // A Cron job that starts everyday at 5:30
// // starts the main module to control scraper and saving
// cron.schedule(
//   "0 30 5 * * 1-5",
//   () => {
//     console.log("Strating weekday");
//     main();
//   },
//   { timezone: "America/New_York" }
// );

// // A Cron job that starts weekends at 8:00
// // starts the main module to control scraper and saving
// cron.schedule(
//   "0 12 17 * * 6-7",
//   async () => {
//     console.log("starting weekend");
//     main();
//   },
//   { timezone: "America/New_York" }
// );

// A cron job that saves daily data to main CSV
//
// cron.schedule(
//   "0 55 23 * * *",
//   () => {
//     console.log("Saving Today");
//     // ALSO CALL THE SAVE PERM FILE, UPDATE TOM
//     main();
//   },
//   { timezone: "America/New_York" }
// );

// function generateAllPersonCounts(startTime) {
//   let allPersonCountsToday = [];
//   const initialEmptySlots = generateTimeSlots("0:00", startTime, 30).length;
//   while (allPersonCountsToday.length < initialEmptySlots - 2) {
//     allPersonCountsToday.push(0);
//   }
//   return allPersonCountsToday;
// }

// function weekDay() {
//   // Handle Marino
//   console.log("running Weekday");
//   Marino2FloorAllPersonCountsToday = generateAllPersonCounts(
//     Timings.MarinoWeekdayStartTime
//   );
//   MarinoGymnasiumAllPersonCountsToday = generateAllPersonCounts(
//     Timings.MarinoWeekdayStartTime
//   );
//   Marino3FloorAllPersonCountsToday = generateAllPersonCounts(
//     Timings.MarinoWeekdayStartTime
//   );
//   MarinoCardioAllPersonCountsToday = generateAllPersonCounts(
//     Timings.MarinoWeekdayStartTime
//   );
//   MarinoTrackAllPersonCountsToday = generateAllPersonCounts(
//     Timings.MarinoWeekdayStartTime
//   );
//   SquashBustersAllPersonCountsToday = generateAllPersonCounts(
//     Timings.SquashWeekdayStartTime
//   );

//   const wholeDate = new Date().toLocaleString("en-US", dayOptions);
//   const day = wholeDate.split(",")[0];
//   let roundedTime = "00:00";
//   // async function save(startTime, endTime, gym, personCount, day, roundedTime, allPersonCountsToday)
//   console.log("cronJob");
//   cron.schedule("0 1 * * * *", async () => {
//     console.log("Starting Cronjob");
//     const personCount = await scraper();
//     const CurrentTime = new Date().toLocaleString("en-US", timeOptions);
//     roundedTime = roundToNearest30(CurrentTime);

//     Marino2FloorAllPersonCountsToday.push(personCount[0]);
//     MarinoGymnasiumAllPersonCountsToday.push(personCount[1]);
//     Marino3FloorAllPersonCountsToday.push(personCount[2]);
//     MarinoCardioAllPersonCountsToday.push(personCount[3]);
//     MarinoTrackAllPersonCountsToday.push(personCount[4]);
//     SquashBustersAllPersonCountsToday.push(personCount[5]);

//     save(
//       Timings.MarinoWeekdayStartTime,
//       Timings.MarinoEndTime,
//       "Marino2Floor",
//       personCount,
//       day,
//       roundedTime,
//       Marino2FloorAllPersonCountsToday
//     );
//     save(
//       Timings.MarinoWeekdayStartTime,
//       Timings.MarinoEndTime,
//       "MarinoGymnasium",
//       personCount,
//       day,
//       roundedTime,
//       MarinoGymnasiumAllPersonCountsToday
//     );
//     save(
//       Timings.MarinoWeekdayStartTime,
//       Timings.MarinoEndTime,
//       "Marino3Floor",
//       personCount,
//       day,
//       roundedTime,
//       Marino3FloorAllPersonCountsToday
//     );
//     save(
//       Timings.MarinoWeekdayStartTime,
//       Timings.MarinoEndTime,
//       "MarinoCardio",
//       personCount,
//       day,
//       roundedTime,
//       MarinoCardioAllPersonCountsToday
//     );
//     save(
//       Timings.MarinoWeekdayStartTime,
//       Timings.MarinoEndTime,
//       "MarinoTrack",
//       personCount,
//       day,
//       roundedTime,
//       MarinoTrackAllPersonCountsToday
//     );

//     //Handle Squashbusters
//     if (day == "Fri") {
//       save(
//         Timings.SquashWeekdayStartTime,
//         Timings.SquashWeekdayEndTime,
//         "SquashBusters",
//         personCount,
//         day,
//         roundedTime,
//         SquashBustersAllPersonCountsToday
//       );
//     } else {
//       save(
//         Timings.SquashWeekdayStartTime,
//         Timings.SquashWeekendEndTime,
//         "SquashBusters",
//         personCount,
//         day,
//         roundedTime,
//         SquashBustersAllPersonCountsToday
//       );
//     }
//   });

//   // if (roundedTime >= "23:50") {
//   //   saveCronJob.destroy();
//   // }
// }

// function weekEnd() {
//   //Handle Marino
//   save(Timings.MarinoWeekendStartTime, Timings.MarinoEndTime, "Marino2Floor");
//   save(Timings.MarinoWeekendStartTime, Timings.MarinoEndTime, "Marino3Floor");
//   save(
//     Timings.MarinoWeekendStartTime,
//     Timings.MarinoEndTime,
//     "MarinoGymnasium"
//   );
//   save(Timings.MarinoWeekendStartTime, Timings.MarinoEndTime, "MarinoTrack");
//   save(Timings.MarinoWeekendStartTime, TimingsMarinoEndTime, "MarinoCardio");

//   //Handle Squashbusters
//   const wholeDate = new Date().toLocaleString("en-US", dayOptions);
//   const day = wholeDate.split(",")[0]; //Whole day looks like 'Wed, 9/21/2022'
//   if (day == "Sat") {
//     save(
//       Timings.SquashSatStartTime,
//       Timings.SquashWeekendEndTime,
//       "SquashBusters"
//     );
//   } else {
//     save(
//       Timings.SquashSunStartTime,
//       Timings.SquashWeekendEndTime,
//       "SquashBusters"
//     );
//   }
// }
