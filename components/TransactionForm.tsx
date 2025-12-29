
import React, { useState } from 'react';
import { Transaction, TransactionCategory } from '../types';
import { CATEGORIES } from '../constants';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (t: Transaction) => void;
}

export const TransactionForm: React.FC<Props> = ({ onAdd }) => {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !desc) return;
    
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(amount),
      description: desc,
      category,
      date: `${date}T${time}:00`,
    });

    setAmount('');
    setDesc('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Add Entry</h3>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Manual Override</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Amount (₹)</label>
          <input 
            type="number" 
            step="1" 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-300"
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Description</label>
          <input 
            type="text" 
            value={desc} 
            onChange={e => setDesc(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-300"
            placeholder="Vendor name..."
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Category</label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value as any)}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-slate-900 transition-all appearance-none cursor-pointer"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex space-x-3">
          <div className="flex-1 space-y-2">
             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Date</label>
             <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-slate-900 transition-all" />
          </div>
          <div className="w-24 space-y-2">
             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Time</label>
             <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-slate-900 transition-all" />
          </div>
        </div>
      </div>
      
      <button 
        type="submit"
        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all flex items-center justify-center space-x-3 shadow-xl shadow-slate-100 active:scale-[0.99]"
      >
        <Plus size={18} />
        <span>Register Transaction</span>
      </button>
    </form>
  );
};
