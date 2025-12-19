"use client"
import dynamic from "next/dynamic"
const HealthLookup = dynamic(() => import("@/components/health-lookup").then(m => m.HealthLookup), { ssr: false })
export default function TraCuuPage() {
  return <HealthLookup />
}
