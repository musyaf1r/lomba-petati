import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { role } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!role || !["petani", "user"].includes(role)) {
      return new NextResponse("Role tidak valid", { status: 400 });
    }

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json({ role });
  } catch (error) {
    console.log("[SET_ROLE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}