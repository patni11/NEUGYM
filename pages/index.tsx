import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { prisma } from '../server/db/client'
import { useEffect, useState } from 'react'

interface Gym {
  loc: string;
  day: string;
  time: string;
  frequency: number;
}

const Home = ({gym}:{gym:Gym[]}) => {

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

{gym.map((gym,i) => {
  return (
    <div key={i}>
      <p>{gym.loc}</p>
      <p>{gym.day}</p>
      <p>{gym.time}</p>
      <p>{gym.frequency}</p>
    </div>
  )})}
  
</div>

        <button onClick={runFunc}> RUN </button>

      </main>
    </div>
  )
}

export async function getServerSideProps() {
// get the most recent data till past week from the database based on date 
const data = await prisma.period.groupBy({
  by: ['loc','day','time'],
  _avg: {
    frequency: true,
  },
})

console.log()

  return {
    props: {gym: JSON.parse(JSON.stringify(data))}
  }
}

export default Home
