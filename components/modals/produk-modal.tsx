'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { useProdukModal } from '@/hook/use-produk-modal'
import Modal from '../ui/modal'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const formSchema = z.object({
  namaBarang: z.string().min(1, "Nama barang wajib diisi"),
  daerah: z.string().min(1, "Daerah wajib diisi"),
  hargaJual: z.string().min(1, "Harga wajib diisi"),
  stok: z.string().min(1, "Stok wajib diisi"),
  satuan: z.string().min(1, "Satuan wajib diisi"),
  fotoUrl: z.string().optional(),
  nomorHp: z.string().min(1, "Nomor HP wajib diisi"),
})

type ProdukFormValues = z.infer<typeof formSchema>

// Kecilkan gambar di browser sebelum dikirim (maks 800px, JPEG)
const kompresGambar = (file: File, maxSize = 800, quality = 0.7): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Gagal membaca file"))
    reader.onload = () => {
      const img = new window.Image()
      img.onerror = () => reject(new Error("File bukan gambar yang valid"))
      img.onload = () => {
        const skala = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * skala)
        canvas.height = Math.round(img.height * skala)
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("Canvas tidak tersedia"))
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })

export const ProdukModal = () => {
  const [loading, setLoading] = useState(false)
  const [fileKey, setFileKey] = useState(0)
  const produkModal = useProdukModal()
  const params = useParams()
  const router = useRouter()

  const form = useForm<ProdukFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaBarang: "",
      daerah: "",
      hargaJual: "",
      stok: "",
      satuan: "kg",
      fotoUrl: "",
      nomorHp: "",
    },
  })

  const onSubmit = async (values: ProdukFormValues) => {
    try {
      setLoading(true)
      await axios.post(`/api/produk?panenId=${params.panenId}`, {
        ...values,
        hargaJual: Number(values.hargaJual),
        stok: Number(values.stok),
      })
      toast.success("Produk berhasil ditambahkan")
      produkModal.onClose()
      form.reset()
      setFileKey((k) => k + 1)
      router.refresh()
    } catch (error) {
      toast.error("Gagal menambahkan produk")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Tambah Hasil Panen"
      description="Tambahkan hasil panen yang mau kamu jual ke pembeli"
      isOpen={produkModal.isOpen}
      onClose={produkModal.onClose}
    >
      <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="namaBarang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Barang</FormLabel>
                  <FormControl>
                    <Input placeholder="Cabai Merah" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="daerah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daerah</FormLabel>
                  <FormControl>
                    <Input placeholder="Malang, Jawa Timur" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="hargaJual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25000" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="satuan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Satuan</FormLabel>
                    <FormControl>
                      <Input placeholder="kg" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="stok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Tersedia</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fotoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto Barang (opsional)</FormLabel>
                  <FormControl>
                    <Input
                      key={fileKey}
                      type="file"
                      accept="image/*"
                      disabled={loading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) {
                          field.onChange("")
                          return
                        }
                        if (!file.type.startsWith("image/")) {
                          toast.error("File harus berupa gambar")
                          e.target.value = ""
                          return
                        }
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error("Ukuran foto maksimal 10 MB")
                          e.target.value = ""
                          return
                        }
                        try {
                          const hasil = await kompresGambar(file)
                          field.onChange(hasil)
                        } catch (err) {
                          toast.error("Gagal memproses foto")
                          e.target.value = ""
                        }
                      }}
                    />
                  </FormControl>
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Pratinjau foto"
                      className="h-32 w-full object-cover rounded-md border"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nomorHp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor HP/WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="0812xxxxxxxx" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-2 space-x-2 flex justify-end items-center w-full">
              <Button variant="outline" onClick={produkModal.onClose} disabled={loading}>
                Batal
              </Button>
              <Button disabled={loading} type="submit">
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
}