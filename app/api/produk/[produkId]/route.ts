import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


const keAngka = (nilai: unknown) =>
  nilai === "" || nilai === null || nilai === undefined ? NaN : Number(nilai)

export async function PATCH(
  req: Request,
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

    const body = await req.json()
    const hargaJual = keAngka(body.hargaJual)
    const stok = keAngka(body.stok)

    if (!Number.isFinite(hargaJual) || hargaJual <= 0) {
      return new NextResponse("Harga harus lebih dari 0", { status: 400 })
    }
    if (!Number.isFinite(stok) || stok < 0) {
      return new NextResponse("Stok tidak boleh kosong atau negatif", { status: 400 })
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

    const diperbarui = await db.produk.update({
      where: { id: produkId },
      data: { hargaJual, stok },
    })

    return NextResponse.json(diperbarui)
  } catch (error) {
    console.log("[PRODUK_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

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