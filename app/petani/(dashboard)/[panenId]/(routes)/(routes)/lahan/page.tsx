import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { LahanCard } from "@/components/lahan-card";
import { LahanClient } from "./component/lahan-client";


interface LahanPageProps {
  params: Promise<{ panenId: string }>;
}

export default async function LahanPage({ params }: LahanPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { panenId } = await params;

  const lahanList = await db.lahan.findMany({
    where: { panenId },
    orderBy: { createdAt: "desc" },
  });

  return (
    
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lahan</h1>
        <p className="text-muted-foreground">Kelola petak lahan yang kamu garap</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {lahanList.map((lahan) => (
          <LahanCard
          key={lahan.id}
          id={lahan.id}
          nama={lahan.nama}
          lokasi={lahan.lokasi}
          luas={lahan.luas}
          status={lahan.status}
          komoditas={lahan.komoditas}
          tanggalTanam={lahan.tanggalTanam}
        />
        ))}

        <LahanClient />
      </div>
    </div>
  );
}