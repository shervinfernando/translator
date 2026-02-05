'use client';

import React from 'react';

interface TranslationBoxProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  label?: string;
  maxLength?: number;
}

export default function TranslationBox({
  value,
  onChange,
  placeholder,
  readOnly = false,
  label,
  maxLength = 5000,
}: TranslationBoxProps) {
  const charCount = value.length;

  return (
    <div className="flex flex-col h-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="flex-1 flex flex-col relative">
        <textarea
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          readOnly={readOnly}
          maxLength={maxLength}
          className={`flex-1 w-full px-4 py-3 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all ${
            readOnly ? 'cursor-default bg-gray-50 dark:bg-gray-700' : ''
          }`}
        />
        {!readOnly && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
