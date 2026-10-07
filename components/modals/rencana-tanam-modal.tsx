'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import Modal from "../ui/modal"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface HargaItem {
  id: number
  nama: string
  harga: number
  satuan: string
}

interface RencanaTanamModalProps {
  isOpen: boolean
  onClose: () => void
  lahanId: string
  lahanNama: string
  luas: number
}

export const RencanaTanamModal = ({
  isOpen,
  onClose,
  lahanId,
  lahanNama,
  luas,
}: RencanaTanamModalProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hargaList, setHargaList] = useState<HargaItem[]>([])
  const [komoditasId, setKomoditasId] = useState<number | "">("")
  const [modalTanam, setModalTanam] = useState("")
  const [hasilPerM2, setHasilPerM2] = useState("")

  useEffect(() => {
    if (!isOpen) return
    const fetchHarga = async () => {
      try {
        const res = await axios.get("/api/harga-pasar?provId=0&priceType=1")
        setHargaList(res.data.data)
      } catch (err) {
        console.log("Gagal ambil harga pasar", err)
      }
    }
    fetchHarga()
  }, [isOpen])

  const komoditasTerpilih = hargaList.find((h) => h.id === komoditasId)
  const modal = Number(modalTanam) || 0
  const perM2 = Number(hasilPerM2) || 0

  // Total hasil dihitung dari luas lahan x estimasi hasil per m2
  const totalHasil = perM2 * luas
  const pendapatan = totalHasil * (komoditasTerpilih?.harga ?? 0)
  const untung = pendapatan - modal

  const onConfirm = async () => {
    if (!komoditasTerpilih) {
      toast.error("Pilih komoditas dulu")
      return
    }
    try {
      setLoading(true)
      await axios.patch(`/api/lahan/${lahanId}`, {
        komoditas: komoditasTerpilih.nama,
      })
      toast.success("Lahan mulai ditanam")
      onClose()
      router.refresh()
    } catch (err) {
      toast.error("Gagal menyimpan rencana tanam")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={`Rencana Tanam - ${lahanNama}`}
      description={`Luas lahan: ${luas.toLocaleString("id-ID")} m²`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2">
        <div>
          <label className="text-sm font-medium">Komoditas</label>
          <select
            value={komoditasId}
            onChange={(e) => setKomoditasId(Number(e.target.value))}
            className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
          >
            <option value="">-- Pilih komoditas --</option>
            {hargaList.map((h) => (
              <option key={h.id} value={h.id}>
                {h.nama} (Rp{h.harga?.toLocaleString("id-ID")}/{h.satuan})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Modal Tanam (Rp)</label>
          <Input
            type="number"
            placeholder="500000"
            value={modalTanam}
            onChange={(e) => setModalTanam(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Estimasi Hasil per m² (kg)</label>
          <Input
            type="number"
            step="0.1"
            placeholder="0.5"
            value={hasilPerM2}
            onChange={(e) => setHasilPerM2(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Perkiraan hasil panen per meter persegi berdasarkan pengalaman kamu menanam
            komoditas ini. Akan dikalikan dengan luas lahan ({luas.toLocaleString("id-ID")} m²).
          </p>
        </div>

        {komoditasTerpilih && perM2 > 0 && (
          <div className="border rounded-lg p-3 space-y-1 bg-muted/50">
            <p className="text-sm flex justify-between">
              <span className="text-muted-foreground">Total Estimasi Hasil</span>
              <span className="font-semibold">
                {totalHasil.toLocaleString("id-ID")} kg
              </span>
            </p>
            <p className="text-sm flex justify-between">
              <span className="text-muted-foreground">Estimasi Pendapatan</span>
              <span className="font-semibold">Rp{pendapatan.toLocaleString("id-ID")}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span className="text-muted-foreground">
                {untung >= 0 ? "Estimasi Untung" : "Estimasi Rugi"}
              </span>
              <span className={`font-semibold ${untung >= 0 ? "text-green-600" : "text-red-600"}`}>
                Rp{Math.abs(untung).toLocaleString("id-ID")}
              </span>
            </p>
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            Mulai Tanam
          </Button>
        </div>
      </div>
    </Modal>
  )
}