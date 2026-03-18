'use client';

import { Download } from 'lucide-react';
import { generateCSV, downloadCSV } from '@/lib/csvExport';
import { CompanyAccount, Expense, Member } from '@/lib/types';

interface CSVExportProps {
  expenses: Expense[];
  company: CompanyAccount;
  members: Member[];
  onExport: () => void;
}

export default function CSVExport({
  expenses,
  company,
  members,
  onExport,
}: CSVExportProps) {
  const handleDownload = () => {
    const csv = generateCSV(expenses, company, members);
    downloadCSV(csv);
    onExport();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-[0.98]"
    >
      <Download size={18} />
      Download CSV Report
    </button>
  );
}
