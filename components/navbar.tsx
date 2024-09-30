'use client'

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import DynamicSearchBar from "./DynamicSearchBar";

import { useState } from "react";



export default function Navbar() {


    return (
        <nav className="sticky top-0 min-h-[10vh]">
            <div className="bg-white shadow-sm py-2 px-4 flex justify-between items-start z-50 sticky top-0">
                <Link href={"/"} className="text-lg mt-2 font-bold flex gap-2 items-center">
                   
                    <p className="hidden sm:block pt-3 pb-0">bnbIndia</p>
                </Link>
                <div className="hidden md:block">
                    <DynamicSearchBar />

                </div>
                <div className="mt-2">

                    <ProfileMenu />
                </div>
            </div>
 


 
        </nav>
    );
}

import React from 'react';

const ProfileMenu = () => {
  return (
    <div className="flex items-center relative">
      {/* Gray Circle (Avatar) */}
      <div className="w-10 h-10 rounded-full bg-gray-500"></div>


    </div>
  );
};

