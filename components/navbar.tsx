import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'

import db from '@/lib/db'
import PanenSwitcher from './panen-switcher'
import { MainNav } from './main-nav'

const navbar = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const panen = await db.panen.findMany({
    where: {
      userId,
    },
  })

  return (
    <div className="border-b border-[#051747] bg-[#52613A] sticky top-0 z-40 w-full">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:px-10">
        <MainNav className="order-1 shrink-0 md:order-3" />
        <div className="relative order-2 hidden h-10 w-32 shrink-0 sm:block md:order-1 lg:w-44">
          <Image src="/img/lg.png" alt="logo" fill className="object-contain object-left" />
        </div>
        <div className="order-3 min-w-0 flex-1 md:order-2 md:flex-none max-w-full">
          <PanenSwitcher items={panen} />
        </div>

        <div className="order-4 ml-auto flex shrink-0 items-center">
          <UserButton afterSwitchSessionUrl="" />
        </div>
      </div>
    </div>
  )
}

export default navbar