import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import db from "@/lib/db"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ produkId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { produkId } = await params
    if (!produkId) {
      return new NextResponse("ID produk wajib ada", { status: 400 })
    }

    const produk = await db.produk.findUnique({
      where: { id: produkId },
      include: { panen: { select: { userId: true } } },
    })

    if (!produk) {
      return new NextResponse("Produk tidak ditemukan", { status: 404 })
    }

    if (produk.panen.userId !== userId) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    await db.produk.delete({ where: { id: produkId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[PRODUK_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}