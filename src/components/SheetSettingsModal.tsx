import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  Check,
  AlertCircle,
  RotateCcw,
  Layers,
  ArrowRight,
  Sparkles,
  Calendar,
  Settings,
} from 'lucide-react';
import { SheetConfig } from '../types';
import { extractSpreadsheetId } from '../lib/dateUtils';
import { FIXED_SHEET_CONFIG } from '../lib/sheetsApi';
import { useTheme, SeasonMode, detectSeasonByDate } from '../context/ThemeContext';

interface SheetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SheetConfig;
  onSaveConfig: (newConfig: SheetConfig) => void;
  onOpenAppsScriptSetup?: () => void;
  onRequireAuth?: () => void;
}

export const SheetSettingsModal: React.FC<SheetSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const { season, seasonMode, setSeasonMode, currentYear } = useTheme();
  const [activeTab, setActiveTab] = useState<'sheet' | 'theme'>('theme');
  const [urlInput, setUrlInput] = useState<string>(
    config.spreadsheetUrl || (config.spreadsheetId ? `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/edit` : '')
  );
  const [tabInput, setTabInput] = useState<string>(config.sheetName || 'Project Tracker');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [themeSuccess, setThemeSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('Please provide a valid Google Sheet URL or Spreadsheet ID.');
      return;
    }

    const cleanId = extractSpreadsheetId(trimmed);
    if (!cleanId) {
      setError('Could not extract a valid Google Sheet ID from the provided link. Ensure it contains the spreadsheet ID.');
      return;
    }

    setIsLoading(true);
    try {
      const targetTab = tabInput.trim() || 'Project Tracker';
      const cleanUrl = trimmed.startsWith('http')
        ? trimmed
        : `https://docs.google.com/spreadsheets/d/${cleanId}/edit`;

      const updatedConfig: SheetConfig = {
        ...config,
        spreadsheetId: cleanId,
        spreadsheetUrl: cleanUrl,
        sheetName: targetTab,
        availableSheets: [targetTab],
        spreadsheetTitle: targetTab,
      };

      onSaveConfig(updatedConfig);
      setSuccess(`Google Sheet link updated! Saved for tab "${targetTab}".`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Failed to save sheet link:', err);
      setError(err?.message || 'Could not update sheet link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDefault = () => {
    onSaveConfig(FIXED_SHEET_CONFIG);
    setUrlInput(FIXED_SHEET_CONFIG.spreadsheetUrl);
    setTabInput(FIXED_SHEET_CONFIG.sheetName);
    setSuccess('Restored default Project Tracker Google Sheet.');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleSelectSeasonMode = (mode: SeasonMode) => {
    setSeasonMode(mode);
    const labelMap: Record<SeasonMode, string> = {
      auto: 'Auto (By Current Date)',
      halloween: 'Halloween (October 20 – November 30)',
      christmas: 'Christmas (December)',
      christmas_eve: 'Christmas Eve (December 22 – 24)',
      new_year: `New Year ${currentYear} (January 1 – 15)`,
      none: 'Standard (Classic Navy & Gold)',
    };
    setThemeSuccess(`Theme set to: ${labelMap[mode]}`);
    setTimeout(() => {
      setThemeSuccess(null);
    }, 2500);
  };

  const autoDetectedSeason = detectSeasonByDate(new Date());
  const getSeasonDisplayName = (s: string) => {
    switch (s) {
      case 'halloween':
        return '🎃 Halloween (Active)';
      case 'christmas':
        return '🎄 Christmas (Active)';
      case 'christmas_eve':
        return '❄️ Christmas Eve (Active)';
      case 'new_year':
        return `🎆 New Year ${currentYear} (Active)`;
      default:
        return '⭐ Standard Classic Theme (Active)';
    }
  };

  return (
    <div
      id="sheet-settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0B1736] rounded-2xl max-w-xl w-full border border-slate-200 dark:border-[#1C3565] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-[#1C3565] bg-slate-50/70 dark:bg-[#081229]/80 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-100/70 dark:bg-amber-400/20 text-blue-800 dark:text-amber-300 rounded-lg">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                Settings &amp; Configuration
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Password-protected database connection &amp; Holiday theme controls
              </p>
            </div>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-[#102046] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Segmented Bar */}
        <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-[#1C3565] bg-slate-50/40 dark:bg-[#081229]/40 shrink-0">
          <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-[#060D1E] p-1 rounded-xl border border-slate-200/80 dark:border-[#1C3565]">
            <button
              type="button"
              id="settings-tab-theme"
              onClick={() => setActiveTab('theme')}
              className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'theme'
                  ? 'bg-white dark:bg-[#102046] text-blue-700 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-amber-400/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Holiday Theme</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                seasonMode === 'auto'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                {seasonMode === 'auto' ? 'Auto' : 'Manual'}
              </span>
            </button>

            <button
              type="button"
              id="settings-tab-sheet"
              onClick={() => setActiveTab('sheet')}
              className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'sheet'
                  ? 'bg-white dark:bg-[#102046] text-blue-700 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-amber-400/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
              <span>Google Sheet</span>
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: HOLIDAY THEME SETTINGS */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              {themeSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 animate-in fade-in duration-150">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold">{themeSuccess}</span>
                </div>
              )}

              {/* Status Banner */}
              <div className="p-3.5 bg-blue-50/70 dark:bg-[#060D1E] rounded-xl border border-blue-200/80 dark:border-[#1C3565] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-amber-400">
                    Current Theme Status
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                    <span>Active Theme:</span>
                    <span className="text-blue-600 dark:text-amber-300">{getSeasonDisplayName(season)}</span>
                  </div>
                </div>
                <div className="self-start sm:self-auto">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border ${
                    seasonMode === 'auto'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-500/15 border-amber-400/40 text-amber-700 dark:text-amber-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${seasonMode === 'auto' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    {seasonMode === 'auto' ? 'Auto-Trigger by Date' : 'Manual Override'}
                  </span>
                </div>
              </div>

              {/* Option 1: Auto (By Current Date) - Featured Default Option */}
              <div
                onClick={() => handleSelectSeasonMode('auto')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  seasonMode === 'auto'
                    ? 'border-blue-600 dark:border-amber-400 bg-blue-50/40 dark:bg-amber-400/10 shadow-sm'
                    : 'border-slate-200 dark:border-[#1C3565] hover:border-blue-400 dark:hover:border-amber-400/60 bg-white dark:bg-[#081229]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-amber-400 text-white dark:text-slate-950 flex items-center justify-center font-bold text-base shrink-0 mt-0.5 shadow-2xs">
                      ✨
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                          Auto (By Current Date)
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
                          Recommended Default
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        Theme and background animations will trigger automatically based on the calendar:
                      </p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    seasonMode === 'auto'
                      ? 'border-blue-600 dark:border-amber-400 bg-blue-600 dark:bg-amber-400 text-white dark:text-slate-950'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {seasonMode === 'auto' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Holiday Calendar Schedule Breakdown */}
                <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-[#1C3565] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className={`p-2 rounded-lg border ${
                    autoDetectedSeason === 'halloween'
                      ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-300 dark:border-orange-500/40 text-orange-900 dark:text-orange-200'
                      : 'bg-slate-50 dark:bg-[#060D1E] border-slate-200/70 dark:border-[#14274C] text-slate-700 dark:text-slate-300'
                  }`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>🎃 Halloween</span>
                      <span className="font-mono text-[9.5px] opacity-75">Oct 20 – Nov 30</span>
                    </div>
                    <div className="text-[10px] opacity-80 mt-0.5">Cemetery, flying bats, ghosts &amp; witches</div>
                  </div>

                  <div className={`p-2 rounded-lg border ${
                    autoDetectedSeason === 'christmas'
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-[#060D1E] border-slate-200/70 dark:border-[#14274C] text-slate-700 dark:text-slate-300'
                  }`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>🎄 Christmas</span>
                      <span className="font-mono text-[9.5px] opacity-75">December (excl 22-24)</span>
                    </div>
                    <div className="text-[10px] opacity-80 mt-0.5">Snowfall, snowmen, reindeer &amp; trees</div>
                  </div>

                  <div className={`p-2 rounded-lg border ${
                    autoDetectedSeason === 'christmas_eve'
                      ? 'bg-red-50/80 dark:bg-red-950/40 border-red-300 dark:border-red-500/40 text-red-900 dark:text-red-200'
                      : 'bg-slate-50 dark:bg-[#060D1E] border-slate-200/70 dark:border-[#14274C] text-slate-700 dark:text-slate-300'
                  }`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>❄️ Christmas Eve</span>
                      <span className="font-mono text-[9.5px] opacity-75">Dec 22 – 24</span>
                    </div>
                    <div className="text-[10px] opacity-80 mt-0.5">Holy night, soft falling snow</div>
                  </div>

                  <div className={`p-2 rounded-lg border ${
                    autoDetectedSeason === 'new_year'
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200'
                      : 'bg-slate-50 dark:bg-[#060D1E] border-slate-200/70 dark:border-[#14274C] text-slate-700 dark:text-slate-300'
                  }`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>🎆 New Year {currentYear}</span>
                      <span className="font-mono text-[9.5px] opacity-75">Jan 1 – 15</span>
                    </div>
                    <div className="text-[10px] opacity-80 mt-0.5">Fireworks, champagne &amp; celebratory year</div>
                  </div>
                </div>
              </div>

              {/* Option 2: Manual Previews / Overrides */}
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                  <span>Manual Theme Selection / Previews</span>
                  {seasonMode !== 'auto' && (
                    <button
                      type="button"
                      onClick={() => handleSelectSeasonMode('auto')}
                      className="text-blue-600 dark:text-amber-400 hover:underline cursor-pointer normal-case font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore Auto Mode</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Halloween */}
                  <button
                    type="button"
                    onClick={() => handleSelectSeasonMode('halloween')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      seasonMode === 'halloween'
                        ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 shadow-xs'
                        : 'border-slate-200 dark:border-[#1C3565] hover:bg-slate-50 dark:hover:bg-[#102046] text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span>🎃</span>
                        <span>Halloween Theme</span>
                      </span>
                      {seasonMode === 'halloween' && <Check className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Oct 20 – Nov 30 &bull; Sinister Cemetery, Ghosts &amp; Bats
                    </div>
                  </button>

                  {/* Christmas */}
                  <button
                    type="button"
                    onClick={() => handleSelectSeasonMode('christmas')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      seasonMode === 'christmas'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-xs'
                        : 'border-slate-200 dark:border-[#1C3565] hover:bg-slate-50 dark:hover:bg-[#102046] text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span>🎄</span>
                        <span>Christmas Theme</span>
                      </span>
                      {seasonMode === 'christmas' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Whole December &bull; Snowfall, Snowman &amp; Trees
                    </div>
                  </button>

                  {/* Christmas Eve */}
                  <button
                    type="button"
                    onClick={() => handleSelectSeasonMode('christmas_eve')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      seasonMode === 'christmas_eve'
                        ? 'border-red-500 bg-red-50/60 dark:bg-red-950/40 text-red-900 dark:text-red-200 shadow-xs'
                        : 'border-slate-200 dark:border-[#1C3565] hover:bg-slate-50 dark:hover:bg-[#102046] text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span>❄️</span>
                        <span>Christmas Eve Theme</span>
                      </span>
                      {seasonMode === 'christmas_eve' && <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Dec 22 – 24 &bull; Holy Night &amp; Snowfall
                    </div>
                  </button>

                  {/* New Year */}
                  <button
                    type="button"
                    onClick={() => handleSelectSeasonMode('new_year')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      seasonMode === 'new_year'
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-xs'
                        : 'border-slate-200 dark:border-[#1C3565] hover:bg-slate-50 dark:hover:bg-[#102046] text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span>🎆</span>
                        <span>New Year {currentYear} Theme</span>
                      </span>
                      {seasonMode === 'new_year' && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Jan 1 – 15 &bull; Fireworks &amp; Champagne
                    </div>
                  </button>

                  {/* Standard (Classic) */}
                  <button
                    type="button"
                    onClick={() => handleSelectSeasonMode('none')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer sm:col-span-2 ${
                      seasonMode === 'none'
                        ? 'border-blue-600 dark:border-amber-400 bg-blue-50/50 dark:bg-amber-400/10 text-slate-900 dark:text-white shadow-xs'
                        : 'border-slate-200 dark:border-[#1C3565] hover:bg-slate-50 dark:hover:bg-[#102046] text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <span>⭐</span>
                        <span>Standard Classic Theme</span>
                      </span>
                      {seasonMode === 'none' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Disables seasonal holiday decorations &bull; Classic high-contrast Navy &amp; Gold design
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE SHEET SETTINGS */}
          {activeTab === 'sheet' && (
            <form onSubmit={handleConnect} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{success}</span>
                </div>
              )}

              <div>
                <label htmlFor="modal-sheet-url-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Google Sheet Link or Spreadsheet ID
                </label>
                <input
                  id="modal-sheet-url-input"
                  type="text"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/1zJGQYdRbqcD.../edit"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-[#1C3565] rounded-lg bg-white dark:bg-[#081229] text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-amber-400/30"
                />
              </div>

              <div>
                <label htmlFor="modal-sheet-tab-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-amber-400" />
                  <span>Sheet Tab Name</span>
                </label>
                <input
                  id="modal-sheet-tab-input"
                  type="text"
                  required
                  value={tabInput}
                  onChange={(e) => setTabInput(e.target.value)}
                  placeholder="e.g., Project Tracker or Sheet1"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-[#1C3565] rounded-lg bg-white dark:bg-[#081229] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-amber-400/30"
                />
              </div>

              {/* Current Active Sheet Info */}
              <div className="p-3 bg-slate-50 dark:bg-[#060D1E] rounded-xl border border-slate-200 dark:border-[#1C3565] text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Current Target:</span>
                  <a
                    href={config.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 dark:text-amber-300 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>{config.spreadsheetTitle || config.sheetName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">
                  ID: {config.spreadsheetId}
                </div>
              </div>

              {/* Sheet Tab Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1C3565]">
                <button
                  type="button"
                  id="reset-default-sheet-btn"
                  onClick={handleResetDefault}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors py-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Sheet to Default</span>
                </button>

                <button
                  type="submit"
                  id="save-sheet-connection-btn"
                  disabled={isLoading}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  <span>{isLoading ? 'Verifying...' : 'Save & Connect'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Global Footer */}
        <div className="flex items-center justify-end px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-[#1C3565] bg-slate-50/60 dark:bg-[#081229]/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#102046] dark:hover:bg-[#162C5C] rounded-lg transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

