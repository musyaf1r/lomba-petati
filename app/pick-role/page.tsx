'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserButton } from '@clerk/nextjs'
import axios from 'axios'
import { cn } from 'cn'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const roles=[
    {value:"petani",
     title:"petani",
     description:"Pilih sebagai petani dan masukan panen anda",
     image:"",
     redirect:"/petani",
    },
    {value:"user",
     title:"konsumen",
     description:"pilih sebagai konsumen untuk melihan dan memesan",
     image:"",
     redirect:"/user"
    
    }
]


const RolePick = () => {


const router = useRouter()
const [loading,setLoading]= useState(false)
const [seleted, setSeleted] = useState<string|null>(null)

const onSelect = async(role:(typeof roles)[number])=>{
    try{
        setSeleted(role.value)
        setLoading(true)
        await axios.post("/api/set-role",{role:role.value})
        toast.success(`masuk sebagai ${role.title}`)
        router.push(role.redirect)
        router.refresh()
    }catch(error){
        toast.error("gagal memilih peran, coba lagi")
        setLoading(false)
    }
}


  return (
  <>   
  <div className="border-b border-[#051747]">
        </div>  
  <div className='flex h-full min-h-screen flex-col items-center justify-center gap-4 md:gap-8 p-4 md:p-6'>
        <div className="text-center space-y-1 md:space-y-2">
            <h1 className='text-lg md:text-2xl font-bold'>Pilih peran</h1>
            <p className='text-xs md:text-base text-muted-foreground'>pilih salah satu untuk melanjutkan</p>
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-6 w-full max-w-[280px] md:max-w-2xl">
            {roles.map((role)=>(
                <Card key={role.value} onClick={()=>!loading && onSelect(role)}
                className={cn("cursor-pointer transition hover:border-primary hover:shadow-md overflow-hidden py-0",
                    loading && 'pointer-events-none opacity-50',seleted === role.value && "border-primary"
                )}>
                    <div className='relative w-full aspect-[4/3] md:aspect-square'>
                        <Image src={role.image} alt={role.title} fill className="object-cover" />
                    </div>
                    <CardHeader className='p-2 md:p-6 gap-0.5 md:gap-1.5'>
                        <CardTitle className='text-xs md:text-base'>{role.title}</CardTitle>
                        <CardDescription className='text-[10px] md:text-sm line-clamp-2 md:line-clamp-none'>{role.description}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    </div>
  </>
  
  )
}

export default RolePick