import Link from "next/link"
import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  return (
    <div className="bg-[#fdfaf4] text-[#3a2e22]">
      <header className="sticky top-0 z-50 w-full bg-[#52613A] shadow-sm">
    <nav className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-white">
            <div className="relative h-10 w-50">
                <Image src="/img/lg.png" alt="Pasartani" fill className="object-contain" />
            </div>
        </Link>
        <Link
            href="/sign-in"
            className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full bg-white text-[#4a5d3a] hover:bg-white/90 font-medium"
            )}
        >
            Login
        </Link>
    </nav>
</header>
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#8a4a2a] max-w-xl">
          Tanam Lebih Tepat, Jual Lebih Pasti.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md">
          Pasartani membantu petani merencanakan tanam berdasarkan informasi pasar dan
          menghubungkan hasil panen dengan pembeli.
        </p>
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ size: "sm" }),
            "mt-5 rounded-full bg-[#4a5d3a] hover:bg-[#3d4d30]"
          )}
        >
          Mulai Sekarang
        </Link>

        <div className="relative mt-8 rounded-3xl overflow-hidden h-64 sm:h-80">
          <Image
            src="/img/landingpage/f1.png"
            alt="Petani di sawah"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-10">
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
        <Link
          href="/sign-in"
          className={cn(buttonVariants({ size: "sm" }), "rounded-full bg-[#4a5d3a] hover:bg-[#3d4d30]")}
        >
          Mulai Sekarang
        </Link>
      </section>

      <footer className="bg-[#4a5d3a] text-white mt-10">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 font-semibold mb-2">
              <div className="relative h-10 w-50 mr-25">
                <Image src="/img/lg.png" alt="Pasartani" fill className="object-contain" />
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