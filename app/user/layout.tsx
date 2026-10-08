import Link from "next/link"
import Image from "next/image"
import { SignOutButton, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function PenggunaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return (
    <div className="min-h-screen bg-[#fdfaf4]">
      <header className="sticky top-0 z-50 w-full bg-[#52613A] shadow-sm">
        <nav className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-6xl mx-auto">
          <Link href="/pengguna" className="flex items-center gap-2 text-white font-semibold">
            <div className="relative h-10 w-50 ">
              <Image src="/img/lg.png" alt="logo" fill className="object-contain"/>
            </div>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link href="/pengguna" className="text-white font-medium">
              Home
            </Link>

            <Link
              href="/pick-role"
              className="inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors"
            >
              <p className="hidden sm:inline">Ganti Peran</p>
            </Link>
            <UserButton />
          </div>
        </nav>
      </header>

      {children}
    </div>
  )
}