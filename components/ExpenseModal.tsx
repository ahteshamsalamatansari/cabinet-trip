'use client';

import { useState, useMemo } from 'react';
import { X, Plus, Building2 } from 'lucide-react';
import { MEMBER_NAMES } from '@/lib/data';

interface ExpenseModalProps {
  isOpen: boolean;
  companyBalance: number;
  onClose: () => void;
  onAddExpense: (
    name: string,
    amount: number,
    paidBy: string,
    day: 1 | 2
  ) => void;
}

export default function ExpenseModal({
  isOpen,
  companyBalance,
  onClose,
  onAddExpense,
}: ExpenseModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('COMPANY');
  const [day, setDay] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const numAmount = parseFloat(amount) || 0;

  const preview = useMemo(() => {
    if (paidBy !== 'COMPANY' || numAmount <= 0) return null;

    if (companyBalance >= numAmount) {
      return {
        text: '✅ Company fully covers this expense.',
        className: 'text-green-400',
      };
    } else if (companyBalance > 0) {
      const covered = companyBalance;
      const split = numAmount - covered;
      return {
        text: `⚠️ Company covers ₹${covered.toFixed(2)}, ₹${split.toFixed(2)} split among 7 members.`,
        className: 'text-amber-400',
      };
    } else {
      return {
        text: '⚠️ Company balance ₹0 — full amount split among members.',
        className: 'text-red-400',
      };
    }
  }, [paidBy, numAmount, companyBalance]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Expense name is required';
    if (!amount || isNaN(numAmount) || numAmount <= 0)
      newErrors.amount = 'Enter a valid positive amount';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddExpense(name.trim(), numAmount, paidBy, day);
    setName('');
    setAmount('');
    setPaidBy('COMPANY');
    setDay(1);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1629]/95 backdrop-blur-xl shadow-2xl animate-modal-in">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            ➕ Add Expense
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Expense Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dinner, Hotel, Fuel"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Amount (₹) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors((prev) => ({ ...prev, amount: '' }));
              }}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
              min="0"
              step="0.01"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-400">{errors.amount}</p>
            )}
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Paid By
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all appearance-none cursor-pointer"
            >
              <option
                value="COMPANY"
                className="bg-[#0f1629] text-amber-400"
              >
                🏢 COMPANY (Balance: ₹{companyBalance.toFixed(2)})
              </option>
              {MEMBER_NAMES.map((memberName) => (
                <option
                  key={memberName}
                  value={memberName}
                  className="bg-[#0f1629]"
                >
                  {memberName}
                </option>
              ))}
            </select>

            {/* Live Preview */}
            {preview && (
              <p className={`mt-2 text-xs font-medium ${preview.className}`}>
                {preview.text}
              </p>
            )}
          </div>

          {/* Day */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Day
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDay(1)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  day === 1
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                Day 1
              </button>
              <button
                type="button"
                onClick={() => setDay(2)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  day === 2
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                Day 2
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-[0.98]"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
}
