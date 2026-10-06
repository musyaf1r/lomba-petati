'use client'

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProdukModal } from "@/hook/use-produk-modal"

export const ProdukClient = () => {
  const produkModal = useProdukModal()

  return (
    <Button onClick={produkModal.onOpen}>
      <Plus className="h-4 w-4 mr-2" />
      Tambah Hasil Panen
    </Button>
  )
}