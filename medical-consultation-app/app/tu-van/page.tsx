'use client'
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
const ChatInterface = dynamic(() => import("@/components/chat-interface").then(m => m.ChatInterface), { ssr: false })
export default function TuVanPage() {
  const params = useSearchParams()
  const id = params.get('id') || undefined
  return <div suppressHydrationWarning><ChatInterface initialConversationId={id} /></div>
}
