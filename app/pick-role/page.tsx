'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
        toast.success(`masuk sebagai${role.title}`)
        router.push(role.redirect)
        router.refresh()
    }catch(error){
        toast.error("gagal memilih peran, coba lagi")
        setLoading(false)
    }
}


  return (
    <div className='flex h-full min-h-screen flex-col items-center justify-center gap-8 p-6'>
        <div className="text-center space-y-2">
            <h1 className='text-2xl font-bold'>Pilih peran</h1>
            <p className='text-muted-foreground'>pilih salah satu untuk melanjutkan</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            {roles.map((role)=>(
                <Card key={role.value} onClick={()=>!loading && onSelect(role)}
                className={cn("cursor-pointer transition hover:border-primary hover:shadow-md overflow-hidden py-0",
                    loading && 'pointer-events-none opacity-50',seleted === role.value && "border-primary"
                )}>
                    <div className='relative w-full aspect-square'>
                        <Image src={role.image} alt={role.title} fill className="object-cover" />
                    </div>
                    <CardHeader className='pb-6'>
                        <CardTitle>{role.title}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    </div>
  )
}

export default RolePick