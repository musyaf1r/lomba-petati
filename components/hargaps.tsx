'use client'

import axios from "axios"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Search } from "lucide-react"

interface HargaItem {
  id: number
  nama: string
  harga: number
  perubahan: string
  persenPerubahan: number
  tanggalUpdate: string
  periodePembanding: string
  provinsi: string
  satuan: string
}

interface Provinsi {
  province_id: number
  province_name: string
}

interface JenisPasar {
  price_type_id: number
  price_type_name: string
}

export const Hargaps = () => {
  const [data, setData] = useState<HargaItem[]>([])
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([])
  const [jenisPasarList, setJenisPasarList] = useState<JenisPasar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState("")
  const [provId, setProvId] = useState(0)
  const [priceType, setPriceType] = useState(1)
  const [tanggalData, setTanggalData] = useState<string | null>(null)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [resProvinsi, resJenis] = await Promise.all([
          axios.get("/api/prov"),
          axios.get("/api/pasar"),
        ])
        setProvinsiList(resProvinsi.data.data)
        setJenisPasarList(resJenis.data.data)
      } catch (err) {
        console.log("Gagal ambil daftar filter", err)
      }
    }
    fetchFilters()
  }, [])

  useEffect(() => {
    const fetchHarga = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `/api/harga-pasar?provId=${provId}&priceType=${priceType}`
        )
        setData(res.data.data)
        setTanggalData(res.data.tanggal)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchHarga()
  }, [provId, priceType])

  const filtered = data.filter((item) =>
    item.nama?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Harga Pasar Hari Ini{" "}
          <span className="text-sm font-normal text-muted-foreground">{tanggalData}</span>
        </CardTitle>

        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari komoditas... (misal: cabai, beras)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={priceType}
            onChange={(e) => setPriceType(Number(e.target.value))}
            className="border rounded-md px-3 py-2 text-sm bg-background w-full sm:w-44 shrink-0"
          >
            {jenisPasarList.map((j) => (
              <option key={j.price_type_id} value={j.price_type_id}>
                {j.price_type_name}
              </option>
            ))}
          </select>

          <select
            value={provId}
            onChange={(e) => setProvId(Number(e.target.value))}
            className="border rounded-md px-3 py-2 text-sm bg-background w-full sm:w-56 shrink-0"
          >
            {provinsiList.map((p) => (
              <option key={p.province_id} value={p.province_id}>
                {p.province_name}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Memuat data harga...</p>}
        {error && <p className="text-sm text-destructive">Gagal memuat data harga pasar.</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Komoditas tidak ditemukan. Data yang tersedia: Beras, Daging Ayam, Daging Sapi,
            Telur Ayam, Bawang Merah, Bawang Putih, Cabai Merah, Cabai Rawit, Minyak Goreng, Gula Pasir.
          </p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {filtered.map((item) => {
              const naik = item.persenPerubahan > 0
              const turun = item.persenPerubahan < 0
              return (
                <div key={item.id} className="border rounded-lg p-3 space-y-1">
                  <p className="text-sm font-medium">{item.nama}</p>
                  <p className="text-lg font-bold">
                    Rp{item.harga?.toLocaleString("id-ID")}
                    <span className="text-xs font-normal text-muted-foreground">
                      /{item.satuan}
                    </span>
                  </p>
                  <p
                    className={`text-xs ${
                      naik ? "text-red-500" : turun ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {item.perubahan} ({item.persenPerubahan}%)
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Data: {item.tanggalUpdate}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Wilayah: {item.provinsi}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}