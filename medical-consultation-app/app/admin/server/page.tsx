"use client"
import dynamic from "next/dynamic"

const AdminServerPage = dynamic(() => import("./page-client"), { ssr: false })

export default AdminServerPage
