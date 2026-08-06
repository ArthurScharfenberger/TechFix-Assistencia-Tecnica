function csvCell(value: string | number | null | undefined): string {
  const normalized = value === null || value === undefined ? '' : String(value);
  return `"${normalized.replace(/"/g, '""')}"`;
}

export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number | null | undefined>>): void {
  const content = [headers, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n');
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
