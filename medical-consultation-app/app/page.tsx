"use client"

import { useState } from "react"
import { MessageCircle, Search, ClipboardList, Heart, Shield, Users } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto bg-background min-h-screen shadow-xl">
        {/* Header */}
        <header className="bg-primary text-primary-foreground p-4 text-center">
          <h1 className="text-xl font-bold">Tư vấn Y tế AI</h1>
          <p className="text-sm opacity-90">Chăm sóc sức khỏe thông minh</p>
        </header>

        {/* Content */}
        <main className="flex-1 pb-20">{renderContent()}</main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background border-t border-border">
          <div className="flex justify-around py-2">
            <Button
              variant={activeTab === "home" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("home")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Heart className="h-5 w-5" />
              <span className="text-xs">Trang chủ</span>
            </Button>
            <Button
              variant={activeTab === "chat" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("chat")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">Tư vấn AI</span>
            </Button>
            <Button
              variant={activeTab === "lookup" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("lookup")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Search className="h-5 w-5" />
              <span className="text-xs">Tra cứu</span>
            </Button>
            <Button
              variant={activeTab === "screening" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("screening")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs">Sàng lọc</span>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  )
}

function HomePage({ setActiveTab }: { setActiveTab: (tab: ActiveTab) => void }) {
  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Chào mừng đến với Tư vấn Y tế AI</h2>
        <p className="text-muted-foreground text-balance">
          Ứng dụng hỗ trợ chăm sóc sức khỏe thông minh với AI, tra cứu thông tin y khoa và sàng lọc tâm lý
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("chat")}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Tư vấn AI</CardTitle>
                <CardDescription>Trò chuyện với AI về các vấn đề sức khỏe</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("lookup")}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Tra cứu Y khoa</CardTitle>
                <CardDescription>Tìm kiếm thông tin về bệnh lý, thuốc và triệu chứng</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("screening")}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-chart-2/20 rounded-lg flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <CardTitle className="text-lg">Sàng lọc Tâm lý</CardTitle>
                <CardDescription>Đánh giá sức khỏe tâm thần với các bài test chuẩn</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium">An toàn</p>
          <p className="text-xs text-muted-foreground">Bảo mật thông tin</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Heart className="h-6 w-6 text-accent" />
          </div>
          <p className="text-sm font-medium">Tin cậy</p>
          <p className="text-xs text-muted-foreground">Nguồn uy tín</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-chart-2/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="h-6 w-6 text-chart-2" />
          </div>
          <p className="text-sm font-medium">Hỗ trợ</p>
          <p className="text-xs text-muted-foreground">24/7</p>
        </div>
      </div>
    </div>
  )
}
