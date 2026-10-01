import React from 'react';
import {
  ArrowRight,
  FileSpreadsheet,
  Sparkles,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import lightBlueHeroImg from '../assets/images/light_blue_hero_1790694964629.jpg';
import blueParserImg from '../assets/images/blue_parser_card_1790694984016.jpg';
import blueSheetImg from '../assets/images/blue_sheet_card_1790695001866.jpg';
import heroImg from '../assets/images/hero_banner_transport_1790102708525.jpg';
import { FIXED_SPREADSHEET_URL } from '../lib/sheetsApi';
import { useTheme } from '../context/ThemeContext';

interface HeroBannerProps {
  onLogPsuClick: () => void;
  onExploreSheetClick: () => void;
  onUploadClick: () => void;
  onViewRevisionsClick: () => void;
  appsScriptConnected: boolean;
  sheetUrl?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onLogPsuClick,
  onExploreSheetClick,
  onUploadClick,
  onViewRevisionsClick,
  appsScriptConnected,
  sheetUrl,
}) => {
  const { season, currentYear } = useTheme();
  return (
    <section
      className={`relative w-full overflow-hidden text-slate-900 dark:text-white border-b transition-colors duration-300 ${
        season !== 'none'
          ? 'bg-transparent border-white/10 dark:border-white/10'
          : 'bg-gradient-to-br from-sky-50 via-blue-50/70 to-indigo-50/40 dark:from-[#060D1E] dark:via-[#091530] dark:to-[#0B1A3D] border-blue-100/80 dark:border-[#1C3565]'
      }`}
    >
      {/* 1. Full Background Image with Integrated Multi-stop Fading Gradients (Visible ONLY when no Holiday theme is active) */}
      {season === 'none' ? (
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <img
            src={lightBlueHeroImg}
            alt="PSU Tracking Operations Desk"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 opacity-35 dark:opacity-15 filter contrast-105"
          />

          {/* Horizontal Gradient Overlay: Clean luminous soft blue fade for high readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-sky-50/85 to-blue-100/40 dark:from-[#060D1E]/95 dark:via-[#091530]/90 dark:to-[#0B1A3D]/70" />

          {/* Ambient Top Subtle Vignette */}
          <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/60 dark:from-[#060D1E]/60 to-transparent" />

          {/* Bottom Seamless Gradient Fade: Melts directly into page canvas */}
          <div className="absolute bottom-0 inset-x-0 h-40 sm:h-56 bg-gradient-to-b from-transparent via-[#F4F7FB]/70 dark:via-[#060D1E]/70 to-[#F4F7FB] dark:to-[#060D1E]" />
        </div>
      ) : (
        /* Subtle atmospheric ambient glow for Holiday themes */
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
        </div>
      )}

      {/* Top Editorial Ribbon */}
      <div
        className={`relative z-10 backdrop-blur-md px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase border-b shadow-2xs transition-colors ${
          season !== 'none'
            ? 'bg-black/40 text-white border-white/10'
            : 'bg-white/85 dark:bg-[#0B1736]/90 text-blue-900 dark:text-amber-400 border-blue-100 dark:border-[#1C3565]'
        }`}
      >
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-amber-400 animate-pulse" />
          <span className={`font-extrabold ${
            season !== 'none' ? 'text-white drop-shadow-sm' : 'text-slate-900 dark:text-white'
          }`}>
            PRECISION TRAFFIC LOGISTICS &bull; ASIA PACIFIC
          </span>
          <span className={`hidden md:inline font-bold ${
            season !== 'none' ? 'text-amber-300/90' : 'text-blue-700 dark:text-amber-400'
          }`}>
            &bull; REAL-TIME REVISION DISPATCH
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] border ${
              season !== 'none'
                ? 'bg-black/50 border-white/20 text-white'
                : 'bg-blue-50 dark:bg-[#102046] border-blue-200/80 dark:border-amber-400/30 text-blue-900 dark:text-amber-300 font-semibold'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${appsScriptConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {appsScriptConnected ? 'API SYNCHRONIZED' : 'API STANDBY'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 sm:pb-28">
        <div className="max-w-2xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase shadow-2xs border ${
                  season !== 'none'
                    ? 'bg-black/50 text-white border-white/20 backdrop-blur-md'
                    : 'bg-blue-100/90 dark:bg-amber-950/40 text-blue-900 dark:text-amber-300 border border-blue-200 dark:border-amber-400/40'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>PSU TRACKING AUTOMATION</span>
              </div>

              {season !== 'none' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 text-amber-300 border border-amber-400/50 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-md animate-pulse backdrop-blur-md">
                  {season === 'halloween' && <span>🎃 HALLOWEEN SPECIAL EDITION</span>}
                  {season === 'christmas' && <span>🎄 CHRISTMAS HOLIDAY EDITION</span>}
                  {season === 'christmas_eve' && <span>❄️ CHRISTMAS EVE EDITION</span>}
                  {season === 'new_year' && <span>🎆 HAPPY NEW YEAR {currentYear}</span>}
                </div>
              )}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[0.98] uppercase">
              <span className={season !== 'none' ? 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]' : 'text-slate-900 dark:text-white'}>
                PROJECT LOGISTIC
              </span>
              <br />
              <span
                className={
                  season === 'halloween'
                    ? 'text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]'
                    : season === 'christmas' || season === 'christmas_eve'
                    ? 'text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]'
                    : season === 'new_year'
                    ? 'text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]'
                    : 'text-blue-600 dark:text-amber-400'
                }
              >
                AND TRACKER
              </span>
            </h1>

            <div
              className={`w-14 h-1.5 rounded-full mt-4 mb-3 ${
                season === 'halloween'
                  ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]'
                  : season === 'christmas' || season === 'christmas_eve'
                  ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                  : season === 'new_year'
                  ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                  : 'bg-blue-600 dark:bg-amber-400'
              }`}
            />

            <p
              className={`text-sm sm:text-base leading-relaxed font-normal max-w-lg ${
                season !== 'none'
                  ? 'text-slate-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Instant Outlook email extraction (.msg &amp; .eml), automated multi-project recognition, and direct real-time synchronization to your Google Sheet.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-log-psu-btn"
              type="button"
              onClick={onLogPsuClick}
              className={`px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-all shadow-md active:scale-[0.98] flex items-center gap-2 group cursor-pointer ${
                season === 'halloween'
                  ? 'bg-orange-600 hover:bg-orange-500 text-slate-950 font-extrabold shadow-orange-500/30'
                  : season === 'christmas' || season === 'christmas_eve'
                  ? 'bg-red-600 hover:bg-red-500 text-white font-extrabold shadow-red-500/30'
                  : season === 'new_year'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-amber-500/30'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 dark:font-extrabold text-white shadow-blue-500/25 dark:shadow-amber-500/25'
              }`}
            >
              <span>LOG PSU NOW</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              id="hero-explore-sheet-btn"
              type="button"
              onClick={onExploreSheetClick}
              className={`px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-all shadow-2xs active:scale-[0.98] flex items-center gap-2 cursor-pointer backdrop-blur-md ${
                season !== 'none'
                  ? 'bg-black/50 hover:bg-black/70 text-white border border-white/20'
                  : 'bg-white hover:bg-blue-50/80 dark:bg-[#0B1736] dark:hover:bg-[#102046] text-blue-900 dark:text-amber-300 border border-blue-200 hover:border-blue-300 dark:border-amber-400/40'
              }`}
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${season !== 'none' ? 'text-amber-400' : 'text-blue-600 dark:text-amber-400'}`} />
              <span>EXPLORE LIVE SHEET</span>
            </button>
          </div>

          {/* Quick Micro Status Badges */}
          <div
            className={`pt-2 flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider ${
              season !== 'none' ? 'text-slate-200 drop-shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% OCR ACCURACY</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>ZERO-LATENCY SYNC</span>
            </div>
          </div>
        </div>

        {/* Floating Module Cards Over the Gradient Transition */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Outlook Email Parser */}
          <div
            onClick={onUploadClick}
            className={`group cursor-pointer backdrop-blur-md p-4 sm:p-5 rounded-2xl transition-all flex items-center gap-4 shadow-sm hover:shadow-md ${
              season !== 'none'
                ? 'bg-black/45 hover:bg-black/60 border border-white/15 hover:border-amber-400/50 text-white'
                : 'bg-white/95 hover:bg-white dark:bg-[#0B1736]/90 dark:hover:bg-[#102046] border border-blue-100 hover:border-blue-300 dark:border-[#1C3565] dark:hover:border-amber-400/50 text-slate-900 dark:text-white'
            }`}
          >
            <div className={`w-16 h-20 sm:w-18 sm:h-22 rounded-xl overflow-hidden shrink-0 border ${
              season !== 'none' ? 'border-white/10 bg-black/40' : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/40'
            }`}>
              <img
                src={blueParserImg}
                alt="Outlook Email Parser"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                season !== 'none' ? 'text-amber-400' : 'text-blue-600 dark:text-amber-400'
              }`}>
                MODULE 01
              </div>
              <h3 className={`font-display font-bold text-sm sm:text-base uppercase tracking-tight transition-colors ${
                season !== 'none'
                  ? 'text-white group-hover:text-amber-300'
                  : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-400'
              }`}>
                EMAIL &amp; PDF PARSER
              </h3>
              <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                season !== 'none' ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
              }`}>
                Automated extraction of projects, schedules &amp; targeted Page 1 OCR crop.
              </p>
              <div className={`mt-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform ${
                season !== 'none' ? 'text-amber-400' : 'text-blue-600 dark:text-amber-400'
              }`}>
                <span>START PARSING</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Card 2: Live Sheet Mirror */}
          <div
            onClick={onExploreSheetClick}
            className={`group cursor-pointer backdrop-blur-md p-4 sm:p-5 rounded-2xl transition-all flex items-center gap-4 shadow-sm hover:shadow-md ${
              season !== 'none'
                ? 'bg-black/45 hover:bg-black/60 border border-white/15 hover:border-amber-400/50 text-white'
                : 'bg-white/95 hover:bg-white dark:bg-[#0B1736]/90 dark:hover:bg-[#102046] border border-blue-100 hover:border-blue-300 dark:border-[#1C3565] dark:hover:border-amber-400/50 text-slate-900 dark:text-white'
            }`}
          >
            <div className={`w-16 h-20 sm:w-18 sm:h-22 rounded-xl overflow-hidden shrink-0 border ${
              season !== 'none' ? 'border-white/10 bg-black/40' : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/40'
            }`}>
              <img
                src={blueSheetImg}
                alt="Google Sheet Mirror"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                season !== 'none' ? 'text-amber-400' : 'text-blue-600 dark:text-amber-400'
              }`}>
                MODULE 02
              </div>
              <h3 className={`font-display font-bold text-sm sm:text-base uppercase tracking-tight transition-colors ${
                season !== 'none'
                  ? 'text-white group-hover:text-amber-300'
                  : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-400'
              }`}>
                GOOGLE SHEET MIRROR
              </h3>
              <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                season !== 'none' ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
              }`}>
                Direct 13-column bidirectional Apps Script reflection with instant metrics.
              </p>
              <div className={`mt-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform ${
                season !== 'none' ? 'text-amber-400' : 'text-blue-600 dark:text-amber-400'
              }`}>
                <span>OPEN MIRROR</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Card 3: Re-PSU & Revision Monitor */}
          <div
            onClick={onViewRevisionsClick}
            className={`group cursor-pointer backdrop-blur-md p-4 sm:p-5 rounded-2xl transition-all flex items-center gap-4 shadow-sm hover:shadow-md ${
              season !== 'none'
                ? 'bg-black/45 hover:bg-black/60 border border-white/15 hover:border-amber-400/50 text-white'
                : 'bg-white/95 hover:bg-white dark:bg-[#0B1736]/90 dark:hover:bg-[#102046] border border-blue-100 hover:border-blue-300 dark:border-[#1C3565] dark:hover:border-amber-400/50 text-slate-900 dark:text-white'
            }`}
          >
            <div className={`w-16 h-20 sm:w-18 sm:h-22 rounded-xl overflow-hidden shrink-0 border ${
              season !== 'none' ? 'border-white/10 bg-black/40' : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/40'
            }`}>
              <img
                src={heroImg}
                alt="Re-PSU Revision Engine"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-bottom filter contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                season !== 'none' ? 'text-amber-400' : 'text-blue-600 dark:text-amber-400'
              }`}>
                MODULE 03
              </div>
              <h3 className={`font-display font-bold text-sm sm:text-base uppercase tracking-tight transition-colors ${
                season !== 'none'
                  ? 'text-white group-hover:text-amber-300'
                  : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-400'
              }`}>
                RE-PSU &amp; AUDIT LOGS
              </h3>
              <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                season !== 'none' ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
              }`}>
                Smart version tracking (Initial, v1, v2+) with automated revision validation.
              </p>
              <div className={`mt-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform ${
                season !== 'none' ? 'text-amber-400' : 'text-blue-600 dark:text-amber-400'
              }`}>
                <span>VIEW REVISIONS</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
