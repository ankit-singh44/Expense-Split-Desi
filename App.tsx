import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Participant, Expense } from './types';
import Home from './components/Home';
import Analytics from './components/Analytics';
import BottomNav from './components/BottomNav';

const App = () => {
  // Load initial state from local storage
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
        const saved = localStorage.getItem('fs_participants');
        return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
        const saved = localStorage.getItem('fs_expenses');
        return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('fs_participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('fs_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      name,
    };
    setParticipants([...participants, newParticipant]);
  };

  const removeParticipant = (id: string) => {
    if (expenses.some(e => e.payerId === id || e.involvedIds.includes(id))) {
      alert("Cannot remove this person because they are part of existing expenses.");
      return;
    }
    setParticipants(participants.filter(p => p.id !== id));
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleReset = () => {
     if(confirm('Are you sure you want to clear all data? This cannot be undone.')) {
         setParticipants([]);
         setExpenses([]);
         localStorage.clear();
     }
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900">
        <Routes>
          <Route path="/" element={
            <Home 
              participants={participants} 
              expenses={expenses}
              onAddParticipant={addParticipant}
              onRemoveParticipant={removeParticipant}
              onAddExpense={addExpense}
              onRemoveExpense={removeExpense}
              onReset={handleReset}
            />
          } />
          <Route path="/analytics" element={
            <Analytics expenses={expenses} participants={participants} />
          } />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;