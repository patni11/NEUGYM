import styles from "../styles/Home.module.css";
import { prisma } from "../server/db/client";
import HeatMap from "../components/HeatMap";
import { timeFields, daysOfWeek, allGyms } from "../constants";
import { useState } from "react";
import Navbar from "../components/navigation";
// interface Props {
//   [key: string]: {
//     [key: string]: {
//       [key: string]: number | null;
//     };
//   };
// }

interface Props {
  dummmyRes: {
    [key: string]: {
      values: {
        frequency: number | null;
        day: string;
        time: string;
      }[];
    };
  };
  currentCount: { [key: string]: number };
}

const Home: React.FunctionComponent<Props> = (props) => {
  const data = props.dummmyRes;
  const currentCount = props.currentCount;

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <br />

        <p>
          <span style={{ color: "#87F5FB" }}> {"Values <= 15,"} </span>
          <span style={{ color: "#69b3a2" }}> {"Values <= 25,"} </span>
          <span style={{ color: "#FABC2A" }}> {"Values <= 35,"} </span>
          <span style={{ color: "#F55D3E" }}> {"Values <= 50,"} </span>
          <span style={{ color: "#FF101F" }}> {"Values > 50"} </span>
        </p>
        <br />
        <br />
        <div style={{ width: "80%", margin: "auto" }}>
          {Object.entries(data).map(([loc, { values }]) => (
            <div key={loc} className={styles.gymEntry}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  verticalAlign: "center",
                }}
              >
                <p className={styles.gymTitle}>{loc}</p>
                <p className={styles.currentCount}>
                  Current Count:{" "}
                  <span style={{ color: "#87F5FB" }}>
                    <strong>{currentCount[loc]}</strong>
                  </span>
                </p>
                <div id={"tooltip" + loc} className={styles.tooltip}></div>
              </div>

              <br />
              <div id="svg-container" className={styles.svg_container}>
                <HeatMap gymData={values} loc={loc}></HeatMap>
              </div>
            </div>
          ))}
          <br />
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  // get the most recent data till past week from the database based on date
  // let data = await prisma.period.groupBy({
  //   by: ["loc", "day", "time"],
  //   orderBy: {
  //     loc: "asc",
  //   },
  //   _avg: {
  //     frequency: true,
  //   },
  // });

  // data = JSON.parse(JSON.stringify(data));

  let currentData = await prisma.period.findMany({
    take: 6,
    orderBy: {
      id: "desc",
    },
  });

  currentData = JSON.parse(JSON.stringify(currentData));
  let currentCount: { [key: string]: number } = {};
  for (const item of currentData) {
    const { loc, frequency } = item;
    if (!currentCount[loc]) {
      currentCount[loc] = frequency;
    }
  }

  type Result = {
    [key: string]: {
      values: {
        frequency: number | null;
        day: string;
        time: string;
      }[];
    };
  };

  // const result: Result = data.reduce((acc, curr) => {
  //   const {
  //     _avg: { frequency },
  //     loc,
  //     day,
  //     time,
  //   } = curr;
  //   if (!acc[loc]) {
  //     acc[loc] = { values: [] };
  //   }
  //   acc[loc].values.push({ frequency, day, time });
  //   return acc;
  // }, {} as Result);

  // console.log(result);

  const dummmyRes: Result = {};
  allGyms.forEach((gym) => {
    const value: { day: string; time: string; frequency: number | null }[] = [];
    daysOfWeek.forEach((day) => {
      timeFields.forEach((time) => {
        const v = {
          day: day,
          time: time,
          frequency: Math.floor(Math.random() * 65),
        };
        value.push(v);
        //dummmyRes[gym] = { values: [...dummmyRes[gym]?.values || [], value] };
      });
    });
    dummmyRes[gym] = { values: value };
  });

  // const result: {
  //   [key: string]: {
  //     [key: string]: {
  //       [key: string]: number | null;
  //     };
  //   };
  // } = {};

  // const result: {
  //   [key: string]: {
  //     [key: string]: {
  //       [key: string]: number | null;
  //     };
  //   };
  // } = {};

  // for (const item of data) {
  //   const {
  //     _avg: { frequency },
  //     loc,
  //     day,
  //     time,
  //   } = item;

  //   if (!result[loc]) {
  //     result[loc] = {};
  //   }
  //   if (!result[loc][day]) {
  //     result[loc][day] = {};
  //   }

  //   result[loc][day][time] = frequency;
  // }

  // console.log("result:", dummmyRes);

  return {
    props: { dummmyRes, currentCount },
  };
}

export default Home;
