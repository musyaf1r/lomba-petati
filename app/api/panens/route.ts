import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request){
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const {name} = body

    if (!userId){
        return new NextResponse("Unautherized",{status:401})
    }
    if(!name){
        return new NextResponse("Nama toko perlu diinput",{status:400})
    }


    const panen = await db.panen.create({
        data:{
            name,
            userId
        }
    })

    return NextResponse.json(panen);
  }
  catch (error) {
    console.log("[panen_POST]", error)
    return new NextResponse("internal error", { status: 500 })
  }
}