import Link from "next/link"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Leaf, Lightbulb, MapPin, Package, Plus, Sprout, Wallet } from "lucide-react"
import db from "@/lib/db"


interface HomePageProps {
  params: Promise<{ panenId: string }>
}

const tips = [
  "Cek harga pasar sebelum menentukan harga jual supaya tidak terlalu murah atau terlalu mahal.",
  "Foto produk yang jelas dan terang membantu pembeli lebih percaya.",
  "Perbarui stok secara berkala agar pembeli tidak kecewa saat menghubungi.",
  "Hitung modal dan estimasi hasil di Rencana Tanam sebelum mulai menanam.",
  "Catat tanggal tanam tiap lahan supaya jadwal panen lebih mudah dipantau.",
]

const usiaTanam = (tanggal: Date | null) =>
  tanggal ? Math.floor((Date.now() - new Date(tanggal).getTime()) / (1000 * 60 * 60 * 24)) : null

export default async function HomePage({ params }: HomePageProps) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

const user = await currentUser()
const username = user?.username ?? user?.firstName ?? "Petani"

  const { panenId } = await params
  const base = `/petani/${panenId}`

  const [toko, lahanList, produkAll, produkTerbaru] = await Promise.all([
    db.panen.findUnique({ where: { id: panenId } }),
    db.lahan.findMany({ where: { panenId }, orderBy: { createdAt: "desc" } }),
    db.produk.findMany({ where: { panenId }, select: { hargaJual: true, stok: true } }),
    db.produk.findMany({ where: { panenId }, orderBy: { createdAt: "desc" }, take: 3 }),
  ])

  const lahanAktif = lahanList.filter((l) => l.status === "sedang tanam")
  const nilaiStok = produkAll.reduce((total, p) => total + p.hargaJual * p.stok, 0)

  const hariIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  })

  const tip = tips[new Date().getDate() % tips.length]

  const statistik = [
    { icon: Sprout, label: "Total Lahan", nilai: lahanList.length.toString() },
    { icon: Leaf, label: "Sedang Tanam", nilai: lahanAktif.length.toString() },
    { icon: Package, label: "Produk Dijual", nilai: produkAll.length.toString() },
    { icon: Wallet, label: "Nilai Stok", nilai: `Rp${nilaiStok.toLocaleString("id-ID")}` },
  ]

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-6xl mx-auto">
      <section className="rounded-3xl bg-linear-to-br from-[#52613A] to-[#7a8f4f] text-white p-6 sm:p-8">
        <p className="text-sm text-white/80">{hariIni}</p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1">Selamat datang, {username} </h1>
        <p className="mt-2 text-white/85">
          Toko: <span className="font-semibold">{toko?.name ?? "-"}</span>
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`${base}/lahan`}
            className="inline-flex items-center gap-1.5 bg-white text-[#4a5d3a] text-sm font-medium px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Tambah Lahan
          </Link>
          <Link
            href={`${base}/panen`}
            className="inline-flex items-center gap-1.5 bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-white/25 transition-colors"
          >
            <Package className="h-4 w-4" />
            Tambah Hasil Panen
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statistik.map((s) => (
          <div key={s.label} className="bg-[#c9d6a8] rounded-2xl p-4 sm:p-5">
            <s.icon className="h-5 w-5 text-[#4a5d3a]" />
            <p className="text-xl sm:text-2xl font-bold mt-2 wrap-break-words">{s.nilai}</p>
            <p className="text-xs sm:text-sm text-[#3a2e22]/80">{s.label}</p>
          </div>
        ))}
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-[#e4dfd3] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#8a4a2a]">Lahan Kamu</h2>
            <Link href={`${base}/lahan`} className="text-xs text-[#4a5d3a] hover:underline">
              Kelola →
            </Link>
          </div>

          {lahanList.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Sprout className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Belum ada lahan. Tambahkan lahan pertamamu.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {lahanList.slice(0, 4).map((lahan) => {
                const aktif = lahan.status === "sedang tanam"
                const usia = usiaTanam(lahan.tanggalTanam)
                return (
                  <li key={lahan.id} className="flex items-center justify-between rounded-xl bg-[#f5f7ec] px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">{lahan.nama}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {lahan.lokasi} · {lahan.luas.toLocaleString("id-ID")} m²
                      </p>
                      {aktif && (
                        <p className="text-xs mt-0.5">
                          Menanam {lahan.komoditas ?? "-"}
                          {usia !== null && ` · ${usia} hari`}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        aktif ? "bg-[#7a4a3a] text-white" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {aktif ? "Sedang tanam" : "Kosong"}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[#8a4a2a]">Hasil Panen Terbaru</h2>
          <Link href={`${base}/panen`} className="text-xs text-[#4a5d3a] hover:underline">
            Lihat semua →
          </Link>
        </div>

        {produkTerbaru.length === 0 ? (
          <div className="border border-dashed rounded-2xl py-10 text-center bg-white space-y-2">
            <Package className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Belum ada hasil panen yang dijual. Tambahkan supaya pembeli bisa menemukanmu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {produkTerbaru.map((produk) => (
              <div key={produk.id} className="bg-white border border-[#e4dfd3] rounded-2xl overflow-hidden">
                {produk.fotoUrl ? (
                  <img src={produk.fotoUrl} alt={produk.namaBarang} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-[#eef2e2] flex items-center justify-center text-xs text-muted-foreground">
                    Tidak ada foto
                  </div>
                )}
                <div className="p-4">
                  <p className="font-semibold text-sm">{produk.namaBarang}</p>
                  <p className="font-bold text-[#4a5d3a]">
                    Rp{produk.hargaJual.toLocaleString("id-ID")}
                    <span className="text-xs font-normal text-muted-foreground">/{produk.satuan}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Stok {produk.stok.toLocaleString("id-ID")} {produk.satuan} · {produk.daerah}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="rounded-2xl bg-[#fff4e0] border border-[#f0dcb0] p-5 flex gap-3">
        <Lightbulb className="h-5 w-5 text-[#d97b4a] shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Tips hari ini</p>
          <p className="text-sm text-[#3a2e22]/80 mt-0.5">{tip}</p>
        </div>
      </section>
    </div>
  )
}