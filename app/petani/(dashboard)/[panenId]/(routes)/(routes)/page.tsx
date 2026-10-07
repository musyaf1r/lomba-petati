import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";

interface HomePageProps {
  params: Promise<{ panenId: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const username = user?.firstName ?? "Petani";

  const { panenId } = await params;

  const toko = await db.panen.findUnique({
    where: { id: panenId },
  });

  const jumlahLahan = await db.lahan.count({
    where: { panenId },
  });

  const lahanAktif = await db.lahan.findMany({
    where: { panenId, status: "sedang tanam" },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selamat datang, {username} </h1>
        <p className="text-muted-foreground">
          Toko: <span className="font-medium text-foreground">{toko?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Lahan</p>
          <p className="text-2xl font-bold">{jumlahLahan}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Sedang Tanam</p>
          <p className="text-2xl font-bold">{lahanAktif.length}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Sedang Ditanam</h2>
        {lahanAktif.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada lahan yang sedang ditanam. Mulai rencanakan tanam di menu Planner.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {lahanAktif.map((lahan) => (
              <div key={lahan.id} className="border rounded-lg p-4">
                <p className="font-medium">{lahan.nama}</p>
                <p className="text-sm text-muted-foreground">
                  Menanam: {lahan.komoditas ?? "belum ditentukan"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{lahan.lokasi}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}