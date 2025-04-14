"use client"

import dynamic from "next/dynamic"

// Use dynamic import with no SSR in a client component
const SoldUnitsPageWrapper = dynamic(() => import("./sold-units-page-wrapper").then((mod) => mod.default), {
  ssr: false,
})

export default function SoldUnitsClientWrapper() {
  return <SoldUnitsPageWrapper />
}
