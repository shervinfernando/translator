'use client';

import React, { useState, useEffect } from 'react';
import LanguageSelector, { Language } from '@/components/LanguageSelector';
import TranslationBox from '@/components/TranslationBox';
import SwapButton from '@/components/SwapButton';

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
];

export default function Home() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ja');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Translate text with debouncing
  const translateText = async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      setModelUsed(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          source_lang: sourceLang,
          target_lang: targetLang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);
      setModelUsed(data.model_used);
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(err.message || 'An error occurred during translation');
      setTranslatedText('');
    } finally {
      setIsLoading(false);
    }
  };

  // Swap languages
  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  // Clear all text
  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
    setModelUsed(null);
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (translatedText) {
      try {
        await navigator.clipboard.writeText(translatedText);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🌐 Multi-Language Translator
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Powered by AI Translation Models
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Language Selectors */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <LanguageSelector
              value={sourceLang}
              onChange={setSourceLang}
              languages={LANGUAGES}
              label="Source Language"
            />
          </div>
          <div className="flex items-end pb-2">
            <SwapButton onClick={handleSwapLanguages} />
          </div>
          <div className="flex-1">
            <LanguageSelector
              value={targetLang}
              onChange={setTargetLang}
              languages={LANGUAGES}
              label="Target Language"
            />
          </div>
        </div>

        {/* Translation Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Source Text */}
          <div className="h-96">
            <TranslationBox
              value={sourceText}
              onChange={setSourceText}
              placeholder="Enter text to translate..."
              label="Source Text"
            />
          </div>

          {/* Translated Text */}
          <div className="h-96">
            <TranslationBox
              value={translatedText}
              placeholder="Translation will appear here..."
              readOnly
              label="Translation"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={translateText}
              disabled={isLoading || !sourceText.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Translating...
                </span>
              ) : (
                'Translate'
              )}
            </button>
            
            <button
              onClick={handleCopy}
              disabled={!translatedText}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              title="Copy translation"
            >
              📋 Copy
            </button>

            <button
              onClick={handleClear}
              disabled={!sourceText && !translatedText}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              🗑️ Clear
            </button>
          </div>

          {/* Model Info */}
          {modelUsed && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Model: <span className="font-medium">{modelUsed}</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium">Translation Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            ℹ️ Supported Languages
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            This translator uses state-of-the-art AI models (MarianMT and NLLB-200) to provide
            accurate translations between multiple languages.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>Multi-Language Translator &copy; 2026 | Built with Next.js and FastAPI</p>
      </footer>
    </div>
  );
}
