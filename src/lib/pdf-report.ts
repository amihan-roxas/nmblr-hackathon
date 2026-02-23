import { jsPDF } from 'jspdf';
import type { DonationItem } from '../types/index.ts';

const GREEN = [16, 185, 129] as const; // emerald-500
const DARK = [17, 24, 39] as const;    // gray-900
const GRAY = [75, 85, 99] as const;    // gray-600
const LIGHT_BG = [236, 253, 245] as const; // emerald-50

function formatValue(item: DonationItem): string {
  if (!item.impact.estimatedValue) return 'N/A';
  const currency = item.impact.currency ?? 'PHP';
  return `${currency} ${item.impact.estimatedValue.toLocaleString()}`;
}

export function downloadImpactReport(item: DonationItem, seekerOrg: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  const bottomMargin = 20;
  let y = 20;
  const lineH = 5;

  // ── Page-break helper ──
  function checkPage(needed: number) {
    if (y + needed > pageH - bottomMargin) {
      doc.addPage();
      y = margin;
    }
  }

  // ── Header bar ──
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, pageW, 38, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('AIYUDA', margin, 16);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Impact Report', margin, 24);
  doc.setFontSize(9);
  doc.text(new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }), margin, 32);
  y = 48;

  // ── Section helper ──
  function sectionTitle(title: string) {
    checkPage(20);
    doc.setFillColor(...GREEN);
    doc.rect(margin, y, contentW, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 3, y + 5.5);
    y += 12;
  }

  function bodyText(text: string) {
    doc.setTextColor(...GRAY);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines: string[] = doc.splitTextToSize(text, contentW);
    for (const line of lines) {
      checkPage(lineH);
      doc.text(line, margin, y);
      y += lineH;
    }
    y += 4;
  }

  const labelX = margin + 2;
  const valueX = margin + 40;
  const valueW = contentW - 40;

  function metricRow(label: string, value: string) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const wrappedLines: string[] = doc.splitTextToSize(value, valueW);
    const blockH = wrappedLines.length * lineH;
    checkPage(blockH);

    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'bold');
    doc.text(label, labelX, y);

    doc.setFont('helvetica', 'normal');
    for (const line of wrappedLines) {
      doc.text(line, valueX, y);
      y += lineH;
    }
    y += 1;
  }

  // ── 1. Executive Summary ──
  sectionTitle('1. EXECUTIVE SUMMARY');
  bodyText(
    `${seekerOrg} has claimed "${item.name}" (x${item.quantity}) donated by ${item.donorName}. ` +
    'This donation has been matched through ResourceCycle, turning surplus resources into measurable social impact.',
  );

  // ── 2. High-Level Metrics ──
  sectionTitle('2. HIGH-LEVEL METRICS');
  const metricsStartY = y - 2;
  metricRow('Item:', item.name);
  metricRow('Quantity:', String(item.quantity));
  metricRow('Category:', item.category);
  metricRow('Donor:', item.donorName);
  metricRow('Claiming Org:', seekerOrg);
  metricRow('People Helped:', String(item.impact.peopleHelped ?? 'N/A'));
  metricRow('Estimated Value:', formatValue(item));
  metricRow('SDGs Addressed:', item.impact.sdgs.map((s) => `SDG ${s.number}: ${s.name}`).join(', '));
  // Draw background behind metrics (on first page only if no page break occurred)
  const metricsEndY = y;
  const metricsH = metricsEndY - metricsStartY + 2;
  if (metricsH > 0 && metricsStartY > margin) {
    // Re-draw the bg behind the metrics (drawn after so we know the height)
    // jsPDF draws in order, so we insert the rect on the page where metrics started
    const currentPage = doc.getCurrentPageInfo().pageNumber;
    const totalPages = doc.getNumberOfPages();
    if (currentPage === totalPages && currentPage === 1) {
      // Simple case: everything on one page — overdraw bg then re-render metrics
      // Skip background for simplicity; metrics are readable without it
    }
  }
  y += 4;

  // ── 3. Story ──
  sectionTitle('3. STORY');
  bodyText(item.impact.text);
  const narrative = item.category === 'Tech Equipment'
    ? 'Technology donations bridge the digital divide — giving students and communities access to tools that unlock education, employment, and innovation opportunities they would otherwise never have.'
    : 'Furniture donations create dignified learning and working spaces — when children have proper desks and chairs, attendance rises, focus improves, and communities build the foundations for lasting growth.';
  bodyText(narrative);

  // ── 4. Financial Transparency ──
  sectionTitle('4. FINANCIAL TRANSPARENCY');
  bodyText('ResourceCycle Allocation Model:');
  const allocations = [
    ['85%', 'Direct program delivery'],
    ['10%', 'Logistics & matching'],
    ['5%', 'Platform administration'],
  ];
  for (const [pct, desc] of allocations) {
    checkPage(lineH);
    doc.setTextColor(...DARK);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${pct}`, margin + 6, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text(`— ${desc}`, margin + 18, y);
    y += 6;
  }
  y += 4;

  // ── 5. Future Goals ──
  sectionTitle('5. FUTURE GOALS');
  bodyText(
    'ResourceCycle aims to expand across the Philippines, connecting more donors with schools, orphanages, and community organizations. ' +
    'Every item diverted from waste becomes a building block for education and opportunity.',
  );

  // ── Footer ──
  checkPage(12);
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 2, pageW - margin, y + 2);
  y += 8;
  doc.setTextColor(...GREEN);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Generated by ResourceCycle — Turning Surplus Into Impact', margin, y);

  // ── Download ──
  const filename = `ResourceCycle_Impact_${item.name.replace(/\s+/g, '_')}_${seekerOrg.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
