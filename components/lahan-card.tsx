'use client'

interface LahanCardProps {
  nama: string
  lokasi: string
  luas: number
  status: string
  komoditas: string | null
  tanggalTanam: Date | null
}

export const LahanCard = ({
  nama,
  lokasi,
  luas,
  status,
  komoditas,
  tanggalTanam,
}: LahanCardProps) => {
  const sedangTanam = status === "sedang tanam"

  const usiaTanam = tanggalTanam
    ? Math.floor(
        (new Date().getTime() - new Date(tanggalTanam).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null

  return (
    <div
      className={`rounded-xl p-5 ${
        sedangTanam ? "bg-green-100 border border-green-300" : "bg-lime-50 border border-lime-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">{nama}</h3>
          <p className="text-sm text-muted-foreground">{lokasi}</p>
        </div>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            sedangTanam ? "bg-[#7a4a3a] text-white" : "bg-red-200 text-red-700"
          }`}
        >
          {sedangTanam ? "Sedang tanam" : "Kosong"}
        </span>
      </div>

      <div className="flex gap-8 mt-4">
        <div>
          <p className="text-xs text-muted-foreground">Luas</p>
          <p className="font-semibold">{luas.toLocaleString("id-ID")} m²</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {sedangTanam ? "Ditanam" : "Terakhir tanam"}
          </p>
          <p className="font-semibold">{komoditas ?? "-"}</p>
        </div>
        {sedangTanam && usiaTanam !== null && (
          <div>
            <p className="text-xs text-muted-foreground">Usia tanam</p>
            <p className="font-semibold">{usiaTanam} hari</p>
          </div>
        )}
      </div>

      <button className="mt-4 bg-[#4a5d3a] text-white text-sm px-4 py-2 rounded-full">
        {sedangTanam ? "Lihat Detail" : "Rencanakan Tanam"}
      </button>
    </div>
  )
}