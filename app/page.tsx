import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {LandingPage} from "@/components/landingpage"


export default async function Rootpage() {
    const {userId,sessionClaims} = await auth()
    if(!userId)
        {
            return <LandingPage />
        }

        const role =(sessionClaims?.metadata as {role?:string})?.role
        if(!role)
            {
                redirect("/pick-role")
            }
            if(role==="petani")
            {
                redirect("/petani")
            } 
              redirect("/user")
}