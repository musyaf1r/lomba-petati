'use client'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui//heading'
import { Separator } from '@/components/ui/separator'
import { Panen } from '@/lib/generated/prisma/client'
import { Trash } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/alert-modal'
import { ApiAlert } from '@/components/ui/api-alert'
import { useOrigin } from '@/hook/use-origin'


interface SettingFromProps {
  initialData: Panen

}

const formSchema = z.object({
  name:z.string().min(1)
})

type SettingFormValues = z.infer<typeof formSchema>;

const SettingFrom: React.FC<SettingFromProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open,setOpen] = useState(false)
  const[loading,setLoading] =useState(false)

  const form = useForm<SettingFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData,
  })


  const onSubmit= async(data:SettingFormValues)=>{
   try{
    setLoading(true);
    await axios.patch(`/api/stores/${params.storeId}`,data)
    router.refresh()
    toast.success("toko berhasil di update")
   }catch(error){
    toast.error("Cek kembali data yang diinput")
   }finally{
    setLoading(false)
   }
  }

  const onDelete = async ()=>{
    try{
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push("/")
      toast.success("Toko berhasil di hapus")
    }catch(error){
      toast.error("cek kembali data dan koneksimu")
    }finally{
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
    <AlertModal isOpen={open} 
    onClose={()=>setOpen(false)} 
    onConfirm={onDelete} 
    loading={loading}/>
    <div className='flex items-center justify-between'>
      <Heading
      title="Setting"
      description="Manage store preferences"
      /> 
      <Button disabled={loading}
      variant="destructive" size="sm" onClick={()=>setOpen(true)}>
         <Trash className="h-4 w-4"/>
      </Button>
    </div>
    <Separator/>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="grid-cols-3 gap-8">
           <FormField
           control={form.control}
           name="name"
           render={({field})=>(
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Shop Name' disabled={loading} {...field} className="w-50"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
  )}
           />
        </div>
        <Button disabled={loading}
        type="submit"
        >
          save
        </Button>
      </form>
    </Form>
    <Separator/>
    <ApiAlert  title="PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
    </>
  )
}

export default SettingFrom