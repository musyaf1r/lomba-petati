import db from "@/lib/db";
import { redirect } from "next/navigation";
import SettingFrom from "./components/Settingfrom";
import { auth } from "@clerk/nextjs/server";


interface SettingPageProps {
    params: Promise<{
        panenId:string;
    }>
}

const SettingPage: React.FC<SettingPageProps> = async({params}) => {
    const {userId} = await auth();

    if(!userId){
        redirect('/sign-in');
    }
    
    const {panenId} = await params;
    const panen =await db.panen.findFirst({
        where:{
            id:panenId,
            userId

        }
    })
    if (!panen){
        redirect('/');
    }
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingFrom initialData={panen}/>
        </div>
    </div>
  )
}

export default SettingPage