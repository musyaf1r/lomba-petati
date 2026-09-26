import { NextResponse } from "next/server";

export async function GET() {
    try{
        const res =await fetch("https://www.bi.go.id/hargapangan/WebSite/Home/GetProvinceAll",
            {
                headers:{"X-Requested-With":"XMLHttpRequest",  
                    Accept:"application/json,text/javascript,*/*; q=0.01"
                },
                next:{revalidate:86400},
            }
        );if(!res.ok){
            throw new Error(`gagal fetch provinsi:${res.status}`)
        }
        const json= await res.json();
        return NextResponse.json({data:json.data});
    }catch(error){
        console.log("[PROVINSI_GET]",error)
        return new NextResponse("gagal mengambil dafat provinsi",{status:500})  
    }
    
}