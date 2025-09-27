"use client"

import { useState, useRef, useEffect } from "react"
import { Send, AlertTriangle, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createPrompt, parseModelResponse } from "@/lib/llm-config"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Xin chào! Tôi là trợ lý AI y tế được huấn luyện chuyên biệt. Tôi có thể giúp bạn tìm hiểu về các vấn đề sức khỏe. Bạn có câu hỏi gì không?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Smart suggestion system based on context and conversation history
  const getSmartSuggestions = () => {
    // Base suggestions for new conversations
    const baseSuggestions = [
      "Tôi bị đau đầu, có phải cảm cúm không?",
      "Liệu pháp nào giúp giảm lo âu?",
      "Thông tin về thuốc Paracetamol?",
      "Cách phòng ngừa cảm cúm?",
    ]

    // Advanced suggestions based on conversation context
    const contextualSuggestions = {
      pain: [
        "Đau đầu kéo dài bao lâu thì cần đi khám?",
        "Cách giảm đau tự nhiên không dùng thuốc?",
        "Phân biệt đau đầu thường và đau đầu nguy hiểm?",
        "Thuốc giảm đau nào an toàn nhất?"
      ],
      mental: [
        "Làm thế nào để biết mình có trầm cảm?",
        "Kỹ thuật thở giúp giảm căng thẳng?",
        "Khi nào cần gặp bác sĩ tâm lý?",
        "Cách cải thiện giấc ngủ tự nhiên?"
      ],
      medication: [
        "Cách uống thuốc đúng cách?",
        "Tác dụng phụ của thuốc kháng sinh?",
        "Thuốc có thể uống cùng thức ăn không?",
        "Quên uống thuốc thì phải làm sao?"
      ],
      prevention: [
        "Chế độ ăn tăng cường miễn dịch?",
        "Tập thể dục như thế nào để khỏe mạnh?",
        "Cách phòng ngừa bệnh tim mạch?",
        "Kiểm tra sức khỏe định kỳ gồm gì?"
      ]
    }

    // Analyze recent messages for context
    if (messages.length > 1) {
      const recentMessages = messages.slice(-3).map(m => m.content.toLowerCase())
      const conversationText = recentMessages.join(' ')

      // Detect conversation themes
      if (conversationText.includes('đau') || conversationText.includes('nhức')) {
        return contextualSuggestions.pain
      }
      if (conversationText.includes('lo âu') || conversationText.includes('stress') || 
          conversationText.includes('trầm cảm') || conversationText.includes('tâm lý')) {
        return contextualSuggestions.mental
      }
      if (conversationText.includes('thuốc') || conversationText.includes('uống') || 
          conversationText.includes('liều')) {
        return contextualSuggestions.medication
      }
      if (conversationText.includes('phòng ngừa') || conversationText.includes('tránh') || 
          conversationText.includes('ngăn ngừa')) {
        return contextualSuggestions.prevention
      }
    }

    return baseSuggestions
  }

  const suggestedQuestions = getSmartSuggestions()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      const prompt = createPrompt(currentInput)

      const response = await fetch("/api/llm-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          context: "general health consultation",
          question: currentInput,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()
      const aiResponse = data.response || parseModelResponse(data.generated_text || data.response)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc tham khảo ý kiến bác sĩ chuyên khoa để có lời khuyên chính xác nhất.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50/50 to-white">
      {/* Medical Disclaimer */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 m-4 mb-3 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm">
            <p className="text-amber-800 font-medium mb-1">
              Lưu ý quan trọng
            </p>
            <p className="text-amber-700 text-xs leading-relaxed">
              Thông tin này chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến bác sĩ chuyên khoa để được chẩn đoán và điều trị chính xác.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto px-4 pb-4"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 ${
              message.isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            {!message.isUser && (
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {message.isUser && (
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Đang trả lời...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="grid grid-cols-1 gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-left p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm active:scale-95"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100 flex-shrink-0">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm"
            style={{ 
              WebkitTapHighlightColor: 'transparent'
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md active:scale-95"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
