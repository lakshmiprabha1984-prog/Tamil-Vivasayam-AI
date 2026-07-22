/**
 * Safely exports array of objects to CSV, handles UTF-8 BOM for Tamil / non-English characters.
 */
export function exportToCSV(
  data: any[],
  headers: { key: string; label: string }[],
  filename: string
) {
  // Extract headers labels
  const csvHeaders = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',');
  
  // Extract rows
  const csvRows = data.map(row => 
    headers.map(h => {
      const val = row[h.key];
      const strVal = val === null || val === undefined ? '' : String(val);
      return `"${strVal.replace(/"/g, '""')}"`;
    }).join(',')
  );

  // Combine headers and rows
  // \uFEFF is the UTF-8 Byte Order Mark (BOM) so Excel opens it with correct UTF-8 decoding
  const csvContent = '\uFEFF' + [csvHeaders, ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
