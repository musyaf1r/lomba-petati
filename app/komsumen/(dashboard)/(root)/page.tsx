'use client'



import { useRouter } from 'next/navigation'
import React from 'react'

const Roleswitcher = () => {
    const router = useRouter()
    const onSwitch = ()=>{
        router.push("/pick")
    }
  return (
    <div>Roleswitcher</div>
  )
}

export default Roleswitcher