'use client'

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alert-modal"
import { AturProdukModal } from "@/components/modals/atur-produk-modal"

interface ProdukCardProps {
  id: string
  namaBarang: string
  hargaJual: number
  stok: number
  satuan: string
  fotoUrl: string | null
}

export const ProdukCard = ({
  id,
  namaBarang,
  hargaJual,
  stok,
  satuan,
  fotoUrl,
}: ProdukCardProps) => {
  const router = useRouter()
  const [openDelete, setOpenDelete] = useState(false)
  const [openAtur, setOpenAtur] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/produk/${id}`)
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

      <AturProdukModal
        isOpen={openAtur}
        onClose={() => setOpenAtur(false)}
        onHapus={() => {
          setOpenAtur(false)
          setOpenDelete(true)
        }}
        produkId={id}
        namaBarang={namaBarang}
        hargaJual={hargaJual}
        stok={stok}
        satuan={satuan}
      />

      <div className="border rounded-lg overflow-hidden">
        {fotoUrl && (
          <img src={fotoUrl} alt={namaBarang} className="w-full h-32 object-cover" />
        )}
        <div className="p-4 space-y-1">
          <p className="font-semibold">{namaBarang}</p>
          <p className="text-lg font-bold">
            Rp{hargaJual.toLocaleString("id-ID")}
            <span className="text-xs font-normal text-muted-foreground">/{satuan}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {stok > 0 ? `Stok: ${stok} ${satuan}` : "Stok habis"}
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => setOpenAtur(true)}
          >
            <Settings2 className="h-4 w-4 mr-2" />
            Atur stok &amp; harga
          </Button>
        </div>
      </div>
    </>
  )
}