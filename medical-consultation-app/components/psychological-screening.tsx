"use client"

import { useState } from "react"
import { ChevronRight, CheckCircle, AlertCircle, Info, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AiChatBox } from "./ai-chat-box"

interface Question {
  id: string
  text: string
  options: { value: string; label: string; score: number }[]
}

interface Assessment {
  id: string
  title: string
  description: string
  questions: Question[]
  interpretation: { min: number; max: number; level: string; description: string; recommendations: string[] }[]
}

const phq9Assessment: Assessment = {
  id: "phq9",
  title: "PHQ-9 - Sàng lọc Trầm cảm",
  description: "Bộ câu hỏi chuẩn để đánh giá mức độ trầm cảm trong 2 tuần qua",
  questions: [
    {
      id: "1",
      text: "Ít hứng thú hoặc vui thích khi làm việc",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn một nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "2",
      text: "Cảm thấy buồn, chán nản hoặc tuyệt vọng",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn một nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "3",
      text: "Khó ngủ, ngủ không sâu hoặc ngủ quá nhiều",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn một nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "4",
      text: "Cảm thấy mệt mỏi hoặc thiếu năng lượng",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn một nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "5",
      text: "Ăn kém hoặc ăn quá nhiều",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn một nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
  ],
  interpretation: [
    {
      min: 0,
      max: 4,
      level: "Tối thiểu",
      description: "Mức độ trầm cảm tối thiểu hoặc không có",
      recommendations: ["Duy trì lối sống lành mạnh", "Tập thể dục thường xuyên", "Ngủ đủ giấc 7-8 tiếng/đêm"],
    },
    {
      min: 5,
      max: 9,
      level: "Nhẹ",
      description: "Mức độ trầm cảm nhẹ",
      recommendations: ["Thực hành thiền định, yoga", "Tăng cường hoạt động xã hội", "Theo dõi tâm trạng hàng ngày"],
    },
    {
      min: 10,
      max: 14,
      level: "Trung bình",
      description: "Mức độ trầm cảm trung bình",
      recommendations: [
        "Tham khảo ý kiến chuyên gia tâm lý",
        "Liệu pháp nhận thức hành vi (CBT)",
        "Hỗ trợ từ gia đình và bạn bè",
      ],
    },
    {
      min: 15,
      max: 21,
      level: "Nặng",
      description: "Mức độ trầm cảm nặng",
      recommendations: [
        "Cần gặp bác sĩ tâm thần ngay",
        "Có thể cần điều trị bằng thuốc",
        "Liệu pháp tâm lý chuyên sâu",
      ],
    },
  ],
}

const gad7Assessment: Assessment = {
  id: "gad7",
  title: "GAD-7 - Sàng lọc Lo âu",
  description: "Bộ câu hỏi chuẩn để đánh giá mức độ lo âu trong 2 tuần qua",
  questions: [
    {
      id: "1",
      text: "Cảm thấy lo lắng, bồn chồn hoặc căng thẳng",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn một nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "2",
      text: "Không thể kiểm soát hoặc ngừng lo lắng",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn một nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "3",
      text: "Lo lắng quá nhiều về những việc khác nhau",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn một nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "4",
      text: "Khó thư giãn",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn một nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "5",
      text: "Bồn chồn đến mức khó ngồi yên",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn một nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
  ],
  interpretation: [
    {
      min: 0,
      max: 4,
      level: "Tối thiểu",
      description: "Mức độ lo âu tối thiểu",
      recommendations: ["Duy trì thói quen tập thể dục", "Thực hành hít thở sâu", "Giữ lối sống cân bằng"],
    },
    {
      min: 5,
      max: 9,
      level: "Nhẹ",
      description: "Mức độ lo âu nhẹ",
      recommendations: ["Học kỹ thuật thư giãn", "Thiền định 10-15 phút/ngày", "Giảm caffeine và rượu bia"],
    },
    {
      min: 10,
      max: 14,
      level: "Trung bình",
      description: "Mức độ lo âu trung bình",
      recommendations: ["Tham khảo chuyên gia tâm lý", "Liệu pháp thư giãn cơ bắp", "Tham gia nhóm hỗ trợ"],
    },
    {
      min: 15,
      max: 21,
      level: "Nặng",
      description: "Mức độ lo âu nặng",
      recommendations: ["Cần gặp bác sĩ tâm thần", "Có thể cần điều trị thuốc", "Liệu pháp nhận thức hành vi"],
    },
  ],
}

export function PsychologicalScreening() {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [showAiSupport, setShowAiSupport] = useState(false)

  const assessments = [phq9Assessment, gad7Assessment]

  const handleStartAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
  }

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (selectedAssessment && currentQuestion < selectedAssessment.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResult(true)
    }
  }

  const calculateScore = () => {
    if (!selectedAssessment) return 0
    return selectedAssessment.questions.reduce((total, question) => {
      const answer = answers[question.id]
      const option = question.options.find((opt) => opt.value === answer)
      return total + (option?.score || 0)
    }, 0)
  }

  const getInterpretation = (score: number) => {
    if (!selectedAssessment) return null
    return selectedAssessment.interpretation.find((interp) => score >= interp.min && score <= interp.max)
  }

  const resetAssessment = () => {
    setSelectedAssessment(null)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
    setShowAiSupport(false)
  }

  if (showResult && selectedAssessment) {
    const score = calculateScore()
    const interpretation = getInterpretation(score)

    return (
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Kết quả {selectedAssessment.title}</CardTitle>
            <CardDescription>
              Điểm số: {score}/{selectedAssessment.questions.length * 3}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {interpretation && (
              <>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Mức độ: {interpretation.level}</h3>
                  <p className="text-muted-foreground">{interpretation.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Đề xuất:</h4>
                  <div className="space-y-2">
                    {interpretation.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={() => setShowAiSupport(!showAiSupport)} variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {showAiSupport ? "Ẩn" : "Tâm sự"} với AI
                  </Button>

                  {showAiSupport && (
                    <AiChatBox
                      placeholder="Chia sẻ cảm xúc của bạn..."
                      initialMessage={`Tôi hiểu rằng bạn vừa hoàn thành bài đánh giá và có thể đang có những cảm xúc phức tạp. Tôi ở đây để lắng nghe và hỗ trợ bạn. Bạn có muốn chia sẻ về cảm xúc hiện tại của mình không?`}
                      context="psychological support"
                    />
                  )}
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Kết quả này chỉ mang tính chất tham khảo. Để có đánh giá chính xác, vui lòng tham khảo ý kiến chuyên
                    gia tâm lý hoặc bác sĩ tâm thần.
                  </AlertDescription>
                </Alert>
              </>
            )}

            <Button onClick={resetAssessment} className="w-full">
              Thực hiện bài test khác
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedAssessment) {
    const progress = ((currentQuestion + 1) / selectedAssessment.questions.length) * 100
    const question = selectedAssessment.questions[currentQuestion]
    const currentAnswer = answers[question.id]

    return (
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Câu hỏi {currentQuestion + 1}/{selectedAssessment.questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.text}</CardTitle>
            <CardDescription>Trong 2 tuần qua, bạn có thường xuyên gặp phải tình trạng này không?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswer(question.id, value)}>
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAssessment} className="flex-1 bg-transparent">
            Hủy bỏ
          </Button>
          <Button onClick={handleNext} disabled={!currentAnswer} className="flex-1">
            {currentQuestion === selectedAssessment.questions.length - 1 ? "Hoàn thành" : "Tiếp theo"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-4">
        <h2 className="text-xl font-bold mb-2">Sàng lọc Tâm lý</h2>
        <p className="text-muted-foreground text-sm">Đánh giá sức khỏe tâm thần với các bài test chuẩn quốc tế</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Các bài test này chỉ mang tính chất sàng lọc ban đầu, không thay thế cho chẩn đoán y khoa chuyên nghiệp.
        </AlertDescription>
      </Alert>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Hỗ trợ tâm lý AI</h3>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            Trước khi làm bài test, bạn có thể tâm sự với AI để được hỗ trợ và tư vấn ban đầu.
          </p>
          <Button
            onClick={() => setShowAiSupport(!showAiSupport)}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {showAiSupport ? "Ẩn" : "Bắt đầu"} tâm sự
          </Button>

          {showAiSupport && (
            <div className="mt-4">
              <AiChatBox
                placeholder="Chia sẻ cảm xúc của bạn..."
                initialMessage="Xin chào! Tôi là trợ lý AI hỗ trợ tâm lý. Tôi ở đây để lắng nghe và hỗ trợ bạn. Bạn có muốn chia sẻ về tâm trạng hoặc những gì đang khiến bạn lo lắng không?"
                context="psychological support"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {assessments.map((assessment) => (
          <Card
            key={assessment.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleStartAssessment(assessment)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{assessment.title}</CardTitle>
                  <CardDescription className="mt-1">{assessment.description}</CardDescription>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Lưu ý quan trọng:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Trả lời thật lòng để có kết quả chính xác nhất</li>
            <li>• Mỗi bài test mất khoảng 3-5 phút</li>
            <li>• Thông tin của bạn được bảo mật tuyệt đối</li>
            <li>• Nếu có kết quả bất thường, hãy tham khảo chuyên gia</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
