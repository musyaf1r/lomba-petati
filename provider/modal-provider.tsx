'use client'

import { PanenModal } from "@/components/modals/panen-modal"
import { LahanModal } from "@/components/modals/lahan-modal"
import { useEffect, useState } from "react"

export const ModalProvider =() =>{
    const [isMounted,setIsMounted]=useState(false)

    useEffect(()=>{
        setIsMounted(true)
    },[])
    if (!isMounted){
        return null
    }
    return (
        <>
        <PanenModal/>
        <LahanModal/>
        </>
    )
}