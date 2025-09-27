"use client"

import { useState } from "react"
import { Search, Book, Pill, Activity, AlertCircle, CheckCircle, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function HealthLookup() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: "Tiểu đường type 2",
          type: "Bệnh lý",
          description: "Bệnh tiểu đường type 2 là tình trạng cơ thể không sử dụng insulin hiệu quả",
          symptoms: ["Khát nước nhiều", "Tiểu nhiều", "Mệt mỏi", "Giảm cân"],
          severity: "medium"
        },
        {
          id: 2,
          title: "Metformin",
          type: "Thuốc",
          description: "Thuốc điều trị tiểu đường type 2, giúp kiểm soát đường huyết",
          dosage: "500mg - 1000mg mỗi ngày",
          severity: "low"
        }
      ]
      setSearchResults(mockResults)
      setIsLoading(false)
    }, 1500)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Bệnh lý": return <Activity className="h-4 w-4" />
      case "Thuốc": return <Pill className="h-4 w-4" />
      default: return <Book className="h-4 w-4" />
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-purple-50 via-white to-indigo-50" 
         style={{ 
           WebkitOverflowScrolling: 'touch',
           scrollBehavior: 'smooth'
         }}>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg mb-3">
            <Search className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Tra cứu thông tin y tế
          </h1>
          <p className="text-sm text-gray-600">
            Tìm kiếm thông tin về bệnh lý, thuốc men và các vấn đề sức khỏe
          </p>
        </div>

      {/* Enhanced Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Nhập tên bệnh, thuốc hoặc triệu chứng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-200"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={!searchQuery.trim() || isLoading}
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Đang tìm kiếm...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Tìm kiếm
            </div>
          )}
        </Button>
      </div>

      {/* Enhanced Quick Categories */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Danh mục phổ biến
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={() => {setSearchQuery("đau đầu"); handleSearch()}}
            className="h-auto p-4 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl transition-all duration-200"
          >
            <div className="flex flex-col items-center gap-2">
              <Activity className="h-6 w-6 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Triệu chứng</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {setSearchQuery("paracetamol"); handleSearch()}}
            className="h-auto p-4 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl transition-all duration-200"
          >
            <div className="flex flex-col items-center gap-2">
              <Pill className="h-6 w-6 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700">Thuốc</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Enhanced Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Kết quả tìm kiếm ({searchResults.length})
          </h3>
          {searchResults.map((result, index) => (
            <Card 
              key={result.id} 
              className="border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] bg-gradient-to-r from-white to-gray-50"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.5s ease-out forwards"
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      {getTypeIcon(result.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800">{result.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {result.type}
                        </Badge>
                        <Badge className={`text-xs ${getSeverityColor(result.severity)}`}>
                          {result.severity === "high" ? "Nghiêm trọng" : 
                           result.severity === "medium" ? "Trung bình" : "Nhẹ"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 mb-3 leading-relaxed">
                  {result.description}
                </CardDescription>
                
                {result.symptoms && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Triệu chứng:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.symptoms.map((symptom: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.dosage && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-1 mb-1">
                      <Clock className="h-4 w-4" />
                      Liều dùng:
                    </h4>
                    <p className="text-sm text-blue-700">{result.dosage}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Disclaimer */}
      <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">Lưu ý quan trọng</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              Thông tin này chỉ mang tính chất tham khảo và không thể thay thế lời khuyên chuyên môn của bác sĩ. 
              Vui lòng tham khảo ý kiến chuyên gia y tế để có chẩn đoán và điều trị chính xác.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      </div>
    </div>
  )
}
