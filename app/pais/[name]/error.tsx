"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Error() {
  return (
    <section className="container flex flex-col items-center justify-center">
      <h1 className="text-5xl text-center font-bold text-gray-800 my-16">Ocorreu um erro ao exibir esse país!</h1>
      <Link href="/" className="flex items-center py-2">
        <Image src="/arrow-back.svg" alt="seta de voltar" width={24} height={24}/>
        Voltar
      </Link>
    </section>
  )
}