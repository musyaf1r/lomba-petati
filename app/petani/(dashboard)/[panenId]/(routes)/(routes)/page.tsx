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

  const jumlahLahan = await db.lahan.count({
    where: { panenId },
  });

  const lahanAktif = await db.lahan.count({
    where: { panenId, status: "sedang tanam" },
  });

  return (
    <div className="p-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Selamat datang, {username} </h1>
        <p className="text-muted-foreground">Ringkasan lahan dan aktivitas kamu.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Lahan</p>
          <p className="text-2xl font-bold">{jumlahLahan}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Sedang Tanam</p>
          <p className="text-2xl font-bold">{lahanAktif}</p>
        </div>
      </div>
    </div>
  );
}