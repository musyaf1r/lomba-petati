'use client'

import { useMemo, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { MapPin, PackageOpen, Phone, Search, Store, Trash, User } from "lucide-react"

import { AlertModal } from "@/components/modals/alert-modal"
import { Input } from "@/components/ui/input"

interface Produk {
  id: string
  namaBarang: string
  namaPetani: string
  namaToko: string
  daerah: string
  hargaJual: number
  stok: number
  satuan: string
  fotoUrl: string | null
  nomorHp: string
  HapusProduk: boolean
}
interface DeleteProdukButtonProps {
  produkId: string
}
export const DeleteProdukButton = ({ produkId }: DeleteProdukButtonProps) => {
  const router = useRouter()
  const [openDelete, setOpenDelete] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/produk/${produkId}`)
      toast.success("Hasil panen berhasil dihapus")
      router.refresh()
    } catch (err) {
      toast.error("Gagal menghapus hasil panen")
    } finally {
      setLoading(false)
      setOpenDelete(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <button
        type="button"
        onClick={() => setOpenDelete(true)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-red-600 transition-colors"
      >
        <Trash className="h-4 w-4" />
      </button>
    </>
  )
}

interface MarketplaceClientProps {
  produkList: Produk[]
}

const linkWhatsApp = (hp: string) => {
  const digit = hp.replace(/\D/g, "")
  return `https://wa.me/${digit.startsWith("0") ? "62" + digit.slice(1) : digit}`
}

export const MarketplaceClient = ({ produkList }: MarketplaceClientProps) => {
  const [query, setQuery] = useState("")
  const [daerah, setDaerah] = useState("semua")

  const daftarDaerah = useMemo(
    () => Array.from(new Set(produkList.map((p) => p.daerah))).sort(),
    [produkList]
  )

  const filtered = produkList.filter((p) => {
    const kata = query.toLowerCase()
    const cocokKata =
      p.namaBarang.toLowerCase().includes(kata) ||
      p.namaToko.toLowerCase().includes(kata) ||
      p.namaPetani.toLowerCase().includes(kata)
    const cocokDaerah = daerah === "semua" || p.daerah === daerah
    return cocokKata && cocokDaerah
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari barang, toko, atau petani..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        <select
          value={daerah}
          onChange={(e) => setDaerah(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white w-full sm:w-56 shrink-0"
        >
          <option value="semua">Semua Daerah</option>
          {daftarDaerah.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="border border-dashed rounded-2xl py-14 flex flex-col items-center text-center gap-2 bg-white">
          <PackageOpen className="h-10 w-10 text-muted-foreground" />
          <p className="font-medium">
            {produkList.length === 0 ? "Belum ada hasil panen" : "Tidak ada produk yang cocok"}
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">
            {produkList.length === 0
              ? "Petani akan segera menambahkan hasil panennya di sini."
              : "Coba ganti kata kunci atau pilih daerah lain."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((produk) => (
          <div
            key={produk.id}
            className="bg-white border border-[#e4dfd3] rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="relative">
              {produk.fotoUrl ? (
                <img src={produk.fotoUrl} alt={produk.namaBarang} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-[#eef2e2] flex items-center justify-center text-muted-foreground text-sm">
                  Tidak ada foto
                </div>
              )}
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-xs bg-white/90 rounded-full px-2.5 py-1 font-medium">
                <MapPin className="h-3 w-3 text-[#4a5d3a]" />
                {produk.daerah}
              </span>
               {produk.HapusProduk && <DeleteProdukButton produkId={produk.id} />}
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
              <div>
                <p className="font-semibold">{produk.namaBarang}</p>
                <p className="text-xl font-bold text-[#4a5d3a]">
                  Rp{produk.hargaJual.toLocaleString("id-ID")}
                  <span className="text-xs font-normal text-muted-foreground">/{produk.satuan}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Stok: {produk.stok.toLocaleString("id-ID")} {produk.satuan}
                </p>
              </div>

              <div className="rounded-xl bg-[#f5f7ec] p-3 space-y-1.5 text-sm">
                <p className="text-xs text-muted-foreground">Dijual oleh</p>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#4a5d3a] shrink-0" />
                  <span className="font-medium">{produk.namaPetani}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-[#4a5d3a] shrink-0" />
                  <span>{produk.namaToko}</span>
                </p>
              </div>

              <a
                href={linkWhatsApp(produk.nomorHp)}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 text-sm bg-green-600 hover:bg-green-700 transition-colors text-white px-3 py-2 rounded-lg"
              >
                <Phone className="h-4 w-4" />
                Hubungi {produk.nomorHp}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}