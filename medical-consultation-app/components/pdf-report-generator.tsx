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

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }))
  }

  // const generatePDF = async () => {
  //   console.log('generatePDF function called')
  //   setIsGenerating(true)
  //   try {
  //     console.log('Starting PDF generation...')
  //     const pdf = new jsPDF('p', 'mm', 'a4')
  //     const pageWidth = pdf.internal.pageSize.getWidth()
  //     const pageHeight = pdf.internal.pageSize.getHeight()
  //     const margin = 20
  //     let yPosition = margin

  //     // Helper function to safely add text with Unicode support
  //     const addText = (text: string, x: number, y: number, options?: any) => {
  //       try {
  //         // Try to add text with Unicode support first
  //         pdf.text(text, x, y, options)
  //       }

      // Helper functions để set font an toàn
      const setFontSafe = (style: 'normal' | 'bold' = 'normal') => {
        if (useCustomFont) {
          pdf.setFont('Roboto', style);
        } else {
          pdf.setFont('helvetica', style);
        }
      };
  //         console.warn('Unicode text failed, falling back to Latin conversion:', err)
  //         // Fallback: Convert Vietnamese characters to basic Latin
  //         const safeText = text
  //           .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
  //           .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
  //           .replace(/[ìíịỉĩ]/g, 'i')
  //           .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
  //           .replace(/[ùúụủũưừứựửữ]/g, 'u')
  //           .replace(/[ỳýỵỷỹ]/g, 'y')
  //           .replace(/[đ]/g, 'd')
  //           .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
  //           .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
  //           .replace(/[ÌÍỊỈĨ]/g, 'I')
  //           .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
  //           .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
  //           .replace(/[ỲÝỴỶỸ]/g, 'Y')
  //           .replace(/[Đ]/g, 'D')
  //         try {
  //           pdf.text(safeText, x, y, options)
  //         } catch (fallbackErr) {
  //           console.warn('Fallback also failed, using ASCII only:', fallbackErr)
  //           pdf.text(text.replace(/[^\x00-\x7F]/g, '?'), x, y, options)
  //         }
  //       }
  //     }

  //     // Header
  //     pdf.setFontSize(20)
  //     pdf.setFont('helvetica', 'bold')
  //     addText('BAO CAO DANH GIA TAM LY', pageWidth / 2, yPosition, { align: 'center' })
  //     yPosition += 15

  //     pdf.setFontSize(16)
  //     addText(assessment.title, pageWidth / 2, yPosition, { align: 'center' })
  //     yPosition += 20

  //     // User Information
  //     pdf.setFontSize(14)
  //     pdf.setFont('helvetica', 'bold')
  //     addText('THONG TIN NGUOI THUC HIEN', margin, yPosition)
  //     yPosition += 10

  //     pdf.setFontSize(12)
  //     pdf.setFont('helvetica', 'normal')
  //     const userInfoLines = [
  //       `Ho va ten: ${userInfo.fullName || 'Khong cung cap'}`,
  //       `Tuoi: ${userInfo.age || 'Khong cung cap'}`,
  //       `Gioi tinh: ${userInfo.gender || 'Khong cung cap'}`,
  //       `Nghe nghiep: ${userInfo.occupation || 'Khong cung cap'}`,
  //       `Thong tin lien he: ${userInfo.contactInfo || 'Khong cung cap'}`,
  //       `Ngay thuc hien: ${new Date().toLocaleDateString('vi-VN')}`
  //     ]

  //     userInfoLines.forEach(line => {
  //       addText(line, margin, yPosition)
  //       yPosition += 7
  //     })
  //     yPosition += 10

  //     // Assessment Description
  //     pdf.setFontSize(14)
  //     pdf.setFont('helvetica', 'bold')
  //     addText('MO TA BAI DANH GIA', margin, yPosition)
  //     yPosition += 10

  //     pdf.setFontSize(12)
  //     pdf.setFont('helvetica', 'normal')
  //     const descriptionLines = pdf.splitTextToSize(assessment.description, pageWidth - 2 * margin)
  //     descriptionLines.forEach((line: string) => {
  //       addText(line, margin, yPosition)
  //       yPosition += 7
  //     })
  //     yPosition += 10

  //     // Results
  //     pdf.setFontSize(14)
  //     pdf.setFont('helvetica', 'bold')
  //     addText('KET QUA DANH GIA', margin, yPosition)
  //     yPosition += 10

  //     pdf.setFontSize(12)
  //     pdf.setFont('helvetica', 'normal')
  //     addText(`Tong diem: ${score}`, margin, yPosition)
  //     yPosition += 7
  //     addText(`Muc do: ${interpretation.level}`, margin, yPosition)
  //     yPosition += 7
  //     addText(`Dien giai: ${interpretation.description}`, margin, yPosition)
  //     yPosition += 15

  //     // Recommendations
  //     pdf.setFontSize(14)
  //     pdf.setFont('helvetica', 'bold')
  //     addText('KHUYEN NGHI', margin, yPosition)
  //     yPosition += 10

  //     pdf.setFontSize(12)
  //     pdf.setFont('helvetica', 'normal')
  //     interpretation.recommendations.forEach((rec, index) => {
  //       const recLines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 2 * margin - 10)
  //       recLines.forEach((line: string) => {
  //         if (yPosition > pageHeight - margin) {
  //           pdf.addPage()
  //           yPosition = margin
  //         }
  //         addText(line, margin + 5, yPosition)
  //         yPosition += 7
  //       })
  //       yPosition += 3
  //     })

  //     // Additional Notes
  //     if (userInfo.additionalNotes) {
  //       yPosition += 10
  //       pdf.setFontSize(14)
  //       pdf.setFont('helvetica', 'bold')
  //       addText('GHI CHU THEM', margin, yPosition)
  //       yPosition += 10

  //       pdf.setFontSize(12)
  //       pdf.setFont('helvetica', 'normal')
  //       const notesLines = pdf.splitTextToSize(userInfo.additionalNotes, pageWidth - 2 * margin)
  //       notesLines.forEach((line: string) => {
  //         if (yPosition > pageHeight - margin) {
  //           pdf.addPage()
  //           yPosition = margin
  //         }
  //         addText(line, margin, yPosition)
  //         yPosition += 7
  //       })
  //     }

  //     // Footer
  //     const footerY = pageHeight - 15
  //     pdf.setFontSize(10)
  //     pdf.setFont('helvetica', 'italic')
  //     addText('Bao cao nay chi mang tinh chat tham khao. Vui long tham khao y kien chuyen gia de co danh gia chinh xac.', 
  //       pageWidth / 2, footerY, { align: 'center' })

  //     // Save PDF
  //     const fileName = `${assessment.id}_report_${new Date().toISOString().split('T')[0]}.pdf`
  //     console.log('Saving PDF with filename:', fileName)
  //     pdf.save(fileName)
  //     console.log('PDF saved successfully')

  //     alert('Tạo báo cáo PDF thành công!')

  //   } catch (error) {
  //     console.error('Error generating PDF:', error)
  //     console.error('Error details:', {
  //       message: error instanceof Error ? error.message : 'Unknown error',
  //       stack: error instanceof Error ? error.stack : 'No stack trace',
  //       type: typeof error
  //     })
  //     alert(`Có lỗi xảy ra khi tạo báo cáo PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  //   } finally {
  //     console.log('PDF generation process completed, setting isGenerating to false')
  //     setIsGenerating(false)
  //   }
  // }

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;
      const lineHeight = 7; // Define a standard line height

      // --- PHẦN 1: Thiết lập Font (Sử dụng font mặc định) ---
      let useCustomFont = false;
      try {
        // Thử tải font tiếng Việt từ thư mục /public
        const fontRegularResponse = await fetch('/fonts/Roboto-Regular.ttf');
        const fontBoldResponse = await fetch('/fonts/Roboto-Bold.ttf');
        
        if (fontRegularResponse.ok && fontBoldResponse.ok) {
          // Load Roboto Regular
          const fontRegularBuffer = await fontRegularResponse.arrayBuffer();
          const fontRegularBase64 = btoa(
            new Uint8Array(fontRegularBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          
          // Load Roboto Bold
          const fontBoldBuffer = await fontBoldResponse.arrayBuffer();
          const fontBoldBase64 = btoa(
            new Uint8Array(fontBoldBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          
          // Thêm font vào jsPDF
          pdf.addFileToVFS('Roboto-Regular.ttf', fontRegularBase64);
          pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
          
          pdf.addFileToVFS('Roboto-Bold.ttf', fontBoldBase64);
          pdf.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
          
          useCustomFont = true;
        }
      } catch (error) {
        console.log('Không thể tải font tùy chỉnh, sử dụng font mặc định:', error);
        // Sử dụng font mặc định của jsPDF
        pdf.setFont('helvetica');
      }

      // Helper function để set font an toàn
      const setFontSafe = (style: 'normal' | 'bold' = 'normal') => {
        if (useCustomFont) {
          pdf.setFont('Roboto', style);
        } else {
          pdf.setFont('helvetica', style);
        }
      };

      // Header
      pdf.setFontSize(18);
      setFontSafe('bold');
      pdf.text('BÁO CÁO ĐÁNH GIÁ TÂM LÝ', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(14);
      setFontSafe('normal');
      pdf.text(assessment.title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // User Information với khung viền
      pdf.setFontSize(12);
      setFontSafe('bold');
      pdf.text('THÔNG TIN NGƯỜI THỰC HIỆN', margin, yPosition);
      yPosition += 10;
      
      const testTime = new Date();
      const userInfoLines = [
        `Họ và tên: ${userInfo.fullName || 'Không cung cấp'}`,
        `Tuổi: ${userInfo.age || 'Không cung cấp'}`,
        `Giới tính: ${userInfo.gender || 'Không cung cấp'}`,
        `Nghề nghiệp: ${userInfo.occupation || 'Không cung cấp'}`,
        `Thông tin liên hệ: ${userInfo.contactInfo || 'Không cung cấp'}`,
        `Ngày thực hiện: ${testTime.toLocaleDateString('vi-VN')}`,
        `Thời gian test: ${testTime.toLocaleTimeString('vi-VN')}`
      ];
      
      // Tính chiều cao khung thông tin người dùng
      const userInfoHeight = userInfoLines.length * lineHeight + 10;
      
      // Vẽ khung viền cho thông tin người dùng
      pdf.setDrawColor(0, 0, 0); // Màu đen cho viền
      pdf.setLineWidth(0.5);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), userInfoHeight);
      
      pdf.setFontSize(10);
      setFontSafe('normal');
      userInfoLines.forEach(line => {
        pdf.text(line, margin + 5, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 15;

      // --- PHẦN 2: KẾT QUẢ ĐÁNH GIÁ ---
      pdf.setFontSize(12);
      setFontSafe('bold');
      pdf.text('KẾT QUẢ ĐÁNH GIÁ', margin, yPosition);
      yPosition += 10;
      
      const interpretationLines = pdf.splitTextToSize(`Diễn giải: ${interpretation.description}`, pageWidth - (margin*2) - 10);
      const resultHeight = (2 + interpretationLines.length) * lineHeight + 15;
      
      // Vẽ khung viền cho kết quả
      pdf.setFillColor(252, 252, 252); // Màu nền rất nhạt
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), resultHeight, 'F');
      pdf.setDrawColor(150, 150, 150);
      pdf.setLineWidth(0.4);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), resultHeight);
      
      pdf.setFontSize(10);
      setFontSafe('normal');
      pdf.text(`Tổng điểm: ${score}`, margin + 5, yPosition);
      yPosition += lineHeight;
      pdf.text(`Mức độ: ${interpretation.level}`, margin + 5, yPosition);
      yPosition += lineHeight;
      pdf.text(interpretationLines, margin + 5, yPosition);
      yPosition += (interpretationLines.length * lineHeight) + 15;

      // --- PHẦN 3: KHUYẾN NGHỊ ---
      pdf.setFontSize(12);
      setFontSafe('bold');
      pdf.text('KHUYẾN NGHỊ', margin, yPosition);
      yPosition += 10;

      // Tính chiều cao tổng của khuyến nghị
      let totalRecHeight = 0;
      const allRecLines: string[][] = [];
      interpretation.recommendations.forEach((rec, index) => {
        const recLines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 2 * margin - 20);
        allRecLines.push(recLines);
        totalRecHeight += recLines.length * lineHeight + 5;
      });
      totalRecHeight += 10; // Padding
      
      // Kiểm tra có cần sang trang mới không
      if (yPosition + totalRecHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      // Vẽ khung viền cho khuyến nghị
      pdf.setFillColor(248, 252, 255); // Màu xanh rất nhạt
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), totalRecHeight, 'F');
      pdf.setDrawColor(100, 150, 200);
      pdf.setLineWidth(0.4);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), totalRecHeight);
      
      pdf.setFontSize(10);
      setFontSafe('normal');
      allRecLines.forEach((recLines, index) => {
        pdf.text(recLines, margin + 5, yPosition);
        yPosition += recLines.length * lineHeight + 5;
      });
      yPosition += 15;

      // --- PHẦN 4: CHI TIẾT CÂU TRẢ LỜI ---
      // Kiểm tra trang trước khi thêm phần mới
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
        const selectedOption = question.options.find(opt => opt.value === answerValue);

        const questionText = `${index + 1}. ${question.text}`;
        const questionLines = pdf.splitTextToSize(questionText, pageWidth - (margin * 2) - 10);
        
        // Tính toán chiều cao table (header + 1 row + padding)
        const tableHeight = 25; // Header (10) + Row (10) + Padding (5)
        const totalHeight = questionLines.length * lineHeight + tableHeight + 15;
        
        // Kiểm tra xem có cần sang trang mới không
        if (yPosition + totalHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        // In câu hỏi
        pdf.setFontSize(10);
        setFontSafe('bold');
        pdf.text(questionLines, margin, yPosition);
        yPosition += questionLines.length * lineHeight + 5;

        // Tạo table với các cột cho từng option
        const tableStartX = margin;
        const tableStartY = yPosition;
        const tableWidth = pageWidth - (margin * 2);
        const colWidth = tableWidth / question.options.length;
        const rowHeight = 10;
        const headerHeight = 10;

        // Vẽ header table
        pdf.setFillColor(240, 240, 240);
        pdf.rect(tableStartX, tableStartY, tableWidth, headerHeight, 'F');
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);
        pdf.rect(tableStartX, tableStartY, tableWidth, headerHeight);

        // Vẽ các cột header
        question.options.forEach((option, optIndex) => {
          const colX = tableStartX + (optIndex * colWidth);
          if (optIndex > 0) {
            pdf.line(colX, tableStartY, colX, tableStartY + headerHeight + rowHeight);
          }
          
          // Text header
          pdf.setFontSize(8);
          setFontSafe('bold');
          const headerText = pdf.splitTextToSize(option.label, colWidth - 4);
          const textY = tableStartY + 6;
          pdf.text(headerText, colX + 2, textY);
        });

        // Vẽ row cho checkbox
        const rowY = tableStartY + headerHeight;
        pdf.setFillColor(255, 255, 255);
        pdf.rect(tableStartX, rowY, tableWidth, rowHeight, 'F');
        pdf.rect(tableStartX, rowY, tableWidth, rowHeight);

        // Vẽ checkbox và đánh dấu câu trả lời đã chọn
        question.options.forEach((option, optIndex) => {
          const colX = tableStartX + (optIndex * colWidth);
          const checkboxSize = 4;
          const checkboxX = colX + (colWidth / 2) - (checkboxSize / 2);
          const checkboxY = rowY + (rowHeight / 2) - (checkboxSize / 2);
          
          // Vẽ checkbox
          pdf.setFillColor(255, 255, 255);
          pdf.rect(checkboxX, checkboxY, checkboxSize, checkboxSize, 'FD');
          
          // Đánh dấu X nếu là câu trả lời đã chọn
          if (option.value === answerValue) {
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.8);
            pdf.line(checkboxX, checkboxY, checkboxX + checkboxSize, checkboxY + checkboxSize);
            pdf.line(checkboxX + checkboxSize, checkboxY, checkboxX, checkboxY + checkboxSize);
          }
        });

        yPosition += headerHeight + rowHeight + 10;
      });


      // Footer
      const footerY = pageHeight - 15;
      pdf.setFontSize(8);
      setFontSafe('normal');
      pdf.text('Báo cáo này chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến chuyên gia để có đánh giá chính xác.', 
        pageWidth / 2, footerY, { align: 'center' });

      // Save PDF
      const fileName = `${assessment.id}_report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      alert('Tạo báo cáo PDF thành công!');

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Có lỗi xảy ra khi tạo báo cáo PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
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
              onClick={() => {
                console.log('PDF button clicked')
                generatePDF()
              }}
              disabled={isGenerating}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Đang tạo PDF...' : 'Tải xuống báo cáo PDF'}
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
    </div>
  )
}