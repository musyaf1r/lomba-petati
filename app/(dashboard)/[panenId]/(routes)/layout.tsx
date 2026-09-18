
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from '@/lib/db'
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
    children,
    params,

}:{
    children:React.ReactNode;
    params:{panenId:string};
}) {
    const {userId}= await auth();
    if(!userId){
        redirect('/sign-in');
    }
    const panen = await db.panen.findFirst({
        where:{
            id:params.panenId,
            userId: userId
    }
    })
    if(!panen){
        redirect('/')
    }

    const panens =await db.panen.findMany({
        where:{
            userId,
        }
    })

    return(
    <>
        <Navbar />
        {children}
        </>
        )
        
    
}