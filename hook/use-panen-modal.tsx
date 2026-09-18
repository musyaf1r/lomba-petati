import { create } from "zustand";

interface usePanenModalPanen{
    isOpen:boolean;
    onOpen: ()=>void
    onClose: ()=> void
}

export const usePanenModal = create<usePanenModalPanen>((set)=>
({
    isOpen:false,
    onOpen:()=> set({isOpen:true}),
    onClose:() =>set({isOpen:false}),
}))