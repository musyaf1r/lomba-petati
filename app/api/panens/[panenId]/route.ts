import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ panenId: string }> }
) {
    try {
        const { userId } = await auth()
        const { panenId } = await params;
        const body = await req.json()

        const { name } = body;

        if (!userId) {
            return new NextResponse("Unaunthenticated", { status: 401 })
        }
        if (!name) {
            return new NextResponse("harus ada nama", { status: 400 })
        }
        if (!panenId) {
            return new NextResponse("panen id dibutuhkan", { status: 400 })
        }

        const panen = await db.panen.updateMany({
            where: {
                id: panenId,
                userId
            },
            data: {
                name
            }
        })

        return NextResponse.json(panen);
    }
    catch (error) {
        console.log('[panen_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ panenId: string }> }
) {
    try {
        const { userId } = await auth()
        const { panenId } = await params;

        if (!userId) {
            return new NextResponse("Unaunthenticated", { status: 401 })
        }
        if (!panenId) {
            return new NextResponse("panen id dibutuhkan", { status: 400 })
        }

        const panen = await db.panen.deleteMany({
            where: {
                id: panenId,
                userId
            },
        })

        return NextResponse.json(panen);
    }
    catch (error) {
        console.log('[panen_DELETE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}