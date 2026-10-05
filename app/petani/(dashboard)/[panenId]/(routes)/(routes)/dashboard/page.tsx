import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Hargaps } from "@/components/hargaps";

interface DashboardPageProps {
  params: Promise<{ panenId: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { panenId } = await params;

  const jumlahLahan = await db.lahan.count({
    where: { panenId },
  });

  const totalHasilPanen = await db.hasilPanen.aggregate({
    where: { lahan: { panenId } },
    _sum: { totalPendapatan: true },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan lahan dan pasar hari ini.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Lahan Aktif</p>
          <p className="text-2xl font-bold">{jumlahLahan}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Pendapatan</p>
          <p className="text-2xl font-bold">
            Rp{(totalHasilPanen._sum.totalPendapatan ?? 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <Hargaps />
    </div>
  );
}