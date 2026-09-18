"use client"

import Image from "next/image";
import {Button} from '@/components/ui/button'
import Modal from "@/components/ui/modal";
import { usePanenModal } from "@/hook/use-panen-modal";
import { useEffect } from "react";

const setupPage=()=> {
  const onOpen =usePanenModal((state)=> state.onOpen)
  const isOpen =usePanenModal((state)=> state.isOpen)

  useEffect(()=>{
    if(!isOpen){
      onOpen()
    }
  },[isOpen,onOpen])
  return null
}

export default setupPage;
