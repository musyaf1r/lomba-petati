    'use client'
    import { PopoverTrigger } from './ui/popover'
    import { Panen } from '@/lib/generated/prisma/client'
    import React, { useState } from 'react'
    import { usePanenModal } from '@/hook/use-panen-modal'
    import { useParams } from 'next/dist/client/components/navigation'
    import { useRouter } from 'next/navigation'
    import { Popover } from './ui/popover'
    import { Button } from './ui/button'
    import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react'
    import { cn } from '@/lib/utils'
    import { PopoverContent } from './ui/popover'
    import { Command, CommandList,CommandInput,CommandEmpty,CommandGroup,CommandItem, CommandSeparator  } from './ui/command'
    type PopOverTriggerProps =  React.ComponentPropsWithoutRef <typeof PopoverTrigger>

    interface PanenSwitcherProps extends PopOverTriggerProps{
        items: Panen [];
    }

    const PanenSwitcher = ( {
        className,
        items = []
    }: PanenSwitcherProps) => {
        const PanenModal= usePanenModal();
        const params = useParams();
        const router = useRouter();



        const formattedItems = items.map((item)=>({
            label: item.name,
            value: item.id,
            href: `/${item.id}`
        }))
    const currentPanen = formattedItems.find((item)=> item.value === params.panenId);
    const [open,setOpen] = useState(false);
    const onPanenSelect = (item:{value:string, label:string,})=>{
        setOpen(false);
        router.push(`/${item.value}`)
        router.refresh();
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <StoreIcon className="mx-2 h-4 w-4"/>
            <PopoverTrigger 
            render={  <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="pilih toko " className={cn("w-50 justify-between", className)}>
                    {currentPanen?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>}/>
                
            
            <PopoverContent className="w-50 p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search Panen..." />
                        <CommandEmpty>
                        toko tidak ditemukan
                        </CommandEmpty>
                        <CommandGroup heading="Toko">
                            {formattedItems.map((item)=>(
                                <CommandItem key={item.value} onSelect={()=>onPanenSelect(item)} className="text-sm">
                                    
                                    {item.label}
                                    <Check className={cn("ms-auto h-4 w-4", currentPanen?.value === item.value?"opacity-100":"opacity-0")}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={()=>{
                                setOpen(false);
                                PanenModal.onOpen();
                            }}>
                                <PlusCircle className="mr2 h-5 w-5"/> Buat Toko
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
    }

    export default PanenSwitcher