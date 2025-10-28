"use client"

import { useState, useRef, useEffect } from "react"
import { Send, AlertTriangle, Bot, User, Sparkles, Volume2, Pause, Play, Square, Mic } from "lucide-react"
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
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null)
  const [isPausedAudio, setIsPausedAudio] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
        const errorText = await response.text()
        console.error("API Error:", errorText)
        throw new Error(`Failed to get AI response: ${response.status} ${response.statusText}`)
      }

      let data
      try {
        const responseText = await response.text()
        if (!responseText || responseText.trim() === '') {
          throw new Error("Empty response from API")
        }
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("JSON parsing error in frontend:", parseError)
        throw new Error("Invalid response format from server")
      }

      const aiResponse = data.response || parseModelResponse(data.generated_text || data.response || "")

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

  const handleTextToSpeech = async (messageId: string, text: string) => {
    try {
      // Nếu đang phát audio khác, dừng lại
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
        setIsPlayingAudio(null)
        setIsPausedAudio(null)
      }

      setIsPlayingAudio(messageId)

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          lang: "vi"
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate audio: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.audio_url) {
        const audio = new Audio(data.audio_url)
        audioRef.current = audio
        
        audio.onended = () => {
          setIsPlayingAudio(null)
          setIsPausedAudio(null)
          audioRef.current = null
        }
        
        audio.onerror = () => {
          setIsPlayingAudio(null)
          setIsPausedAudio(null)
          audioRef.current = null
        }
        
        await audio.play()
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsPlayingAudio(null)
      setIsPausedAudio(null)
    }
  }

  const handlePauseAudio = (messageId: string) => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setIsPlayingAudio(null)
      setIsPausedAudio(messageId)
    }
  }

  const handleResumeAudio = (messageId: string) => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play()
      setIsPlayingAudio(messageId)
      setIsPausedAudio(null)
    }
  }

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlayingAudio(null)
    setIsPausedAudio(null)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine the best supported audio format
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }
      
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        // Use the actual recorded MIME type, not force it to wav
        const audioBlob = new Blob(chunks, { type: mimeType });
        await handleSpeechToText(audioBlob);
        
        // Dừng tất cả tracks để tắt microphone
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      recorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSpeechToText = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.wav');

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success && data.text) {
        setInput(data.text);
      } else {
        console.error('Speech-to-text error:', data.error);
        alert('Không thể chuyển đổi giọng nói thành văn bản. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error processing speech-to-text:', error);
      alert('Có lỗi xảy ra khi xử lý âm thanh.');
    }
  };

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
              {!message.isUser && (
                <div className="flex justify-end mt-2 space-x-1">
                  {/* Nút Play/Pause */}
                  {isPlayingAudio === message.id ? (
                    <button
                      onClick={() => handlePauseAudio(message.id)}
                      className="p-1 rounded-full bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
                      title="Tạm dừng"
                    >
                      <Pause className="h-3 w-3" />
                    </button>
                  ) : isPausedAudio === message.id ? (
                    <button
                      onClick={() => handleResumeAudio(message.id)}
                      className="p-1 rounded-full bg-green-500 text-white transition-colors duration-200 hover:bg-green-600"
                      title="Tiếp tục"
                    >
                      <Play className="h-3 w-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTextToSpeech(message.id, message.content)}
                      className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200"
                      title="Nghe tin nhắn"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  )}
                  
                  {/* Nút Stop - chỉ hiện khi đang phát hoặc tạm dừng */}
                  {(isPlayingAudio === message.id || isPausedAudio === message.id) && (
                    <button
                      onClick={handleStopAudio}
                      className="p-1 rounded-full bg-red-500 text-white transition-colors duration-200 hover:bg-red-600"
                      title="Dừng"
                    >
                      <Square className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
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
            disabled={isLoading}
          />
          
          {/* Nút ghi âm */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`px-3 py-3 rounded-2xl transition-all duration-200 shadow-md active:scale-95 ${
              isRecording
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
          </button>
          
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
