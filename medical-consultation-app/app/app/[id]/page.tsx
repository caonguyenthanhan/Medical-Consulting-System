"use client"

import { use } from "react"
import dynamic from "next/dynamic"
const ChatInterface = dynamic(() => import("@/components/chat-interface").then(m => m.ChatInterface), { ssr: false })

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <ChatInterface initialConversationId={id} />
}
