'use client'

import { Plus } from "lucide-react"
import { useLahanModal } from "@/hook/use-lahan-modal"

export const LahanClient = () => {
  const lahanModal = useLahanModal()

  return (
    <button
      onClick={lahanModal.onOpen}
      className="rounded-xl border border-dashed flex flex-col items-center justify-center min-h-[160px] text-muted-foreground hover:border-primary hover:text-primary transition-colors"
    >
      <Plus className="h-6 w-6 mb-1" />
      <span className="text-sm">Tambah lahan baru</span>
    </button>
  )
}