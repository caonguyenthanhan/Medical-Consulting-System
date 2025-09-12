"use client"

import type React from "react"
import { useState } from "react"
import { Search, Pill, Activity, Brain, Heart, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AiChatBox } from "./ai-chat-box"

interface HealthInfo {
  id: string
  title: string
  category: string
  description: string
  details: string[]
  icon: React.ReactNode
}

const healthData: HealthInfo[] = [
  {
    id: "1",
    title: "Paracetamol",
    category: "Thuốc",
    description: "Thuốc giảm đau, hạ sốt phổ biến",
    details: [
      "Thành phần: Paracetamol 500mg",
      "Công dụng: Giảm đau, hạ sốt",
      "Cách dùng: 1-2 viên/lần, 3-4 lần/ngày",
      "Tác dụng phụ: Hiếm gặp khi dùng đúng liều",
      "Lưu ý: Không quá 4g/ngày",
    ],
    icon: <Pill className="h-5 w-5" />,
  },
  {
    id: "2",
    title: "Đau đầu",
    category: "Triệu chứng",
    description: "Cảm giác đau ở vùng đầu và cổ",
    details: [
      "Nguyên nhân: Căng thẳng, mệt mỏi, thiếu ngủ",
      "Triệu chứng: Đau âm ỉ hoặc nhói",
      "Điều trị: Nghỉ ngơi, massage, thuốc giảm đau",
      "Khi nào cần gặp bác sĩ: Đau dữ dội, kéo dài",
      "Phòng ngừa: Ngủ đủ giấc, giảm căng thẳng",
    ],
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: "3",
    title: "Cảm cúm",
    category: "Bệnh lý",
    description: "Nhiễm trùng đường hô hấp do virus",
    details: [
      "Triệu chứng: Sốt, ho, nghẹt mũi, đau họng",
      "Thời gian: 7-10 ngày",
      "Điều trị: Nghỉ ngơi, uống nhiều nước, thuốc hạ sốt",
      "Phòng ngừa: Rửa tay thường xuyên, tiêm vaccine",
      "Biến chứng: Viêm phổi, viêm xoang",
    ],
    icon: <Activity className="h-5 w-5" />,
  },
  {
    id: "4",
    title: "Huyết áp cao",
    category: "Bệnh lý",
    description: "Tình trạng áp lực máu lên thành mạch cao",
    details: [
      "Chỉ số: ≥140/90 mmHg",
      "Nguyên nhân: Di truyền, lối sống, căng thẳng",
      "Triệu chứng: Thường không có triệu chứng",
      "Điều trị: Thuốc, thay đổi lối sống",
      "Biến chứng: Đột quỵ, nhồi máu cơ tim",
    ],
    icon: <Heart className="h-5 w-5" />,
  },
]

export function HealthLookup() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<HealthInfo | null>(null)
  const [showAiChat, setShowAiChat] = useState(false)

  const filteredData = healthData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (selectedItem) {
    return (
      <div className="p-4">
        <button onClick={() => setSelectedItem(null)} className="text-primary mb-4 text-sm">
          ← Quay lại kết quả tìm kiếm
        </button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                {selectedItem.icon}
              </div>
              <div>
                <CardTitle className="text-xl">{selectedItem.title}</CardTitle>
                <Badge variant="secondary">{selectedItem.category}</Badge>
              </div>
            </div>
            <CardDescription className="mt-2">{selectedItem.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedItem.details.map((detail, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-3">
                  <p className="text-sm">{detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button onClick={() => setShowAiChat(!showAiChat)} variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                {showAiChat ? "Ẩn" : "Hỏi"} AI về {selectedItem.title}
              </Button>

              {showAiChat && (
                <div className="mt-4">
                  <AiChatBox
                    placeholder={`Hỏi AI về ${selectedItem.title}...`}
                    initialMessage={`Xin chào! Tôi có thể giúp bạn tìm hiểu thêm về ${selectedItem.title}. Bạn có câu hỏi gì cụ thể không?`}
                    context="health lookup"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Nguồn tham khảo:</strong> Thông tin được tổng hợp từ các nguồn y khoa uy tín. Vui lòng tham khảo
                ý kiến bác sĩ để có lời khuyên chính xác.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bệnh lý, thuốc, triệu chứng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Button onClick={() => setShowAiChat(!showAiChat)} variant="outline" className="w-full">
        <MessageCircle className="h-4 w-4 mr-2" />
        {showAiChat ? "Ẩn" : "Tra cứu nhanh"} với AI
      </Button>

      {showAiChat && (
        <AiChatBox
          placeholder="Hỏi AI về bất kỳ vấn đề sức khỏe nào..."
          initialMessage="Xin chào! Tôi có thể giúp bạn tra cứu thông tin về bệnh lý, thuốc, triệu chứng hoặc bất kỳ vấn đề sức khỏe nào. Bạn muốn tìm hiểu về gì?"
          context="health lookup"
        />
      )}

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["Tất cả", "Thuốc", "Bệnh lý", "Triệu chứng"].map((category) => (
          <Badge
            key={category}
            variant={category === "Tất cả" ? "default" : "outline"}
            className="whitespace-nowrap cursor-pointer"
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filteredData.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Không tìm thấy kết quả phù hợp</p>
            </CardContent>
          </Card>
        ) : (
          filteredData.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedItem(item)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
