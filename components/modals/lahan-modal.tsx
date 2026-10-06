'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { useLahanModal } from '@/hook/use-lahan-modal'
import Modal from '../ui/modal'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const formSchema = z.object({
  nama: z.string().min(1, "Nama lahan wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
  luas: z.string().min(1, "Luas harus lebih dari 0"),
})

type LahanFormValues = z.infer<typeof formSchema>

export const LahanModal = () => {
  const [loading, setLoading] = useState(false)
  const lahanModal = useLahanModal()
  const params = useParams()
  const router = useRouter()

  const form = useForm<LahanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      lokasi: "",
      luas: "",
    },
  })

  const onSubmit = async (values: LahanFormValues) => {
    try {
      setLoading(true)
      await axios.post(`/api/lahan?panenId=${params.panenId}`, {
        ...values,
        luas: Number(values.luas),
      })
      toast.success("Lahan berhasil ditambahkan")
      lahanModal.onClose()
      form.reset()
      router.refresh()
    } catch (error) {
      toast.error("Gagal menambahkan lahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Tambah Lahan"
      description="Tambahkan petak lahan baru yang kamu garap"
      isOpen={lahanModal.isOpen}
      onClose={lahanModal.onClose}
    >
      <div>
        <div className="space-y-4 py-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lahan</FormLabel>
                    <FormControl>
                      <Input placeholder="Petak Timur" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lokasi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Dusun Sumberejo, Malang" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="luas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Luas (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4 space-x-2 flex justify-end items-center w-full">
                <Button variant="outline" onClick={lahanModal.onClose} disabled={loading}>
                  Batal
                </Button>
                <Button disabled={loading} type="submit">
                  Simpan
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}