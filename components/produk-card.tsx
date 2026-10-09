'use client'

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alert-modal"

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

      <div className="relative border rounded-lg overflow-hidden">
        <Button
          type="button"
          variant="destructive"
          size="icon"
          disabled={loading}
          onClick={() => setOpenDelete(true)}
          className="absolute top-2 right-2 z-10 h-8 w-8 hover:text-red-600"
        >
          <Trash className="h-4 w-4" />
        </Button>

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
            Stok: {stok} {satuan}
          </p>
        </div>
      </div>
    </>
  )
}