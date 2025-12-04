import React, { useMemo } from 'react';
import { Participant, Expense } from '../types';
import { calculateSettlements } from '../utils/splitter';
import ParticipantManager from './ParticipantManager';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import SettlementView from './SettlementView';
import { Link } from 'react-router-dom';
import { PieChart, ArrowRight } from 'lucide-react';

interface HomeProps {
  participants: Participant[];
  expenses: Expense[];
  onAddParticipant: (name: string) => void;
  onRemoveParticipant: (id: string) => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onRemoveExpense: (id: string) => void;
  onReset: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  participants, 
  expenses, 
  onAddParticipant, 
  onRemoveParticipant, 
  onAddExpense, 
  onRemoveExpense,
  onReset
}) => {
  
  const settlementSummary = useMemo(() => {
    return calculateSettlements(participants, expenses);
  }, [participants, expenses]);

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white pb-16 pt-8 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500 to-transparent"></div>
        
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-900/50">
                    F
                </div>
                <h1 className="text-2xl font-bold tracking-tight">FairShare</h1>
            </div>
            
            <div className="flex gap-4">
                <Link to="/analytics" className="hidden md:flex items-center gap-2 text-sm font-medium text-primary-200 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                    <PieChart className="w-4 h-4" />
                    Analytics
                </Link>
                <button 
                    onClick={onReset}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                    Reset
                </button>
            </div>
          </div>

          <div className="text-center md:text-left mb-6">
            <h2 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Split bills smartly.
            </h2>
            <p className="text-gray-400 text-lg">Settle instantly with friends & roommates.</p>
          </div>

          {/* Settlement Preview Card inside Hero for impact */}
          {expenses.length > 0 && (
             <div className="mt-8 animate-slide-up">
                 <SettlementView 
                    summary={settlementSummary} 
                    participants={participants}
                    expenses={expenses}
                />
             </div>
          )}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 -mt-8 relative z-20 space-y-6">
        
        <ParticipantManager 
            participants={participants}
            onAdd={onAddParticipant}
            onRemove={onRemoveParticipant}
        />

        <div className="hidden md:block">
            <Link to="/analytics" className="block w-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 p-4 rounded-2xl transition-all group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                            <PieChart className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900">View Spending Analytics</h3>
                            <p className="text-xs text-indigo-600">See chart breakdowns by category</p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </div>

        <ExpenseList 
            expenses={expenses}
            participants={participants}
            onRemoveExpense={onRemoveExpense}
        />
        
        <AddExpenseForm 
            participants={participants}
            onAddExpense={onAddExpense}
        />
      </main>
    </div>
  );
};

export default Home;