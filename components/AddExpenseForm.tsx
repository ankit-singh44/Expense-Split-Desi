import React, { useState, useEffect } from 'react';
import { Participant, Expense, Category } from '../types';
import { PlusCircle, Receipt, Utensils, Plane, ShoppingBag, GraduationCap, MoreHorizontal, Check } from 'lucide-react';

interface AddExpenseFormProps {
  participants: Participant[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
}

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'Food', label: 'Food', icon: <Utensils className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { id: 'Travel', label: 'Travel', icon: <Plane className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: 'Shopping', label: 'Shop', icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-pink-100 text-pink-600 border-pink-200' },
  { id: 'Course', label: 'Course', icon: <GraduationCap className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { id: 'Other', label: 'Other', icon: <MoreHorizontal className="w-4 h-4" />, color: 'bg-gray-100 text-gray-600 border-gray-200' },
];

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ participants, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [payerId, setPayerId] = useState<string>('');
  const [involvedIds, setInvolvedIds] = useState<string[]>([]);
  const [isAllInvolved, setIsAllInvolved] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset/Initialize default values when participants change
  useEffect(() => {
    if (participants.length > 0 && !payerId) {
      setPayerId(participants[0].id);
    }
    if (isAllInvolved) {
      setInvolvedIds(participants.map(p => p.id));
    }
  }, [participants, payerId, isAllInvolved]);

  const handleInvolvedChange = (id: string) => {
    if (isAllInvolved) {
       setIsAllInvolved(false);
       const newIds = participants.map(p => p.id).filter(pid => pid !== id);
       setInvolvedIds(newIds);
    } else {
      setInvolvedIds(prev => 
        prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
      );
    }
  };

  const handleSelectAll = () => {
    setIsAllInvolved(true);
    setInvolvedIds(participants.map(p => p.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !payerId || involvedIds.length === 0) return;

    onAddExpense({
      description,
      amount: parseFloat(amount),
      category,
      payerId,
      involvedIds,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('Food');
    setIsAllInvolved(true);
    setInvolvedIds(participants.map(p => p.id));
    setIsExpanded(false);
  };

  const isValid = description && amount && payerId && involvedIds.length > 0;

  if (participants.length < 2) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white mb-6">
        <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-gray-900 font-semibold">Get Started</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">Add at least 2 participants above to start splitting expenses.</p>
        </div>
      </div>
    );
  }

  // Floating Action Button style if collapsed
  if (!isExpanded) {
    return (
      <div className="fixed bottom-24 right-4 z-30 md:static md:z-0 md:bottom-auto md:right-auto w-full md:w-auto px-4 md:px-0">
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-full md:w-full bg-gradient-to-r from-primary-600 to-green-500 hover:from-primary-700 hover:to-green-600 text-white shadow-xl shadow-green-900/20 rounded-2xl py-4 px-6 flex items-center justify-center gap-2 font-semibold text-lg transform transition-all hover:-translate-y-1 active:scale-95"
          >
            <PlusCircle className="w-6 h-6" />
            Add New Expense
          </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm md:static md:bg-transparent md:backdrop-blur-none p-4 md:p-0 animate-fade-in">
        {/* Overlay click to close */}
        <div className="absolute inset-0 md:hidden" onClick={() => setIsExpanded(false)} />
        
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl md:shadow-lg border border-gray-100 overflow-hidden relative animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <div className="bg-primary-100 p-2 rounded-xl text-primary-600">
                        <Receipt className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Add Expense</h2>
                </div>
                <button 
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 md:hidden"
                >
                    Close
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Description & Amount */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">What was it for?</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Dinner at Pizza Hut"
                            autoFocus
                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-lg font-medium"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">How much?</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-2xl font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Category</label>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategory(cat.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
                                    category === cat.id
                                    ? cat.color + ' ring-2 ring-offset-1 ring-primary-100' 
                                    : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                                }`}
                            >
                                {cat.icon}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Paid By</label>
                        <select
                            value={payerId}
                            onChange={(e) => setPayerId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-gray-800 font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white appearance-none"
                            style={{ backgroundImage: 'none' }}
                        >
                            {participants.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Split Logic */}
                <div className="bg-gray-50/80 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Split Between</label>
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className={`text-xs font-bold px-2 py-1 rounded transition-colors ${isAllInvolved ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Select All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {participants.map(p => {
                        const isSelected = isAllInvolved || involvedIds.includes(p.id);
                        return (
                            <button
                            key={p.id}
                            type="button"
                            onClick={() => handleInvolvedChange(p.id)}
                            className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all flex items-center gap-1 ${
                                isSelected
                                ? 'bg-white border-primary-500 text-primary-700 shadow-sm'
                                : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-100'
                            }`}
                            >
                            {isSelected && <Check className="w-3 h-3" />}
                            {p.name}
                            </button>
                        );
                        })}
                    </div>
                    {involvedIds.length === 0 && <p className="text-xs text-red-500 mt-2 font-medium">Select at least one person.</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="flex-1 py-3.5 rounded-2xl font-semibold text-gray-500 hover:bg-gray-100 transition-colors md:hidden"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid}
                        className="flex-[2] flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-2xl font-semibold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Expense
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AddExpenseForm;