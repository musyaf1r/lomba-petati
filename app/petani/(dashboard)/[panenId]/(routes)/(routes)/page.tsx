import { Hargaps } from '@/components/hargaps';
import db from '@/lib/db'
import React from 'react'

interface Dashboardpageprops{
  params:Promise<{panenId:string}>
}
const  Dashboard = async ({params}:Dashboardpageprops) => {
  const {panenId} = await params;
  const panen = await db.panen.findFirst({
    where:{
      id: panenId
    }
  })

  return (
    <Hargaps></Hargaps>
  )
}

export default Dashboard;