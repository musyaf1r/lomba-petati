import {auth,clerkClient} from"@clerk/nextjs/server"
import {NextResponse} from"next/server"


export async function POST(req:Request){
    try{
        const {userId} = await auth();
        const body = await req.json();
        const {role} =body;
        if(!userId)
            {
                return new NextResponse("unauthenticated", { status: 401 });
            }
            if(!role||!["Petani","user"].includes(role))
                {return new NextResponse("Role tidak Valid",{status:400});}
            const client = await clerkClient();
            await client.users.updateUserMetadata(userId,{publicMetadata:{role},})
            return NextResponse.json({role});
    }catch{Error}{console.log("[SET_ROLE]"),Error};
    return new NextResponse("internal error",{status:500})
}