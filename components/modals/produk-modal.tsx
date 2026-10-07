"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { useProdukModal } from "@/hook/use-produk-modal";
import Modal from "../ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const formSchema = z.object({
  namaBarang: z.string().min(1, "Nama barang wajib diisi"),
  hargaJual: z.string().min(1, "Harga wajib diisi"),
  stok: z.string().min(1, "Stok wajib diisi"),
  satuan: z.string().min(1, "Satuan wajib diisi"),
  daerah: z.string().min(1, "Daerah wajib diisi"),
  fotoUrl: z.string().optional(),
  nomorHp: z.string().min(1, "Nomor HP wajib diisi"),
});

type ProdukFormValues = z.infer<typeof formSchema>;

export const ProdukModal = () => {
  const [loading, setLoading] = useState(false);
  const produkModal = useProdukModal();
  const params = useParams();
  const router = useRouter();

  const form = useForm<ProdukFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaBarang: "",
      hargaJual: "",
      stok: "",
      satuan: "kg",
      daerah: "",
      fotoUrl: "",
      nomorHp: "",
    },
  });

  const onSubmit = async (values: ProdukFormValues) => {
    try {
      setLoading(true);
      await axios.post(`/api/produk?panenId=${params.panenId}`, {
        ...values,
        hargaJual: Number(values.hargaJual),
        stok: Number(values.stok),
      });
      toast.success("Produk berhasil ditambahkan");
      produkModal.onClose();
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Gagal menambahkan produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tambah Hasil Panen"
      description="Tambahkan hasil panen yang mau kamu jual ke pembeli"
      isOpen={produkModal.isOpen}
      onClose={produkModal.onClose}
    >
      <div className="space-y-4 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="namaBarang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Barang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Cabai Merah"
                      disabled={loading}
                      {...field}
                    />
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
                    <Input
                      placeholder="Malang, Jawa Timur"
                      disabled={loading}
                      {...field}
                    />
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
                      <Input
                        type="number"
                        placeholder="25000"
                        disabled={loading}
                        {...field}
                      />
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
                    <Input
                      type="number"
                      placeholder="50"
                      disabled={loading}
                      {...field}
                    />
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
                  <FormLabel>Link Foto (opsional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
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
                    <Input
                      placeholder="0812xxxxxxxx"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-2 space-x-2 flex justify-end items-center w-full">
              <Button
                variant="outline"
                onClick={produkModal.onClose}
                disabled={loading}
              >
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
  );
};
