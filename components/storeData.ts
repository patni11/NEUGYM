// import axios from "axios";
// import { Day } from "../constants";
// import { Location } from "@prisma/client";

// export async function save(
//   gym: Location,
//   personCount: number,
//   roundedTime: string,
//   day: Day
// ) {
//   console.log(`Saving ${gym} file`);

//   try {
//     console.log("Saving Data");
//     // await axios
//     //   .post("", {
//     //     time: roundedTime,
//     //     frequency: personCount,
//     //     day: day,
//     //     loc: gym,
//     //   })
//     //   .then((res) => {
//     //     console.log(res.data);
//     //   });
//     await axios
//       .post("http://localhost:3000/api/save", {
//         time: roundedTime,
//         frequency: personCount,
//         day: day,
//         loc: gym,
//       })
//       .then((res) => {
//         console.log(res.data);
//       });
//   } catch (error) {
//     console.log(error);
//   }
// }
