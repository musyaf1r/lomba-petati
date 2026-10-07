'use client'

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Trash } from "lucide-react"

import { RencanaTanamModal } from "./modals/rencana-tanam-modal"
import { AlertModal } from "./modals/alert-modal"

interface LahanCardProps {
  id: string
  nama: string
  lokasi: string
  luas: number
  status: string
  komoditas: string | null
  tanggalTanam: Date | null
}

export const LahanCard = ({
  id,
  nama,
  lokasi,
  luas,
  status,
  komoditas,
  tanggalTanam,
}: LahanCardProps) => {
  const router = useRouter()
  const [openPlanner, setOpenPlanner] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [loading, setLoading] = useState(false)

  const sedangTanam = status === "sedang tanam"

  const usiaTanam = tanggalTanam
    ? Math.floor(
        (new Date().getTime() - new Date(tanggalTanam).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/lahan/${id}`)
      toast.success("Lahan berhasil dihapus")
      router.refresh()
    } catch (err) {
      toast.error("Gagal menghapus lahan")
    } finally {
      setLoading(false)
      setOpenDelete(false)
    }
  }

  return (
    <>
      <RencanaTanamModal
        isOpen={openPlanner}
        onClose={() => setOpenPlanner(false)}
        lahanId={id}
        lahanNama={nama}
        luas={luas}
      />

      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div
        className={`rounded-xl p-5 relative ${
          sedangTanam ? "bg-green-100 border border-green-300" : "bg-lime-50 border border-lime-200"
        }`}
      >
        <button
          onClick={() => setOpenDelete(true)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-red-600 transition-colors"
        >
          <Trash className="h-4 w-4" />
        </button>

        <div className="flex items-start justify-between pr-6">
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

        <button
          onClick={() => setOpenPlanner(true)}
          className="mt-4 bg-[#4a5d3a] text-white text-sm px-4 py-2 rounded-full"
        >
          {sedangTanam ? "Lihat Detail" : "Rencanakan Tanam"}
        </button>
      </div>
    </>
  )
}