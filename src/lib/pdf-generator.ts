import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export interface CertificatePDFData {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  certificateId: string;
  verifyUrl?: string;
}

export async function generateCertificatePDF(data: CertificatePDFData): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const centerX = pageWidth / 2;

  // Background clean paper white
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Premium Double Border Frame
  // Outer navy frame
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Gold middle thin line
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.85);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Slate inner line
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.25);
  doc.rect(14.5, 14.5, pageWidth - 29, pageHeight - 29);

  // Golden Corner Accent brackets
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1.2);
  const offset = 18;
  const length = 12;
  // Top-left
  doc.line(offset, offset, offset + length, offset);
  doc.line(offset, offset, offset, offset + length);
  // Top-right
  doc.line(pageWidth - offset, offset, pageWidth - offset - length, offset);
  doc.line(pageWidth - offset, offset, pageWidth - offset, offset + length);
  // Bottom-left
  doc.line(offset, pageHeight - offset, offset + length, pageHeight - offset);
  doc.line(offset, pageHeight - offset, offset, pageHeight - offset - length);
  // Bottom-right
  doc.line(pageWidth - offset, pageHeight - offset, pageWidth - offset - length, pageHeight - offset);
  doc.line(pageWidth - offset, pageHeight - offset, pageWidth - offset, pageHeight - offset - length);

  // Gold Seal / Crest at Top Center
  const sealY = 38;
  // Outer seal ring
  doc.setDrawColor(212, 175, 55);
  doc.setFillColor(255, 255, 255);
  doc.setLineWidth(1.5);
  doc.circle(centerX, sealY, 13, "FD");

  // Inner seal ring
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.circle(centerX, sealY, 11, "D");

  // Monogram S inside seal
  doc.setFont("times", "bolditalic");
  doc.setFontSize(16);
  doc.setTextColor(212, 175, 55);
  doc.text("S", centerX, sealY + 2.2, { align: "center" });

  // Brand Name - Letter Spaced
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("S K I L L O R A   A C A D E M Y", centerX, 59, { align: "center" });

  // Main Title
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42);
  doc.text("CERTIFICATE OF COMPLETION", centerX, 72, { align: "center" });

  // Subtitle
  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.setTextColor(100, 116, 139);
  doc.text("This credential is proudly presented to", centerX, 83, { align: "center" });

  // Student Name
  doc.setFont("times", "bolditalic");
  doc.setFontSize(30);
  doc.setTextColor(15, 23, 42);
  doc.text(data.studentName, centerX, 99, { align: "center" });

  // Elegant line below student name
  const nameWidth = doc.getTextWidth(data.studentName);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.8);
  doc.line(centerX - nameWidth / 2 - 15, 103, centerX + nameWidth / 2 + 15, 103);

  // Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text("for successfully fulfilling the requirements and mastering the curriculum of", centerX, 112, { align: "center" });

  // Course Title
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  const courseTitleLines = doc.splitTextToSize(data.courseTitle, 190);
  doc.text(courseTitleLines, centerX, 123, { align: "center" });

  // Instructor Info positioning based on lines count
  const titleHeight = courseTitleLines.length * 7.5;
  const instructorY = 123 + titleHeight;

  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text(`instructed by ${data.instructorName}`, centerX, instructorY, { align: "center" });

  // Left column - Date of Issue
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(40, 168, 95, 168);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("DATE OF ISSUE", 67.5, 175, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(data.issueDate, 67.5, 164, { align: "center" });

  // Right column - Authorized Signature
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(202, 168, 257, 168);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("AUTHORIZED SIGNATURE", 229.5, 175, { align: "center" });

  doc.setFont("times", "bolditalic");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("Skillora Academy", 229.5, 163, { align: "center" });

  // Center QR code verification layout
  const qrSize = 20;
  const qrX = centerX - qrSize / 2;
  const qrY = 153;

  if (data.verifyUrl) {
    try {
      const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, {
        width: 80,
        margin: 1,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });
      doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(148, 163, 184);
      doc.text("SCAN TO VERIFY", centerX, qrY + qrSize + 4, { align: "center" });
    } catch {
      // Fallback silently
    }
  }

  // Certificate ID at the bottom
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Credential ID: ${data.certificateId}`, centerX, 191, { align: "center" });

  return doc;
}

export function generateNotesPDF(notes: { title: string; content: string }[]): jsPDF {
  const doc = new jsPDF();
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("My Lesson Notes", 20, 20);
  
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 28);
  
  doc.line(20, 32, 190, 32);

  let currentY = 42;

  notes.forEach((note, index) => {
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(`${index + 1}. ${note.title}`, 20, currentY);
    currentY += 8;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    const splitText = doc.splitTextToSize(note.content.replace(/<[^>]*>/g, ""), 170);
    splitText.forEach((line: string) => {
      if (currentY > 275) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(line, 20, currentY);
      currentY += 5;
    });

    currentY += 10;
  });

  return doc;
}
