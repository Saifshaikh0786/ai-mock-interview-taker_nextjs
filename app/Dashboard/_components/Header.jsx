"use client"
import { UserButton } from '@clerk/nextjs';
import { UserCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

function Header() {

    const path=usePathname();

    useEffect(()=>{
        console.log(path)
    },[])


  return (
    <div className='flex p-2 items-center justify-between bg-secondary shadow-sm'>
      <img src={'./logo.svg'} width={160} height={100} alt="Logo" />
      <ul className='hidden md:flex gap-6 '>
        <li 
        className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path=='/Dashboard'&&'text-primary font-bold'}
        `}>
            Dashboard</li>

        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path=='/Dashboard/Questions'&&'text-primary font-bold'}
        `}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path=='/Dashboard/Upgrade'&&'text-primary font-bold'}
        `}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path=='/Dashboard/How'&&'text-primary font-bold'}
        `}>How its works?</li>
      </ul>
      <UserButton/>
    </div>
  );
}

export default Header;
