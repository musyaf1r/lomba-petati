'use client'

import * as z from 'zod'
import axios from 'axios'


import { usePanenModal } from "@/hook/use-panen-modal"
import Modal from "../ui/modal"
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import toast from 'react-hot-toast'

const formSchema =z.object({
    name:z.string().min(1),
});




export const PanenModal = () => {
    const [loading,setloading]= useState(false)
    const panenModal = usePanenModal();
    const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
        name:"",
    }
});
const onSumbit = async (value:z.infer<typeof formSchema>)=>{
    try {
        setloading(true)
        const response = await axios.post("/api/panens", value);
        console.log(response.data);
        toast.success("berhasil membuat toko");
        window.location.assign(`/petani/${response.data.id}`)
        }catch (error){
        toast.error("gagal membuat toko");
    }finally{
        setloading(false);
    }
    
};
    return (
        <Modal
        title="tambahkan Panen"
        description="tambah kan hasil panen dari ladang anda"
        isOpen={panenModal.isOpen}
        onClose={panenModal.onClose}
        >
         <div>
            <div className='space-y-4 py-4 pb-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSumbit)}>
                    <FormField
                     control={form.control}
                     name="name"
                     render={({field})=>(
                        <FormItem>
                            <FormLabel>hasil Panen</FormLabel>
                            <FormControl>
                                <Input
                                placeholder='Hasil Panen' {...field}
                                disabled={loading}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                     )}
                    />
                    <div className="pt-6 space-x-2 flex justify-end items-center w-full">
                        <Button variant="outline" onClick={panenModal.onClose}> cancel</Button>
                        <Button disabled={loading} type="submit"> continue</Button>
                    </div>
                </form>
            </Form>
            </div>
        </div>
        </Modal>
    )
}