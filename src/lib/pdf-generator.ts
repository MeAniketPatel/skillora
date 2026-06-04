import { jsPDF } from "jspdf";

export interface CertificatePDFData {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  certificateId: string;
}

export function generateCertificatePDF(data: CertificatePDFData): jsPDF {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Background and borders
  doc.setFillColor(250, 250, 250);
  doc.rect(0, 0, 297, 210, "F");

  // Premium double border
  doc.setDrawColor(38, 38, 38);
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);
  
  doc.setDrawColor(212, 175, 55); // Gold accent border
  doc.setLineWidth(1);
  doc.rect(13, 13, 271, 184);

  // Content
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(38, 38, 38);
  doc.text("CERTIFICATE OF COMPLETION", 148.5, 50, { align: "center" });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(115, 115, 115);
  doc.text("This is proudly presented to", 148.5, 75, { align: "center" });

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(30, 41, 59); // dark primary color
  doc.text(data.studentName, 148.5, 95, { align: "center" });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(115, 115, 115);
  doc.text("for successfully completing the course", 148.5, 115, { align: "center" });

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(38, 38, 38);
  doc.text(data.courseTitle, 148.5, 130, { align: "center" });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(115, 115, 115);
  doc.text(`Taught by: ${data.instructorName}`, 148.5, 145, { align: "center" });

  // Footer / signatures block
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(40, 175, 110, 175);
  doc.line(187, 175, 257, 175);

  doc.setFontSize(10);
  doc.text("Date of Issue", 75, 182, { align: "center" });
  doc.text(data.issueDate, 75, 170, { align: "center" });

  doc.text("Authorized Signature", 222, 182, { align: "center" });
  doc.text("SKILLORA ACADEMY", 222, 170, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(163, 163, 163);
  doc.text(`Certificate ID: ${data.certificateId}`, 148.5, 195, { align: "center" });

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
