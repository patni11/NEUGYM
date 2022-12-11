import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { prisma } from '../server/db/client'


const Home: NextPage = ({gym}) => {

  const runFunc = async () => {
    console.log('running');
    const { data } = await axios.post('/api/scraper');
    console.log(data)
  }

  return (
    <div className={styles.container}>


      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">NEU Gym Trends</a>
        </h1>


<div>
          {gym.map((period:any) => (
            <div key={period.time}>
              <h4>{period.loc}</h4>
              <h5>{period._avg.frequency}</h5>
              <h6>{period.day}</h6>
              <h6>{period.time}</h6>
            </div>

          ))}
</div>

        <button onClick={runFunc}> RUN </button>

      </main>
    </div>
  )
}

export async function getServerSideProps() {
// get the most recent data till past week from the database based on date 
const gym = await prisma.period.groupBy({
  by: ['loc','day','time'],
  _avg: {
    frequency: true,
  },
})

console.log(JSON.parse(JSON.stringify(gym)))

  return {
    props: {gym: JSON.parse(JSON.stringify(gym))}
  }
}

export default Home
