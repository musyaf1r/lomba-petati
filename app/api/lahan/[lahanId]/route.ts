import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ lahanId: string }> }
) {
  try {
    const { userId } = await auth();
    const { lahanId } = await params;
    const body = await req.json();

    const { komoditas } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!komoditas) {
      return new NextResponse("Komoditas wajib diisi", { status: 400 });
    }
    if (!lahanId) {
      return new NextResponse("lahanId dibutuhkan", { status: 400 });
    }

    const lahan = await db.lahan.update({
      where: { id: lahanId },
      data: {
        komoditas,
        status: "sedang tanam",
        tanggalTanam: new Date(),
      },
    });

    return NextResponse.json(lahan);
  } catch (error) {
    console.log("[LAHAN_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ lahanId: string }> }
) {
  try {
    const { userId } = await auth();
    const { lahanId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!lahanId) {
      return new NextResponse("lahanId dibutuhkan", { status: 400 });
    }
    await db.hasilPanen.deleteMany({ where: { lahanId } });

    const lahan = await db.lahan.delete({
      where: { id: lahanId },
    });

    return NextResponse.json(lahan);
  } catch (error) {
    console.log("[LAHAN_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}