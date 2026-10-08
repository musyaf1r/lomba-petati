import { MessageCircle, Package, Search, Store } from "lucide-react"
import db from "@/lib/db"
import { MarketplaceClient } from "@/components/marketplace-client"

const caraBelanja = [
  { icon: Search, judul: "Cari produk", teks: "Ketik nama barang atau pilih daerah yang kamu mau." },
  { icon: Store, judul: "Kenali penjualnya", teks: "Lihat nama petani dan toko tempat hasil panen berasal." },
  { icon: MessageCircle, judul: "Hubungi langsung", teks: "Chat petani lewat WhatsApp untuk sepakat soal harga dan jumlah." },
]

export default async function PenggunaPage() {

  const produkList = await db.produk.findMany({
    orderBy: { createdAt: "desc" },
    include: { panen: { select: { name: true } } },
  })

  const data = produkList.map((p) => ({
    id: p.id,
    namaBarang: p.namaBarang,
    namaPetani: p.namaPetani,
    namaToko: p.panen.name,
    daerah: p.daerah,
    hargaJual: p.hargaJual,
    stok: p.stok,
    satuan: p.satuan,
    fotoUrl: p.fotoUrl,
    nomorHp: p.nomorHp,
  }))
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#8a4a2a]">Cara Belanja</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {caraBelanja.map((c, i) => (
            <div key={c.judul} className="border border-[#c9c4b8] bg-white rounded-2xl p-4 flex gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-[#4a5d3a] text-white flex items-center justify-center">
                <c.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {i + 1}. {c.judul}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.teks}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#8a4a2a]">Hasil Panen Tersedia</h2>
        <MarketplaceClient produkList={data} />
      </section>
    </div>
  )
}