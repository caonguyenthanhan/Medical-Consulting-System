"use client"

import { useState } from "react"
import { MessageCircle, Search, ClipboardList, Heart, Shield, Users, Sparkles } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat-interface"
import { HealthLookup } from "@/components/health-lookup"
import { PsychologicalScreening } from "@/components/psychological-screening"

type ActiveTab = "home" | "chat" | "lookup" | "screening"

export default function MedicalApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home")

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatInterface />
      case "lookup":
        return <HealthLookup />
      case "screening":
        return <PsychologicalScreening />
      default:
        return <HomePage setActiveTab={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div 
        className="w-full max-w-sm mx-auto bg-white/98 backdrop-blur-md shadow-2xl border border-gray-100 flex flex-col overflow-hidden rounded-3xl"
        style={{ 
          aspectRatio: '9/16',
          height: '100vh',
          maxHeight: '844px',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg flex-shrink-0 rounded-t-3xl">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center p-1">
                <Image 
                  src="/medical-logo.png" 
                  alt="Medical Logo" 
                  width={24} 
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold">Tư vấn Y tế AI</h1>
                <p className="text-blue-100 text-xs">Chăm sóc sức khỏe thông minh</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden flex flex-col">{renderContent()}</main>

        {/* Bottom Navigation */}
        <nav className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg flex-shrink-0 rounded-b-3xl">
          <div className="grid grid-cols-4 gap-1 p-3 pb-4">
            {[
              { id: 'home', icon: Heart, label: 'Trang chủ' },
              { id: 'chat', icon: MessageCircle, label: 'Tư vấn' },
              { id: 'lookup', icon: Search, label: 'Tra cứu' },
              { id: 'screening', icon: ClipboardList, label: 'Sàng lọc' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex flex-col items-center justify-center space-y-1 py-2 px-1 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'text-blue-600 bg-blue-50 scale-105 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95'
                }`}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

function HomePage({ setActiveTab }: { setActiveTab: (tab: ActiveTab) => void }) {
  return (
    <div 
      className="flex-1 overflow-y-auto p-5 space-y-6"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth'
      }}
    >
      {/* Welcome Section */}
      <div className="text-center space-y-4 pt-2">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Chào mừng đến với AI Medical
          </h2>
          <p className="text-gray-600 text-sm">
            Hệ thống tư vấn y tế thông minh
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-4">
        <Card 
          className="p-5 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 rounded-2xl active:scale-95"
          onClick={() => setActiveTab('chat')}
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base mb-1">Tư vấn AI</h3>
              <p className="text-sm text-gray-600">Đặt câu hỏi và nhận tư vấn y tế</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-5 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-green-50 to-green-100 border-green-200 rounded-2xl active:scale-95"
          onClick={() => setActiveTab('lookup')}
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base mb-1">Tra cứu Y khoa</h3>
              <p className="text-sm text-gray-600">Tìm kiếm thông tin về bệnh lý</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-5 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 rounded-2xl active:scale-95"
          onClick={() => setActiveTab('screening')}
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base mb-1">Sàng lọc Tâm lý</h3>
              <p className="text-sm text-gray-600">Đánh giá tình trạng sức khỏe tâm thần</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 text-base">
          Thống kê hệ thống
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="text-base font-bold text-gray-900">1,234</div>
            <div className="text-xs text-gray-600 font-medium">Người dùng</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="text-base font-bold text-gray-900">5,678</div>
            <div className="text-xs text-gray-600 font-medium">Tư vấn</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="text-base font-bold text-gray-900">98%</div>
            <div className="text-xs text-gray-600 font-medium">Hài lòng</div>
          </div>
        </div>
      </div>
    </div>
  )
}
