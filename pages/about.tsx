import React from "react";
import Navbar from "../components/navigation";
import styles from "../styles/About.module.css";

function About() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <div style={{ width: "70%", fontSize: "larger" }}>
          <p>
            {" "}
            This project was created in response to crazy wait times at gyms at
            Northeastern. Most people have similar workout routine: push, pull,
            legs and use same machines. Wait times for some machines could be as
            long as 2 hours. (those damn squat racks). <br></br>
            <br></br>
            This website would help you manage your time and effectively choose
            the most efficient period of time on any day of the week. The
            website collects and updates data every 30 minutes, so its as up to
            date as possible. <br></br>
            <br></br>
            <br></br>
            Created with ❤️ by{" "}
            <span>
              {" "}
              <a
                href="https://www.shubhpatni.com"
                style={{ color: "turquoise" }}
              >
                Shubh Patni :)
              </a>{" "}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default About;
