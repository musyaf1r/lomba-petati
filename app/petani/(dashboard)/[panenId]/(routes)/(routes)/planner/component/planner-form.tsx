'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Lahan {
  id: string
  nama: string
  lokasi: string
  luas: number
}

interface HargaItem {
  id: number
  nama: string
  harga: number
  satuan: string
}

interface PlannerFormProps {
  lahanList: Lahan[]
}

export const PlannerForm = ({ lahanList }: PlannerFormProps) => {
  const [hargaList, setHargaList] = useState<HargaItem[]>([])
  const [lahanId, setLahanId] = useState(lahanList[0]?.id ?? "")
  const [komoditasId, setKomoditasId] = useState<number | "">("")
  const [modalTanam, setModalTanam] = useState("")
  const [estimasiHasil, setEstimasiHasil] = useState("")

  useEffect(() => {
    const fetchHarga = async () => {
      try {
        const res = await axios.get("/api/harga-pasar?provId=0&priceType=1")
        setHargaList(res.data.data)
      } catch (err) {
        console.log("Gagal ambil harga pasar", err)
      }
    }
    fetchHarga()
  }, [])

  const lahanTerpilih = lahanList.find((l) => l.id === lahanId)
  const komoditasTerpilih = hargaList.find((h) => h.id === komoditasId)

  const modal = Number(modalTanam) || 0
  const hasil = Number(estimasiHasil) || 0
  const hargaSatuan = komoditasTerpilih?.harga ?? 0

  const pendapatan = hasil * hargaSatuan
  const untung = pendapatan - modal

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Input Rencana Tanam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Pilih Lahan</label>
            <select
              value={lahanId}
              onChange={(e) => setLahanId(e.target.value)}
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
            >
              {lahanList.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nama} ({l.luas.toLocaleString("id-ID")} m²)
                </option>
              ))}
            </select>
            {lahanList.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Belum ada lahan. Tambahkan lahan dulu di menu Lahan.
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Komoditas yang Akan Ditanam</label>
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
            <label className="text-sm font-medium">Estimasi Hasil Panen (kg)</label>
            <Input
              type="number"
              placeholder="100"
              value={estimasiHasil}
              onChange={(e) => setEstimasiHasil(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Perkiraan hasil panen kamu sendiri berdasarkan pengalaman menanam di lahan ini.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hasil Perhitungan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Lahan</p>
            <p className="font-semibold">{lahanTerpilih?.nama ?? "-"}</p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Harga Pasar Hari Ini</p>
            <p className="font-semibold">
              {komoditasTerpilih
                ? `Rp${komoditasTerpilih.harga.toLocaleString("id-ID")}/${komoditasTerpilih.satuan}`
                : "Pilih komoditas dulu"}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Estimasi Pendapatan</p>
            <p className="text-xl font-bold">Rp{pendapatan.toLocaleString("id-ID")}</p>
          </div>

          <div
            className={`border rounded-lg p-4 ${
              untung >= 0 ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
            }`}
          >
            <p className="text-sm text-muted-foreground">
              {untung >= 0 ? "Estimasi Untung" : "Estimasi Rugi"}
            </p>
            <p className={`text-xl font-bold ${untung >= 0 ? "text-green-700" : "text-red-700"}`}>
              Rp{Math.abs(untung).toLocaleString("id-ID")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}