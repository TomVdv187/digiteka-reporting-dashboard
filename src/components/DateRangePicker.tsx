'use client';

import { useState } from 'react';
import { CalendarIcon } from '@/components/icons/Icons';

interface DateRangePickerProps {
  onDateChange: (startDate: string, endDate: string) => void;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export function DateRangePicker({ 
  onDateChange, 
  defaultStartDate, 
  defaultEndDate 
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(
    defaultStartDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    defaultEndDate || new Date().toISOString().split('T')[0]
  );

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    onDateChange(date, endDate);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    onDateChange(startDate, date);
  };

  const presetRanges = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
  ];

  const handlePresetClick = (days: number) => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setStartDate(start);
    setEndDate(end);
    onDateChange(start, end);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200 p-6 mb-8 animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
          <CalendarIcon />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Date Range Selection</h3>
          <p className="text-sm text-slate-600">Choose your reporting period</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label htmlFor="start-date" className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="end-date" className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="text-sm font-medium text-slate-600 mr-2 flex items-center">Quick Select:</span>
        {presetRanges.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset.days)}
            className="px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200 hover:shadow-sm"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}