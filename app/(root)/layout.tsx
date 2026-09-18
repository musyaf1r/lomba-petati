import {auth} from '@clerk/nextjs/server'
import db from '@/lib/db'
import { redirect } from 'next/navigation';

export default async function SetupLayout({
    children,
}:{
    children:React.ReactNode;

}){
    const {userId} = await auth();
    if(!userId){
        redirect ("sign-in")
    }
    const panen =await db.panen.findFirst({
        where: {
            userId
        }
    })
    if (panen){
        redirect(`/${panen.id}`)
    }
    return(
        <>
        {children}
        </>
    )
}