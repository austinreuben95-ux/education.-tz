import jsPDF from 'jspdf';

export function exportNectaGradingPdf() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~297mm
  let y = 12;

  // Header Banner Background
  doc.setFillColor(15, 23, 42); // dark slate #0f172a
  doc.rect(10, y, pageWidth - 20, 26, 'F');

  // Decorative border line
  doc.setFillColor(245, 158, 11); // amber-500
  doc.rect(10, y + 24, pageWidth - 20, 2, 'F');

  // Title Text
  doc.setTextColor(251, 191, 36); // amber-400
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EDUCATION-TZ : OFFICIAL NECTA GRADING STANDARDS', 15, y + 10);

  doc.setTextColor(226, 232, 240); // slate-200
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Complete Student Reference Guide: Primary (PSLE), O-Level (CSEE), and A-Level (ACSEE) Grade Ranges (A - F)', 15, y + 17);

  y += 32;

  // Helper for Section Headers
  const drawSectionHeader = (title: string, r: number, g: number, b: number) => {
    // Check page overflow
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 15;
    }
    doc.setFillColor(r, g, b);
    doc.rect(10, y, pageWidth - 20, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 13, y + 5);
    y += 10;
  };

  // ==========================================
  // SECTION 1: PRIMARY SCHOOL (PSLE - Standard 7)
  // ==========================================
  drawSectionHeader('1. PRIMARY SCHOOL LEAVING EXAMINATION (PSLE) - STANDARD 7', 16, 185, 129);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('A. Subject Grade Boundaries (Out of 50 Marks per Subject):', 12, y);
  y += 4;

  // PSLE Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Grade', 13, y + 4);
  doc.text('Score (50 Max)', 32, y + 4);
  doc.text('Percentage', 62, y + 4);
  doc.text('Points', 92, y + 4);
  doc.text('English Remark', 115, y + 4);
  doc.text('Maelezo (Kiswahili)', 160, y + 4);
  y += 6;

  const psleRows = [
    { g: 'Grade A', m: '41 - 50 Marks', p: '80% - 100%', pt: '5 Points', e: 'Excellent', sw: 'Vyema Sana (Ufaulu wa Juu)' },
    { g: 'Grade B', m: '31 - 40 Marks', p: '60% - 79%', pt: '4 Points', e: 'Very Good', sw: 'Vyema (Ufaulu Mzuri)' },
    { g: 'Grade C', m: '21 - 30 Marks', p: '40% - 59%', pt: '3 Points', e: 'Good Pass (Cut-off)', sw: 'Wastani (Ufaulu wa Chini)' },
    { g: 'Grade D', m: '11 - 20 Marks', p: '20% - 39%', pt: '2 Points', e: 'Weak Pass', sw: 'Dhaifu (Ufaulu Dhaifu)' },
    { g: 'Grade E / F', m: '0 - 10 Marks', p: '0% - 19%', pt: '1 Point', e: 'Fail', sw: 'Vibaya (Amefeli)' },
  ];

  psleRows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(10, y - 1, pageWidth - 20, 5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row.g, 13, y + 3);
    doc.text(row.m, 32, y + 3);
    doc.text(row.p, 62, y + 3);
    doc.text(row.pt, 92, y + 3);
    doc.text(row.e, 115, y + 3);
    doc.text(row.sw, 160, y + 3);
    y += 4.8;
  });

  y += 3;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('B. PSLE Overall Certificate & TAMISEMI Form 1 Selection Thresholds (Out of 300 Marks):', 12, y);
  y += 4;

  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.text('Overall Grade', 13, y + 4);
  doc.text('Marks Range (300 Max)', 42, y + 4);
  doc.text('TAMISEMI Form 1 Placement Status (Maelezo ya Uteuzi)', 95, y + 4);
  y += 6;

  const psleOverall = [
    { g: 'Grade A', m: '240 - 300 Marks', s: 'Direct Selection to National Special / Top Secondary Schools (Uchaguzi wa Kitaifa)' },
    { g: 'Grade B', m: '180 - 239 Marks', s: 'Selected to Regional Boarding & Council Secondary Schools (Uchaguzi wa Mkoa)' },
    { g: 'Grade C', m: '120 - 179 Marks', s: 'Minimum Pass Benchmark - Selected to Ward Day Secondary Schools (Sekondari za Kata)' },
    { g: 'Grade D / E', m: '0 - 119 Marks', s: 'Failed - Ineligible for TAMISEMI Public Form 1 Placement (Hapangiwi Shule ya Serikali)' },
  ];

  psleOverall.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(10, y - 1, pageWidth - 20, 5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row.g, 13, y + 3);
    doc.text(row.m, 42, y + 3);
    doc.text(row.s, 95, y + 3);
    y += 4.8;
  });

  y += 7;

  // ==========================================
  // SECTION 2: O-LEVEL CSEE (Form 4)
  // ==========================================
  drawSectionHeader('2. O-LEVEL CSEE (FORM 4) - SUBJECT GRADES & DIVISION BOUNDARIES', 79, 70, 229);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('A. Individual Subject Grade Ranges & NECTA Point Allocation:', 12, y);
  y += 4;

  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Grade', 13, y + 4);
  doc.text('Percentage Range', 35, y + 4);
  doc.text('Point Value', 75, y + 4);
  doc.text('Performance Level & Official Remark', 110, y + 4);
  y += 6;

  const cseeRows = [
    { g: 'Grade A', p: '75% - 100%', pt: '1 Point', r: 'Distinction / Vyema Sana (Ufaulu wa Aina ya Kwanza)' },
    { g: 'Grade B', p: '65% - 74%', pt: '2 Points', r: 'Very Good / Credit (Vyema Mzuri Sana)' },
    { g: 'Grade C', p: '45% - 64%', pt: '3 Points', r: 'Good / Credit Pass (Wastani - Mzuri)' },
    { g: 'Grade D', p: '30% - 44%', pt: '4 Points', r: 'Basic Pass (Dhaifu - Ufaulu wa Kawaida)' },
    { g: 'Grade F', p: '0% - 29%', pt: '5 Points', r: 'Fail / Vibaya (Amefeli - Somo Halina Maksi)' },
  ];

  cseeRows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(10, y - 1, pageWidth - 20, 5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row.g, 13, y + 3);
    doc.text(row.p, 35, y + 3);
    doc.text(row.pt, 75, y + 3);
    doc.text(row.r, 110, y + 3);
    y += 4.8;
  });

  y += 3;

  doc.setFont('helvetica', 'bold');
  doc.text('B. Division Calculation Rules (Sum of Points from Best 7 Subjects):', 12, y);
  y += 4;

  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.text('Division', 13, y + 4);
  doc.text('Points Range', 42, y + 4);
  doc.text('Placement & Post-Secondary Qualification Outcome', 85, y + 4);
  y += 6;

  const cseeDivs = [
    { d: 'Division I', p: '7 - 17 Points', o: 'Top High School STEM/Arts Selection (PCM, PCB, PGM, EGM)' },
    { d: 'Division II', p: '18 - 21 Points', o: 'Direct Entry to High School Combinations (CBG, HGL, HKL, HGK)' },
    { d: 'Division III', p: '22 - 25 Points', o: 'Eligible for Ordinary Diploma Programs / NACTEVET Colleges' },
    { d: 'Division IV', p: '26 - 33 Points', o: 'Basic Pass Certificate - Eligible for Vocational Skills (VETA)' },
    { d: 'Division 0', p: '34 - 35 Points', o: 'Fail - No NECTA Certificate Granted (Lazima Kurudia Mtihani)' },
  ];

  cseeDivs.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(10, y - 1, pageWidth - 20, 5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row.d, 13, y + 3);
    doc.text(row.p, 42, y + 3);
    doc.text(row.o, 85, y + 3);
    y += 4.8;
  });

  y += 7;

  // Page check before Section 3
  if (y > pageHeight - 65) {
    doc.addPage();
    y = 15;
  }

  // ==========================================
  // SECTION 3: A-LEVEL ACSEE (Form 6)
  // ==========================================
  drawSectionHeader('3. A-LEVEL ACSEE (FORM 6) - PRINCIPAL GRADES & DIVISIONS', 147, 51, 234);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('A. Principal Subject Grade Ranges & Points (Combination Subjects):', 12, y);
  y += 4;

  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Grade', 13, y + 4);
  doc.text('Percentage Range', 35, y + 4);
  doc.text('Principal Points', 75, y + 4);
  doc.text('Pass Category & Higher Education Status', 115, y + 4);
  y += 6;

  const acseeRows = [
    { g: 'Grade A', p: '75% - 100%', pt: '5 Points', c: 'Principal Pass (High Distinction)' },
    { g: 'Grade B', p: '60% - 74%', pt: '4 Points', c: 'Principal Pass (Very Good Credit)' },
    { g: 'Grade C', p: '50% - 59%', pt: '3 Points', c: 'Principal Pass (Good Credit Pass)' },
    { g: 'Grade D', p: '40% - 49%', pt: '2 Points', c: 'Principal Pass (Satisfactory Pass)' },
    { g: 'Grade E', p: '35% - 39%', pt: '1 Point', c: 'Subsidiary Pass (Minimum Pass)' },
    { g: 'Grade F', p: '0% - 34%', pt: '0 Points', c: 'Fail Grade (Kutofaulu)' },
  ];

  acseeRows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(10, y - 1, pageWidth - 20, 5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row.g, 13, y + 3);
    doc.text(row.p, 35, y + 3);
    doc.text(row.pt, 75, y + 3);
    doc.text(row.c, 115, y + 3);
    y += 4.8;
  });

  y += 3;

  doc.setFont('helvetica', 'bold');
  doc.text('B. A-Level Division & TCU University Direct Entry Benchmark:', 12, y);
  y += 4;

  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.text('Division', 13, y + 4);
  doc.text('Points Range', 42, y + 4);
  doc.text('TCU Direct University Admission Status (Vyuo Vikuu)', 85, y + 4);
  y += 6;

  const acseeDivs = [
    { d: 'Division I', p: '3 - 9 Points', o: 'Competitive Entry to Medicine (MD), Law, Engineering & Science' },
    { d: 'Division II', p: '10 - 12 Points', o: 'Direct University Degree Entry across all Academic Faculties' },
    { d: 'Division III', p: '13 - 17 Points', o: 'Qualified for Direct Degree Entry (Min 2 Principal Passes = 4.0 Pts)' },
    { d: 'Division IV', p: '18 - 19 Points', o: 'Eligible for Higher Diploma / Ordinary Diploma Pathway' },
    { d: 'Division 0', p: '20 Points', o: 'Unqualified for Direct University Degree Entry' },
  ];

  acseeDivs.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(10, y - 1, pageWidth - 20, 5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row.d, 13, y + 3);
    doc.text(row.p, 42, y + 3);
    doc.text(row.o, 85, y + 3);
    y += 4.8;
  });

  y += 7;

  // ==========================================
  // SECTION 4: SCHOOL TEST SCALES (50-Mark & 100-Mark)
  // ==========================================
  drawSectionHeader('4. INTERNAL SCHOOL TEST SCALES (50-MARK & 100-MARK REFERENCE)', 245, 158, 11);

  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Grade', 13, y + 4);
  doc.text('50-Mark Scale Range', 35, y + 4);
  doc.text('100-Mark Scale Range (%)', 80, y + 4);
  doc.text('Swahili Remark (Maelezo)', 135, y + 4);
  y += 6;

  const schoolScales = [
    { g: 'Grade A', m50: '41 - 50 Marks', m100: '81% - 100%', sw: 'Vyema Sana (Distinction Level)' },
    { g: 'Grade B', m50: '31 - 40 Marks', m100: '61% - 80%', sw: 'Vyema (Very Good Credit)' },
    { g: 'Grade C', m50: '21 - 30 Marks', m100: '41% - 60%', sw: 'Wastani (Good Pass)' },
    { g: 'Grade D', m50: '11 - 20 Marks', m100: '21% - 40%', sw: 'Dhaifu (Basic Pass)' },
    { g: 'Grade F', m50: '0 - 10 Marks', m100: '0% - 20%', sw: 'Vibaya (Fail / Unsatisfactory)' },
  ];

  schoolScales.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(10, y - 1, pageWidth - 20, 5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row.g, 13, y + 3);
    doc.text(row.m50, 35, y + 3);
    doc.text(row.m100, 80, y + 3);
    doc.text(row.sw, 135, y + 3);
    y += 4.8;
  });

  y += 8;

  // Check page footer overflow
  if (y > pageHeight - 20) {
    doc.addPage();
    y = 15;
  }

  // Footer / Certification Stamp
  doc.setLineWidth(0.3);
  doc.setDrawColor(203, 213, 225);
  doc.line(10, y, pageWidth - 10, y);
  y += 4;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Education-TZ Official Student Reference Document | Published for NECTA Exam Revision and Student Guidance.', 10, y);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, pageWidth - 45, y);

  doc.save('NECTA_Grading_Standards_Education_TZ.pdf');
}
