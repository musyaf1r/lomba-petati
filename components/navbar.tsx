import { UserButton } from '@clerk/nextjs'

import PanenSwitcher from './panen-switcher'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import Image from 'next/image'
import { MainNav } from './main-nav'


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
    <div className="border-b border-[#051747] bg-[#52613A] sticky top-0 z-40 w-full">
        <div className="flex h-16 items-center px-10">
            <div className="relative h-10 w-50 shrink-0 mr-2">
        <Image src="/img/lg.png" alt="logo" fill className="object-contain"/>
    </div>  
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