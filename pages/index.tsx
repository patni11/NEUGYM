import styles from "../styles/Home.module.css";
import { prisma } from "../server/db/client";
import HeatMap from "../components/HeatMap";
import { timeFields, daysOfWeek, allGyms } from "../constants";

// interface Props {
//   [key: string]: {
//     [key: string]: {
//       [key: string]: number | null;
//     };
//   };
// }

interface Props {
  [key: string]: {
    values: {
      frequency: number | null;
      day: string;
      time: string;
    }[];
  };
}

const Home: React.FunctionComponent<Props> = (props) => {
  const data = props.dummmyRes;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Welcome to <a href="https://nextjs.org">NEU Gym Trends</a>
        </h3>
        <br />
        <br />
        {Object.entries(data).map(([loc, { values }]) => (
          <div key={loc} style={{ position: "relative" }}>
            <h2>{loc}</h2>

            <div
              id={"tooltip" + loc}
              style={{ position: "absolute", right: "0", bottom: "15" }}
            ></div>
            <br />
            <HeatMap gymData={values} loc={loc}></HeatMap>
          </div>
        ))}

        {/* <HeatMap gymData={data["Marino2Floor"].values}></HeatMap> */}

        {/* <div>
          {Object.entries(data).map(([loc, { values }]) => (
            <div key={loc}>
              <h3>{loc}</h3>
              {values.map(({ frequency, day, time }) => (
                <div key={day + time}>
                  <p>Frequency: {frequency}</p>
                  <p>Day: {day}</p>
                  <p>Time: {time}</p>
                </div>
              ))}
            </div>
          ))}
        </div> */}
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
          frequency: Math.floor(Math.random() * 100),
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
    props: { dummmyRes },
  };
}

export default Home;
