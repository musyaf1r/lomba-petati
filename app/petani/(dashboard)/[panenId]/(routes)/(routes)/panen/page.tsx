import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { ProdukClient } from "./component/panen-client";


interface PanenPageProps {
  params: Promise<{ panenId: string }>;
}

export default async function PanenPage({ params }: PanenPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { panenId } = await params;

  const produkList = await db.produk.findMany({
    where: { panenId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Panen</h1>
          <p className="text-muted-foreground">Hasil panen yang kamu jual ke pembeli</p>
        </div>
        <ProdukClient />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {produkList.map((produk) => (
          <div key={produk.id} className="border rounded-lg overflow-hidden">
            {produk.fotoUrl && (
              <img src={produk.fotoUrl} alt={produk.namaBarang} className="w-full h-32 object-cover" />
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
            </div>
          </div>
        ))}

        {produkList.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada hasil panen yang ditambahkan.</p>
        )}
      </div>
    </div>
  );
}