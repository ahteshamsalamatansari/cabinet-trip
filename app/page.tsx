'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  CompanyAccount,
  Expense,
  Member,
  Payment,
  ToastMessage,
} from '@/lib/types';
import {
  createInitialMembers,
  createInitialCompany,
  generateId,
} from '@/lib/data';
import { calculateExpenseSplit, recalculateMembers } from '@/lib/calculations';
import Hero from '@/components/Hero';
import CompanyCard from '@/components/CompanyCard';
import MemberCard from '@/components/MemberCard';
import ExpenseModal from '@/components/ExpenseModal';
import DepositModal from '@/components/DepositModal';
import DayView from '@/components/DayView';
import SummaryTab from '@/components/SummaryTab';
import CSVExport from '@/components/CSVExport';
import Toast from '@/components/Toast';
import { Plus } from 'lucide-react';

type ActiveTab = 1 | 2 | 'summary';

import { supabase } from '@/lib/supabase';

export default function Home() {
  const [company, setCompany] = useState<CompanyAccount>(createInitialCompany);
  const [members, setMembers] = useState<Member[]>(createInitialMembers);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>(1);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const dashboardRef = useRef<HTMLDivElement>(null);

  // --- Load Data from Supabase on Mount ---
  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('trip_state')
          .select('*')
          .eq('id', 1)
          .single();

        if (data && !error) {
          if (data.company) setCompany(data.company);
          if (data.members && data.members.length > 0) setMembers(data.members);
          if (data.expenses) setExpenses(data.expenses);
        }
      } catch (e) {
        console.error('Failed to load data from Supabase', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  // --- Save Data to Supabase on Change (Debounced) ---
  useEffect(() => {
    if (isLoaded) {
      const saveData = async () => {
        try {
          await supabase
            .from('trip_state')
            .update({
              company,
              members,
              expenses,
              updated_at: new Date().toISOString(),
            })
            .eq('id', 1);
        } catch (e) {
          console.error('Failed to save data to Supabase', e);
        }
      };

      const timeoutId = setTimeout(() => {
        saveData();
      }, 1000); // 1-second debounce to prevent spamming API

      return () => clearTimeout(timeoutId);
    }
  }, [company, members, expenses, isLoaded]);

  const addToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'success') => {
      const id = generateId();
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const scrollToDashboard = useCallback(() => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // --- Deposit ---
  const handleDeposit = useCallback(
    (amount: number, note: string) => {
      setCompany((prev) => ({
        ...prev,
        availableBalance: prev.availableBalance + amount,
        totalDeposited: prev.totalDeposited + amount,
        depositHistory: [
          ...prev.depositHistory,
          {
            id: generateId(),
            amount,
            note: note || undefined,
            timestamp: new Date().toISOString(),
          },
        ],
      }));
      addToast(`₹${amount.toFixed(2)} deposited to COMPANY`, 'success');
    },
    [addToast]
  );

  // --- Add Expense ---
  const handleAddExpense = useCallback(
    (name: string, amount: number, paidBy: string, day: 1 | 2) => {
      const result = calculateExpenseSplit(
        amount,
        paidBy,
        company.availableBalance
      );

      const newExpense: Expense = {
        id: generateId(),
        name,
        amount,
        paidBy,
        companyContribution: result.companyContribution,
        memberSplitAmount: result.memberSplitAmount,
        perPersonShare: result.perPersonShare,
        day,
        timestamp: new Date().toISOString(),
      };

      const newExpenses = [...expenses, newExpense];
      setExpenses(newExpenses);

      // Update company
      if (paidBy === 'COMPANY') {
        setCompany((prev) => ({
          ...prev,
          availableBalance: result.newCompanyBalance,
          totalSpent: prev.totalSpent + result.companyContribution,
          expensesCovered: [...prev.expensesCovered, newExpense.id],
        }));
      }

      // Recalculate members
      setMembers((prev) => recalculateMembers(prev, newExpenses));

      if (result.isFullCompany) {
        addToast(`"${name}" fully covered by COMPANY`, 'success');
      } else if (result.isPartial) {
        addToast(
          `"${name}" partially covered — ₹${result.memberSplitAmount.toFixed(2)} split among members`,
          'warning'
        );
      } else {
        addToast(`"${name}" added — ₹${result.perPersonShare.toFixed(2)} per person`, 'success');
      }
    },
    [company.availableBalance, expenses, addToast]
  );

  // --- Mark as Paid ---
  const handleMarkPaid = useCallback(
    (memberId: number) => {
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id !== memberId || m.balance <= 0) return m;

          const payment: Payment = {
            id: generateId(),
            memberId: m.id,
            memberName: m.name,
            amountPaid: m.balance,
            day: (activeTab === 'summary' ? 2 : activeTab) as 1 | 2,
            timestamp: new Date().toISOString(),
          };

          addToast(`${m.name} marked as paid — ₹${m.balance.toFixed(2)}`, 'success');

          return {
            ...m,
            totalPaid: m.totalPaid + m.balance,
            balance: 0,
            isPaid: true,
            paymentHistory: [...m.paymentHistory, payment],
          };
        })
      );
    },
    [activeTab, addToast]
  );

  // --- Undo Payment ---
  const handleUndoPaid = useCallback(
    (memberId: number) => {
      setMembers((prev) => {
        const updatedMembers = prev.map((m) => {
          if (m.id !== memberId) return m;

          const lastPayment = m.paymentHistory[m.paymentHistory.length - 1];
          if (!lastPayment) return m;

          const newTotalPaid = m.totalPaid - lastPayment.amountPaid;
          const newBalance =
            Math.round((m.totalOwed - newTotalPaid) * 100) / 100;

          addToast(`${m.name} payment undone`, 'info');

          return {
            ...m,
            totalPaid: Math.round(newTotalPaid * 100) / 100,
            balance: newBalance,
            isPaid: newBalance <= 0 && m.totalOwed > 0,
            paymentHistory: m.paymentHistory.slice(0, -1),
          };
        });
        return updatedMembers;
      });
    },
    [addToast]
  );

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: isActive ? '1px solid rgba(245,158,11,0.3)' : '1px solid transparent',
    background: isActive ? 'rgba(245,158,11,0.2)' : 'transparent',
    color: isActive ? '#fcd34d' : '#9ca3af',
    boxShadow: isActive ? '0 10px 15px -3px rgba(245,158,11,0.1)' : 'none',
  });

  if (!isLoaded) return null;

  return (
    <main style={{ minHeight: '100vh', background: '#0a0f1e' }}>
      {/* Toast */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Modals */}
      <ExpenseModal
        isOpen={showExpenseModal}
        companyBalance={company.availableBalance}
        onClose={() => setShowExpenseModal(false)}
        onAddExpense={handleAddExpense}
      />
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
      />

      {/* Hero */}
      <Hero
        companyBalance={company.availableBalance}
        onDeposit={() => setShowDepositModal(true)}
        onScrollDown={scrollToDashboard}
      />

      {/* Dashboard */}
      <section
        ref={dashboardRef}
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px', width: '100%' }}
      >
        {/* Dashboard Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>Dashboard</h2>
          <button
            onClick={() => setShowExpenseModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(to right, #f59e0b, #ea580c)', color: '#fff', fontWeight: 700, borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', boxShadow: '0 10px 15px -3px rgba(245,158,11,0.2)' }}
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>

        {/* Day Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button style={tabStyle(activeTab === 1)} onClick={() => setActiveTab(1)}>
            Day 1
          </button>
          <button style={tabStyle(activeTab === 2)} onClick={() => setActiveTab(2)}>
            Day 2
          </button>
          <button style={tabStyle(activeTab === 'summary')} onClick={() => setActiveTab('summary')}>
            Summary
          </button>
        </div>

        {/* COMPANY Card */}
        <div style={{ marginBottom: '32px' }}>
          <CompanyCard
            company={company}
            expenses={expenses}
            onDeposit={() => setShowDepositModal(true)}
          />
        </div>

        {/* Tab Content */}
        <div style={{ marginBottom: '32px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(4px)' }}>
          {activeTab === 'summary' ? (
            <SummaryTab
              expenses={expenses}
              company={company}
              members={members}
            />
          ) : (
            <DayView expenses={expenses} day={activeTab} />
          )}
        </div>

        {/* CSV Export (Summary tab only) */}
        {activeTab === 'summary' && expenses.length > 0 && (
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
            <CSVExport
              expenses={expenses}
              company={company}
              members={members}
              onExport={() => addToast('CSV report downloaded', 'success')}
            />
          </div>
        )}

        {/* Member Cards */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            👥 Members
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onMarkPaid={handleMarkPaid}
                onUndoPaid={handleUndoPaid}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Floating Add Expense Button (mobile) */}
      <button
        onClick={() => setShowExpenseModal(true)}
        style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 40, width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(to right, #f59e0b, #ea580c)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 25px 50px -12px rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Plus size={24} />
      </button>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 0', textAlign: 'center' }}>
        <p style={{ color: '#4b5563', fontSize: '14px' }}>
          Cabinet Trip 2026 — Expense Calculator
        </p>
      </footer>
    </main>
  );
}
