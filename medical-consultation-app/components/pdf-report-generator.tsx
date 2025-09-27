"use client"

import { useState } from "react"
import jsPDF from "jspdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, FileText, User } from "lucide-react"

interface Assessment {
  id: string
  title: string
  description: string
  questions: { id: string; text: string; options: { value: string; label: string; score: number }[] }[]
  interpretation: { min: number; max: number; level: string; description: string; recommendations: string[] }[]
}

interface UserInfo {
  fullName: string
  age: string
  gender: string
  occupation: string
  contactInfo: string
  additionalNotes: string
}

interface PDFReportGeneratorProps {
  assessment: Assessment
  answers: Record<string, string>
  score: number
  interpretation: { level: string; description: string; recommendations: string[] }
  onClose: () => void
}

export function PDFReportGenerator({
  assessment,
  answers,
  score,
  interpretation,
  onClose
}: PDFReportGeneratorProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: "",
    age: "",
    gender: "",
    occupation: "",
    contactInfo: "",
    additionalNotes: ""
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }))
  }

  const generatePDFPreview = async () => {
    setIsGenerating(true)
    try {
      const pdfDoc = await createPDFDocument()
      const blob = pdfDoc.output('blob')
      setPdfBlob(blob)
      setShowPreview(true)
    } catch (error) {
      console.error('Error generating PDF preview:', error)
      alert(`Có lỗi xảy ra khi tạo preview PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDF = () => {
    if (pdfBlob) {
      const fileName = `${assessment.id}_report_${new Date().toISOString().split('T')[0]}.pdf`
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      alert('Tải xuống báo cáo PDF thành công!')
    }
  }

  const createPDFDocument = async () => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;
    const lineHeight = 7;
    let useCustomFont = false;

    // --- Font Setup ---
    try {
      const fontRegularResponse = await fetch('/fonts/Roboto-Regular.ttf');
      const fontBoldResponse = await fetch('/fonts/Roboto-Bold.ttf');
      
      if (fontRegularResponse.ok && fontBoldResponse.ok) {
        const fontRegularBuffer = await fontRegularResponse.arrayBuffer();
        const fontRegularBase64 = btoa(new Uint8Array(fontRegularBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        
        const fontBoldBuffer = await fontBoldResponse.arrayBuffer();
        const fontBoldBase64 = btoa(new Uint8Array(fontBoldBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        
        pdf.addFileToVFS('Roboto-Regular.ttf', fontRegularBase64);
        pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        
        pdf.addFileToVFS('Roboto-Bold.ttf', fontBoldBase64);
        pdf.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
        
        useCustomFont = true;
      }
    } catch (error) {
      console.log('Cannot load custom font, using default:', error);
      pdf.setFont('helvetica');
    }

    const setFontSafe = (style: 'normal' | 'bold' = 'normal') => {
      if (useCustomFont) {
        pdf.setFont('Roboto', style);
      } else {
        pdf.setFont('helvetica', style);
      }
    };
    
    // Add organization logo
    const logoPath = '/medical-logo.png';
    try {
      const logoResponse = await fetch(logoPath);
      const logoBlob = await logoResponse.blob();
      const reader = new FileReader();
      reader.readAsDataURL(logoBlob);
      await new Promise(resolve => reader.onloadend = resolve);
      pdf.addImage(reader.result as string, 'PNG', margin - 20, margin - 20, 60, 60);
    } catch (error) {
      console.warn('Could not load logo:', error);
    }
    
    // Header
    pdf.setFontSize(14);
    setFontSafe('bold');
    pdf.text('TƯ VẤN Y TẾ AI', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    pdf.setFontSize(24);
    setFontSafe('bold');
    pdf.text('BÁO CÁO ĐÁNH GIÁ TÂM LÝ', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    pdf.setFontSize(14);
    setFontSafe('normal');
    pdf.text(assessment.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // User Information with border
    pdf.setFontSize(12);
    setFontSafe('bold');
    pdf.text('THÔNG TIN NGƯỜI THỰC HIỆN', margin, yPosition);
    yPosition += 10;
    
    const testTime = new Date();
    const userInfoLines = [
      `Họ và tên: ${userInfo.fullName || '................................................................'}`,
      `Tuổi: ${userInfo.age || '................................................................'}`,
      `Giới tính: ${userInfo.gender || '................................................................'}`,
      `Nghề nghiệp: ${userInfo.occupation || '................................................................'}`,
      `Thông tin liên hệ: ${userInfo.contactInfo || '................................................................'}`,
      `Ngày thực hiện: ${testTime.toLocaleDateString('vi-VN')}`,
      `Thời gian test: ${testTime.toLocaleTimeString('vi-VN')}`
    ];
    
    const userInfoHeight = userInfoLines.length * lineHeight + 10;
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), userInfoHeight);
    
    pdf.setFontSize(10);
    setFontSafe('normal');
    userInfoLines.forEach(line => {
      pdf.text(line, margin + 5, yPosition);
      yPosition += lineHeight;
    });
    yPosition += 15;

    // Results with border and color coding
    pdf.setFontSize(12);
    setFontSafe('bold');
    pdf.text('KẾT QUẢ ĐÁNH GIÁ', margin, yPosition);
    yPosition += 10;
    
    const interpretationLines = pdf.splitTextToSize(`Diễn giải: ${interpretation.description}`, pageWidth - (margin*2) - 20);
    const resultHeight = (2 + interpretationLines.length) * lineHeight + 15;
    
    pdf.setFillColor(252, 252, 252);
    pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), resultHeight, 'F');
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.4);
    pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), resultHeight);
    
    pdf.setFontSize(12);
    setFontSafe('normal');
    pdf.text(`Tổng điểm: ${score}`, margin + 5, yPosition);
    yPosition += lineHeight;
    
    const isNegativeResult = interpretation.level.toLowerCase().includes('nặng') || 
                            interpretation.level.toLowerCase().includes('nghiêm trọng') ||
                            interpretation.level.toLowerCase().includes('cao');
    if (isNegativeResult) {
      pdf.setTextColor(220, 20, 20);
    } else {
      pdf.setTextColor(20, 160, 20);
    }
    pdf.text(`Mức độ: ${interpretation.level}`, margin + 5, yPosition);
    pdf.setTextColor(0, 0, 0);
    
    yPosition += lineHeight;
    pdf.text(interpretationLines, margin + 5, yPosition);
    yPosition += (interpretationLines.length * lineHeight) + 15;

    // Recommendations with border
    pdf.setFontSize(12);
    setFontSafe('bold');
    pdf.text('KHUYẾN NGHỊ', margin, yPosition);
    yPosition += 10;

    let totalRecHeight = 0;
    const allRecLines: string[][] = [];
    interpretation.recommendations.forEach((rec, index) => {
      const recLines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 2 * margin - 30);
      allRecLines.push(recLines);
      totalRecHeight += recLines.length * lineHeight + 5;
    });
    totalRecHeight += 10;
    
    if (yPosition + totalRecHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFillColor(248, 252, 255);
    pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), totalRecHeight, 'F');
    pdf.setDrawColor(100, 150, 200);
    pdf.setLineWidth(0.4);
    pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), totalRecHeight);
    
    pdf.setFontSize(10);
    setFontSafe('normal');
    allRecLines.forEach((recLines) => {
      pdf.text(recLines, margin + 5, yPosition);
      yPosition += recLines.length * lineHeight + 5;
    });
    yPosition += 15;

    // Detailed Answers with table
    if (yPosition + 50 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(12);
    setFontSafe('bold');
    pdf.text('CHI TIẾT CÂU TRẢ LỜI', margin, yPosition);
    yPosition += 10;
    setFontSafe('normal');

    assessment.questions.forEach((question, index) => {
      const answerValue = answers[question.id];
      const questionText = `${index + 1}. ${question.text}`;
      const questionLines = pdf.splitTextToSize(questionText, pageWidth - (margin * 2) - 30);
      
      const tableHeight = 25;
      const totalHeight = questionLines.length * lineHeight + tableHeight + 15;
      
      if (yPosition + totalHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
      }

      pdf.setFontSize(10);
      setFontSafe('bold');
      pdf.text(questionLines, margin, yPosition);
      yPosition += questionLines.length * lineHeight + 5;

      const tableStartX = margin;
      const tableStartY = yPosition;
      const tableWidth = pageWidth - (margin * 2);
      const colWidth = tableWidth / question.options.length;
      const rowHeight = 10;
      const headerHeight = 10;

      pdf.setFillColor(240, 240, 240);
      pdf.rect(tableStartX, tableStartY, tableWidth, headerHeight, 'F');
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.rect(tableStartX, tableStartY, tableWidth, headerHeight);

      question.options.forEach((option, optIndex) => {
        const colX = tableStartX + (optIndex * colWidth);
        if (optIndex > 0) {
          pdf.line(colX, tableStartY, colX, tableStartY + headerHeight + rowHeight);
        }
        
        pdf.setFontSize(8);
        setFontSafe('bold');
        const maxWidth = colWidth - 6;
        const headerText = pdf.splitTextToSize(option.label, maxWidth);
        const textY = tableStartY + 6;
        const displayText = Array.isArray(headerText) ? headerText.slice(0, 1) : [headerText];
        pdf.text(displayText, colX + 3, textY);
      });

      const rowY = tableStartY + headerHeight;
      pdf.setFillColor(255, 255, 255);
      pdf.rect(tableStartX, rowY, tableWidth, rowHeight, 'F');
      pdf.rect(tableStartX, rowY, tableWidth, rowHeight);

      question.options.forEach((option, optIndex) => {
        const colX = tableStartX + (optIndex * colWidth);
        const checkboxSize = 4;
        const checkboxX = colX + (colWidth / 2) - (checkboxSize / 2);
        const checkboxY = rowY + (rowHeight / 2) - (checkboxSize / 2);
        
        pdf.setFillColor(255, 255, 255);
        pdf.rect(checkboxX, checkboxY, checkboxSize, checkboxSize, 'FD');
        
        if (option.value === answerValue) {
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.8);
          pdf.line(checkboxX, checkboxY, checkboxX + checkboxSize, checkboxY + checkboxSize);
          pdf.line(checkboxX + checkboxSize, checkboxY, checkboxX, checkboxY + checkboxSize);
        }
      });
      yPosition += headerHeight + rowHeight + 10;
    });

    // Additional Notes with border
    if (userInfo.additionalNotes) {
      if (yPosition + 50 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(12);
      setFontSafe('bold');
      pdf.text('GHI CHÚ THÊM', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      setFontSafe('normal');
      const notesLines = pdf.splitTextToSize(userInfo.additionalNotes, pageWidth - (margin * 2) - 20);
      
      const notesHeight = notesLines.length * lineHeight + 10;
      
      pdf.setFillColor(255, 252, 240);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), notesHeight, 'F');
      pdf.setDrawColor(200, 180, 100);
      pdf.setLineWidth(0.4);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), notesHeight);
      
      notesLines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin + 5, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 15;
    }

    // Footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    setFontSafe('normal');
    const footerText = 'Báo cáo này chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến chuyên gia để có đánh giá chính xác.';
    const footerLines = pdf.splitTextToSize(footerText, pageWidth - (margin * 2));
    
    footerLines.forEach((line: string, index: number) => {
      pdf.text(line, pageWidth / 2, footerY + (index * 5), { align: 'center' });
    });

    return pdf;
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
  };
  
  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const pdfDoc = await createPDFDocument()
      const fileName = `${assessment.id}_report_${new Date().toISOString().split('T')[0]}.pdf`
      pdfDoc.save(fileName)
      alert('Tạo báo cáo PDF thành công!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(`Có lỗi xảy ra khi tạo báo cáo PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // Preview PDF Modal Component
  const PDFPreviewModal = () => {
    if (!showPreview || !pdfBlob) return null

    const pdfUrl = URL.createObjectURL(pdfBlob)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 w-full h-full m-4 flex flex-col">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h3 className="text-lg font-semibold">Xem trước báo cáo PDF</h3>
            <Button
              variant="outline"
              onClick={() => {
                setShowPreview(false)
                URL.revokeObjectURL(pdfUrl)
              }}
            >
              Đóng
            </Button>
          </div>
          
          <div className="flex-1 mb-4">
            <iframe
              src={pdfUrl}
              className="w-full h-full border rounded"
              title="PDF Preview"
            />
          </div>
          
          <div className="flex gap-3 justify-end flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowPreview(false)
                URL.revokeObjectURL(pdfUrl)
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                downloadPDF()
                setShowPreview(false)
                URL.revokeObjectURL(pdfUrl)
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Tải xuống
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tạo Báo Cáo PDF
          </CardTitle>
          <CardDescription>
            Điền thông tin để tạo báo cáo chi tiết cho bài đánh giá {assessment.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Information Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4" />
              <h3 className="font-semibold">Thông tin cá nhân</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={userInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <Label htmlFor="age">Tuổi</Label>
                <Input
                  id="age"
                  value={userInfo.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Nhập tuổi"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="gender">Giới tính</Label>
                <Input
                  id="gender"
                  value={userInfo.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  placeholder="Nam/Nữ/Khác"
                />
              </div>
              <div>
                <Label htmlFor="occupation">Nghề nghiệp</Label>
                <Input
                  id="occupation"
                  value={userInfo.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  placeholder="Nhập nghề nghiệp"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="contactInfo">Thông tin liên hệ</Label>
              <Input
                id="contactInfo"
                value={userInfo.contactInfo}
                onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                placeholder="Email hoặc số điện thoại"
              />
            </div>
            
            <div>
              <Label htmlFor="additionalNotes">Ghi chú thêm</Label>
              <Textarea
                id="additionalNotes"
                value={userInfo.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Thông tin bổ sung, triệu chứng đặc biệt, hoàn cảnh..."
                rows={3}
              />
            </div>
          </div>

          {/* Preview Results */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Xem trước kết quả</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Bài đánh giá:</strong> {assessment.title}</p>
              <p><strong>Tổng điểm:</strong> {score}</p>
              <p><strong>Mức độ:</strong> {interpretation.level}</p>
              <p><strong>Diễn giải:</strong> {interpretation.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={generatePDFPreview}
              disabled={isGenerating}
              variant="outline"
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isGenerating ? 'Đang tạo preview...' : 'Xem trước PDF'}
            </Button>
            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Đang tạo PDF...' : 'Tải xuống PDF'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              Hủy
            </Button>
          </div>
        </CardContent>
      </Card>
      <PDFPreviewModal />
    </div>
  )
}