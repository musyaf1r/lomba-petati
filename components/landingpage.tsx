'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Handshake, Menu, Sprout, Target, X } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menu = [
  { label: "Home", href: "/" },
  { label: "Tentang Pasartani", href: "#tentang" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Untuk Petani", href: "#petani" },
  { label: "Untuk Pembeli", href: "#pembeli" },
]

const keunggulan = [
  { icon: Clock, judul: "Cepat", teks: "Cek harga pasar dan rencana tanam dalam hitungan menit." },
  { icon: Target, judul: "Tepat", teks: "Perencanaan tanam berdasarkan informasi pasar." },
  { icon: Handshake, judul: "Langsung ke pembeli", teks: "Hubungi pembeli lewat WhatsApp tanpa perantara." },
]

const steps = [
  { nomor: 1, label: "Cek Pasar" },
  { nomor: 2, label: "Rencana Tanam" },
  { nomor: 3, label: "Cari Pembeli" },
  { nomor: 4, label: "Panen & Jual" },
]

const fitur = [
  {
    judul: "Smart Crop Planner",
    deskripsi: "Rekomendasi dan perkiraan kondisi pasar untuk membantu perencanaan tanam.",
  },
  {
    judul: "Harga Pasar",
    deskripsi: "Informasi harga dari berbagai pasar sebagai referensi.",
  },
  {
    judul: "Direct-to-Buyer",
    deskripsi: "Menghubungkan petani dengan calon pembeli.",
  },
  {
    judul: "Edukasi",
    deskripsi: "Materi singkat tentang budidaya dan pascapanen.",
  },
]

export const LandingPage = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-[#fdfaf4] text-[#3a2e22]">
      <header className="sticky top-0 z-50 w-full bg-[#52613A] shadow-sm">
        <nav className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <div className="relative h-9 w-36 sm:h-10 sm:w-48">
              <Image src="/img/lg.png" alt="Pasartani" fill className="object-contain object-left" />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-white">
            {menu.map((m) => (
              <Link key={m.label} className="hover:underline" href={m.href}>
                {m.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ size: "default" }),
                "rounded-full bg-white text-[#4a5d3a] hover:bg-white/90 font-medium px-5"
              )}
            >
              Login
            </Link>

            <button
              type="button"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden text-white p-2 -mr-2"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden border-t border-white/15 bg-[#52613A] px-4 pb-4">
            <div className="flex flex-col py-2">
              {menu.map((m) => (
                <Link
                  key={m.label}
                  href={m.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm text-white border-b border-white/10 last:border-0"
                >
                  {m.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <section className="bg-linear-to-b from-[#eef2e2] to-[#fdfaf4]">
        <div className="max-w-6xl mx-auto px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#8a4a2a]">
              Tanam Lebih Tepat, Jual Lebih Pasti.
            </h1>
            <p className="mt-4 text-muted-foreground max-w-md">
              Pasartani membantu petani merencanakan tanam berdasarkan informasi pasar dan
              menghubungkan hasil panen dengan pembeli.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {keunggulan.map((k) => (
                <div key={k.judul} className="flex items-start gap-3">
                  <div className="h-11 w-11 shrink-0 rounded-full bg-[#dfe8c8] text-[#4a5d3a] flex items-center justify-center">
                    <k.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{k.judul}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{k.teks}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-10 w-full sm:w-auto rounded-xl bg-[#4a5d3a] hover:bg-[#3d4d30] px-10 h-12 text-base"
              )}
            >
              Mulai Sekarang
            </Link>
          </div>

          <div className="w-full flex justify-center lg:justify-end">
    <Image src="/img/landingpage/f1.jpeg" width={800} height={1000} alt="Petani di sawah" className="rounded-2xl shadow-lg" />
</div>
        </div>
      </section>

      <section id="tentang" className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-[#8a4a2a] mb-8">Bagaimana Pasartani Membantu?</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-[#c9c4b8] z-0" />
          {steps.map((step) => (
            <div key={step.nomor} className="flex flex-col items-center gap-2 relative z-10 bg-[#fdfaf4] px-2">
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold text-white",
                  step.nomor % 2 === 0 ? "bg-[#d97b4a]" : "bg-[#4a3d2e]"
                )}
              >
                {step.nomor}
              </div>
              <span className="text-xs text-center">{step.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="cara-kerja" className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-[#8a4a2a] mb-6">Fitur Pasartani</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fitur.map((f) => (
            <div key={f.judul} className="bg-[#c9d6a8] rounded-2xl p-5">
              <p className="font-semibold mb-1">{f.judul}</p>
              <p className="text-sm text-[#3a2e22]/80">{f.deskripsi}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div id="petani" className="text-center">
          <h3 className="text-lg font-bold text-[#8a4a2a] mb-3">Untuk Petani</h3>
          <div className="relative h-40 rounded-2xl overflow-hidden mb-3">
            <Image src="/img/landingpage/f2.png" alt="Untuk Petani" fill className="object-cover" />
          </div>
          <p className="text-sm text-muted-foreground">
            Dapatkan informasi pasar, rencanakan tanam, dan temukan peluang pembeli dalam satu platform.
          </p>
        </div>
        <div id="pembeli" className="text-center">
          <h3 className="text-lg font-bold text-[#8a4a2a] mb-3">Untuk Pembeli</h3>
          <div className="relative h-40 rounded-2xl overflow-hidden mb-3">
            <Image src="/img/landingpage/f3.png" alt="Untuk Pembeli" fill className="object-cover" />
          </div>
          <p className="text-sm text-muted-foreground">
            Temukan hasil pertanian sesuai kebutuhan dan rencana pembelian.
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h2 className="text-xl font-bold text-[#8a4a2a] mb-2">Siap Merencanakan dengan Lebih Terarah?</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Mulai gunakan Pasartani sebagai referensi untuk keputusan pertanian.
        </p>
      </section>

      <footer className="bg-[#4a5d3a] text-white mt-10">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 font-semibold mb-2">
              <div className="relative h-10 w-40">
                <Image src="/img/lg.png" alt="Pasartani" fill className="object-contain object-left" />
              </div>
            </div>
            <p className="text-white/70 text-xs">
              Menghubungkan petani dengan informasi pasar, perencanaan tanam, dan peluang pembeli untuk
              membantu mengambil keputusan pertanian dengan lebih terarah.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Navigasi</p>
            <ul className="space-y-1 text-white/70">
              <li>Tentang Pasartani</li>
              <li>Cara Kerja</li>
              <li>Untuk Petani</li>
              <li>Untuk Pembeli</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Fitur</p>
            <ul className="space-y-1 text-white/70">
              <li>Smart Crop Planner</li>
              <li>Harga Pasar</li>
              <li>Direct-to-Buyer</li>
              <li>Edukasi</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Bantuan</p>
            <ul className="space-y-1 text-white/70">
              <li>Pusat Bantuan</li>
              <li>Hubungi Kami</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-white/50 py-4 border-t border-white/10">
          © 2026 Pasartani. Semua hak dilindungi.
        </div>
      </footer>
    </div>
  )
}