import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Phone } from "lucide-react";

export default async function PenggunaPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const produkList = await db.produk.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hasil Panen Petani</h1>
        <p className="text-muted-foreground">Lihat dan hubungi petani langsung</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {produkList.map((produk) => (
          <div key={produk.id} className="border rounded-lg overflow-hidden">
            {produk.fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={produk.fotoUrl} alt={produk.namaBarang} className="w-full h-36 object-cover" />
            ) : (
              <div className="w-full h-36 bg-muted flex items-center justify-center text-muted-foreground text-sm">
                Tidak ada foto
              </div>
            )}
            <div className="p-4 space-y-1">
              <p className="font-semibold">{produk.namaBarang}</p>
              <p className="text-lg font-bold">
                Rp{produk.hargaJual.toLocaleString("id-ID")}
                <span className="text-xs font-normal text-muted-foreground">/{produk.satuan}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Stok: {produk.stok} {produk.satuan}
              </p>
              <p className="text-sm">Penjual: {produk.namaPetani}</p>

              <a
                href={`https://wa.me/${produk.nomorHp.replace(/^0/, "62").replace(/\D/g, "")}`}
                target="_blank"
                className="mt-2 inline-flex items-center gap-2 text-sm bg-green-600 text-white px-3 py-2 rounded-md"
              >
                <Phone className="h-4 w-4" />
                Hubungi {produk.nomorHp}
              </a>
            </div>
          </div>
        ))}

        {produkList.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada produk dari petani.</p>
        )}
      </div>
    </div>
  );
}