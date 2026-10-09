'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const menu = [
  { label: 'Home', href: '/user' },
  { label: 'Ganti Role', href: '/pick-role' },
]

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#52613A] shadow-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 sm:h-16 sm:px-6">
          <Link href="/user" className="flex min-w-0 items-center">
            <div className="relative h-8 w-28 sm:h-10 sm:w-44">
              <Image src="/img/lg.png" alt="Pasartani" fill className="object-contain object-left" />
            </div>
          </Link>

          <nav className="flex shrink-0 items-center gap-3 sm:gap-5">
            {menu.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                aria-label={m.label}
                className={cn(
                  'inline-flex items-center gap-1.5 text-sm font-medium text-white underline-offset-4 hover:underline active:underline',
                  pathname === m.href && 'underline'
                )}
              >
              </Link>
            ))}

            <UserButton />
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </>
  )
}