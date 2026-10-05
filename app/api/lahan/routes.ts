import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const panenId = searchParams.get("panenId");
    const body = await req.json();

    const { nama, lokasi, luas } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!nama) {
      return new NextResponse("Nama lahan wajib diisi", { status: 400 });
    }
    if (!lokasi) {
      return new NextResponse("Lokasi wajib diisi", { status: 400 });
    }
    if (!luas) {
      return new NextResponse("Luas wajib diisi", { status: 400 });
    }
    if (!panenId) {
      return new NextResponse("panenId dibutuhkan", { status: 400 });
    }

    // Pastikan workspace ini memang milik user yang login
    const panenByUserId = await db.panen.findFirst({
      where: { id: panenId, userId },
    });

    if (!panenByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const lahan = await db.lahan.create({
      data: {
        nama,
        lokasi,
        luas,
        panenId,
        status: "kosong",
      },
    });

    return NextResponse.json(lahan);
  } catch (error) {
    console.log("[LAHAN_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}