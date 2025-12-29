
import { Transaction } from '../types';

export const parseCSV = (csvContent: string): Transaction[] => {
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];
  
  const headers = lines[0].toLowerCase().split(',');
  
  return lines.slice(1).map((line, idx) => {
    const values = line.split(',');
    const obj: any = {};
    headers.forEach((h, i) => {
      const value = values[i]?.replace(/"/g, '').trim();
      obj[h.trim()] = value;
    });

    return {
      id: Math.random().toString(36).substr(2, 9),
      date: obj.date || new Date().toISOString(),
      amount: parseFloat(obj.amount || '0'),
      category: (obj.category || 'Misc') as any,
      description: obj.description || 'No description'
    };
  });
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // Common in Indian context for rounded figures
  }).format(value);
};
