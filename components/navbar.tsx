import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { MainNav } from './main-nav'
import PanenSwitcher from './panen-switcher'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import db from '@/lib/db'


const navbar =async () => {
    const { userId} = await auth();

    if(!userId) {
        redirect('/sign-in')
    }

    const panen = await db.panen.findMany({
        where :{
            userId
        }
    })

  return (
    <div className="border-b border-[#051747]">
        <div className="flex h-16 items-center px-4">
            <PanenSwitcher items={panen}/>
            <MainNav className="mx-6"/>
            <div className='ml-auto flex items-center space-x-4'>
                <UserButton afterSwitchSessionUrl=''/>
            </div>          
        </div>
        </div>
  )
}

export default navbar