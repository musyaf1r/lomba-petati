import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const panenId = searchParams.get("panenId");
    const body = await req.json();

    const { namaBarang, hargaJual, stok, satuan, fotoUrl, nomorHp } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!namaBarang) return new NextResponse("Nama barang wajib diisi", { status: 400 });
    if (!hargaJual) return new NextResponse("Harga wajib diisi", { status: 400 });
    if (!stok) return new NextResponse("Stok wajib diisi", { status: 400 });
    if (!nomorHp) return new NextResponse("Nomor HP wajib diisi", { status: 400 });
    if (!panenId) return new NextResponse("panenId dibutuhkan", { status: 400 });

    const panenByUserId = await db.panen.findFirst({
      where: { id: panenId, userId },
    });
    if (!panenByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const user = await currentUser();
    const namaPetani = user?.firstName
      ? `${user.firstName} ${user.lastName ?? ""}`.trim()
      : "Petani";

    const produk = await db.produk.create({
      data: {
        panenId,
        namaPetani,
        namaBarang,
        hargaJual: Number(hargaJual),
        stok: Number(stok),
        satuan: satuan || "kg",
        fotoUrl: fotoUrl || null,
        nomorHp,
      },
    });

    return NextResponse.json(produk);
  } catch (error) {
    console.log("[PRODUK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const produkList = await db.produk.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(produkList);
  } catch (error) {
    console.log("[PRODUK_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}