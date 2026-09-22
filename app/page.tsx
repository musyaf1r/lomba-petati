import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Rootpage() {
    const {userId,sessionClaims} = await auth()
    if(!userId)
        {
            redirect("/sign-in")
        }

        const role =(sessionClaims?.mentadata as {role?:string})?.role
        if(!role)
            {
                redirect("/pick-role")
            }
            if(role==="petani")
            {
                redirect("/petani")
            }
            if(role === "user")
            {
                redirect("/user")
            }
}