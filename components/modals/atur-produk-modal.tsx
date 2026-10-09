'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Trash } from "lucide-react"

import Modal from "../ui/modal"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface AturProdukModalProps {
  isOpen: boolean
  onClose: () => void
  onHapus: () => void
  produkId: string
  namaBarang: string
  hargaJual: number
  stok: number
  satuan: string
}

export const AturProdukModal = ({
  isOpen,
  onClose,
  onHapus,
  produkId,
  namaBarang,
  hargaJual,
  stok,
  satuan,
}: AturProdukModalProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [harga, setHarga] = useState(String(hargaJual))
  const [stokBaru, setStokBaru] = useState(String(stok))

  useEffect(() => {
    if (isOpen) {
      setHarga(String(hargaJual))
      setStokBaru(String(stok))
    }
  }, [isOpen, hargaJual, stok])

  const adaPerubahan = Number(harga) !== hargaJual || Number(stokBaru) !== stok

  const onSimpan = async () => {
    const h = Number(harga)
    const s = Number(stokBaru)

    if (harga.trim() === "" || !Number.isFinite(h) || h <= 0) {
      toast.error("Harga harus lebih dari 0")
      return
    }
    if (stokBaru.trim() === "" || !Number.isFinite(s) || s < 0) {
      toast.error("Stok tidak boleh kosong atau negatif")
      return
    }

    try {
      setLoading(true)
      await axios.patch(`/api/produk/${produkId}`, { hargaJual: h, stok: s })
      toast.success("Stok dan harga diperbarui")
      onClose()
      router.refresh()
    } catch (error) {
      toast.error("Gagal memperbarui stok dan harga")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={`Atur ${namaBarang}`}
      description="Ubah stok dan harga, atau hapus hasil panen ini."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2">
        <div>
          <label className="text-sm font-medium">Harga (Rp per {satuan})</label>
          <Input
            type="number"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            disabled={loading}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Stok ({satuan})</label>
          <Input
            type="number"
            value={stokBaru}
            onChange={(e) => setStokBaru(e.target.value)}
            disabled={loading}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Isi 0 kalau stok sudah habis.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onHapus}
            disabled={loading}
          >
            <Trash className="h-4 w-4 mr-2" />
            Hapus
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="button" onClick={onSimpan} disabled={loading || !adaPerubahan}>
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}