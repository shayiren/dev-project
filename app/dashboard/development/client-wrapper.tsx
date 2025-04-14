"use client"

import dynamic from "next/dynamic"

// Use dynamic import with no SSR in a client component
const DevelopmentClientPage = dynamic(() => import("./client-page").then((mod) => mod.default), { ssr: false })

export default function DevelopmentClientWrapper() {
  return <DevelopmentClientPage />
}
