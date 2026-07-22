import { jsPDF } from 'jspdf';
import { User, Crop, DiseaseHistory } from '../types';

import { Language } from './translations';

export function generateFarmReport(
  farmName: string,
  user: User,
  crops: Crop[],
  history: DiseaseHistory[],
  language: Language
) {
  // Filter crops and history for this specific farm
  const farmCrops = crops.filter(c => 
    farmName === 'All' || c.farmName === farmName || (farmName === 'Default' && !c.farmName)
  );

  const farmCropIds = new Set(farmCrops.map(c => c.id));
  const farmHistory = history.filter(h => 
    h.cropId ? farmCropIds.has(h.cropId) : (farmName === 'All' || h.cropName === farmName)
  );

  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString();

  // Page borders / grid
  doc.setDrawColor(226, 232, 240);
  doc.rect(5, 5, 200, 287);

  // 1. HEADER BANNER (Forest Green Accent)
  doc.setFillColor(16, 124, 65); // Forest Green
  doc.rect(10, 10, 190, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('CROPCARE AI - FARM HEALTH & DIAGNOSTIC REPORT', 15, 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Sustainable Agriculture & Smart Diagnostics', 15, 29);

  // 2. METADATA CARDS
  doc.setFillColor(248, 250, 252); // soft slate background
  doc.rect(10, 37, 190, 30, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(10, 37, 190, 30);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85); // Slate 700

  // Left Column
  doc.text('REPORT DETAILS:', 15, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Date: ${dateStr}`, 15, 50);
  doc.text(`Farm Selected: ${farmName === 'All' ? 'All Farms (அனைத்து பண்ணைகளும்)' : farmName}`, 15, 56);
  doc.text(`District: ${user.district || 'Thanjavur (தஞ்சாவூர்)'}`, 15, 62);

  // Right Column
  doc.setFont('helvetica', 'bold');
  doc.text('FARMER PROFILE:', 110, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(`Farmer Name: ${user.name || 'N/A'}`, 110, 50);
  doc.text(`Email Address: ${user.email}`, 110, 56);
  doc.text(`Contact Phone: ${user.phone || 'N/A'}`, 110, 62);

  let currentY = 77;

  // 3. SECTION: CROP HEALTH SUMMARY
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 124, 65); // Green Accent
  doc.text('I. CROP HEALTH SUMMARY (பயிர் சுகாதார சுருக்கம்)', 10, currentY);
  currentY += 5;

  doc.setDrawColor(16, 124, 65);
  doc.setLineWidth(0.5);
  doc.line(10, currentY, 200, currentY);
  currentY += 6;

  if (farmCrops.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('No active crops registered for this farm.', 15, currentY);
    currentY += 12;
  } else {
    // Crop Table Header
    doc.setFillColor(241, 245, 249); // light header
    doc.rect(10, currentY, 190, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    doc.text('Crop Name (பயிர்)', 12, currentY + 5.5);
    doc.text('Variety (வகை)', 60, currentY + 5.5);
    doc.text('Planted Date (தேதி)', 110, currentY + 5.5);
    doc.text('Health Score (மதிப்பெண்)', 160, currentY + 5.5);
    
    currentY += 8;

    // Crop Rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    
    farmCrops.forEach((crop) => {
      // Draw light horizontal divider
      doc.setDrawColor(241, 245, 249);
      doc.line(10, currentY + 8, 200, currentY + 8);

      doc.text(crop.name, 12, currentY + 5.5);
      doc.text(crop.variety || 'Hybrid', 60, currentY + 5.5);
      doc.text(crop.plantedDate || 'N/A', 110, currentY + 5.5);

      const score = crop.healthScore || 0;
      if (score >= 80) {
        doc.setTextColor(16, 124, 65); // Green
      } else {
        doc.setTextColor(220, 38, 38); // Red
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${score}%`, 160, currentY + 5.5);

      // Restore defaults
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);

      currentY += 8;
    });
    currentY += 6;
  }

  // 4. SECTION: DISEASE DIAGNOSIS HISTORY
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 124, 65);
  doc.text('II. DISEASE DIAGNOSIS HISTORY (நோய் மற்றும் கண்டறிதல் வரலாறு)', 10, currentY);
  currentY += 5;

  doc.setDrawColor(16, 124, 65);
  doc.setLineWidth(0.5);
  doc.line(10, currentY, 200, currentY);
  currentY += 6;

  if (farmHistory.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('No disease diagnosis history registered for this farm.', 15, currentY);
    currentY += 12;
  } else {
    // History Cards/Rows
    farmHistory.forEach((record, index) => {
      // Check if we are running out of page height
      if (currentY > 245) {
        doc.addPage();
        // Page borders
        doc.setDrawColor(226, 232, 240);
        doc.rect(5, 5, 200, 287);
        currentY = 15;
      }

      // Record Card Frame
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(241, 245, 249);
      doc.rect(10, currentY, 190, 32, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(10, currentY, 190, 32);

      // Left Accent bar based on severity
      if (record.severity === 'Severe' || record.severity === 'High') {
        doc.setFillColor(220, 38, 38); // Red
      } else {
        doc.setFillColor(245, 158, 11); // Amber
      }
      doc.rect(10, currentY, 2.5, 32, 'F');

      // Card Content
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate 900
      doc.text(`${record.diseaseName} (${record.cropName})`, 15, currentY + 6);

      // Confidence Badge
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Date: ${record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}`, 15, currentY + 11);
      doc.text(`Severity Level: `, 15, currentY + 16);
      
      // Severity styling text
      doc.setFont('helvetica', 'bold');
      if (record.severity === 'Severe' || record.severity === 'High') {
        doc.setTextColor(220, 38, 38);
      } else {
        doc.setTextColor(217, 119, 6);
      }
      doc.text(`${record.severity}`, 37, currentY + 16);

      // Confidence
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`AI Confidence: `, 70, currentY + 16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(`${Math.floor(record.confidence * 100)}%`, 93, currentY + 16);

      // Treatment Advice
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 124, 65);
      doc.text('Recommended Organic Cure:', 15, currentY + 22);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      
      // Handle treatment text wrapping
      const treatmentText = record.organicTreatment || 'N/A';
      const splitTreatment = doc.splitTextToSize(treatmentText, 175);
      doc.text(splitTreatment, 15, currentY + 27);

      currentY += 36;
    });
  }

  // 5. FOOTER & COMPLIANCE SIGNS
  if (currentY > 250) {
    doc.addPage();
    doc.setDrawColor(226, 232, 240);
    doc.rect(5, 5, 200, 287);
    currentY = 20;
  }

  // Signatures
  doc.setDrawColor(226, 232, 240);
  doc.line(10, 260, 80, 260);
  doc.line(120, 260, 190, 260);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('FARMER SIGNATURE', 28, 265);
  doc.text('CROPCARE AI VERIFICATION', 135, 265);

  // Logo Stamp in Footer
  doc.setFillColor(16, 124, 65);
  doc.rect(10, 274, 190, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Generated via CropCare AI App | Empowering Smallholder Agriculture', 15, 281.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Page 1 of 1`, 175, 281.5);

  // Save the PDF file
  doc.save(`Farm_Health_Report_${farmName.replace(/\s+/g, '_')}_${dateStr.replace(/\//g, '-')}.pdf`);
}
