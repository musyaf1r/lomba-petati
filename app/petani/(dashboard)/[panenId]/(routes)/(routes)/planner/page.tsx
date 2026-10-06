import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { PlannerForm } from "./component/planner-form";


interface PlannerPageProps {
  params: Promise<{ panenId: string }>;
}

export default async function PlannerPage({ params }: PlannerPageProps) {
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
        <h1 className="text-2xl font-bold">Smart Crop Planner</h1>
        <p className="text-muted-foreground">
          Rencanakan tanam dan hitung estimasi pendapatan dari harga pasar hari ini
        </p>
      </div>

      <PlannerForm lahanList={lahanList} />
    </div>
  );
}