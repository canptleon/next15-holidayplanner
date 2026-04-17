"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import MonthBox from "@/components/MonthBox";
import { useI18n } from "@/components/I18nProvider";
import { calculateOptimalVacationPlans } from "@/app/helpers/calculateOptimalVacation";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import "dayjs/locale/tr";

dayjs.extend(dayOfYear);
dayjs.locale("tr");

interface VacationBlock {
  startDate: string;
  endDate: string;
  leaveDaysUsed: string[];
  totalVacationDays: number;
  efficiency: number;
}

interface VacationPlan {
  blocks: VacationBlock[];
  totalVacationDays: number;
  totalLeaveDaysUsed: number;
  efficiency: number;
}

interface Holiday {
  date: string;
  name: string;
  type: string;
}

interface CalendarClientLayoutProps {
  year: number;
  leaveDaysInput: number;
  today: string;
  vacationPlans: VacationPlan[];
  holidayData: Holiday[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateRange(start: string, end: string, lang: string): string {
  const s = dayjs(start).locale(lang);
  const e = dayjs(end).locale(lang);
  if (s.month() === e.month()) return `${s.format("D")}–${e.format("D MMM")}`;
  return `${s.format("D MMM")} – ${e.format("D MMM")}`;
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

interface PlanCardProps {
  plan: VacationPlan;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  effectiveLeaveDays: number;
}

function PlanCard({ plan, index, isSelected, onClick, effectiveLeaveDays }: PlanCardProps) {
  const { t, lang } = useI18n();
  const unusedLeave = effectiveLeaveDays - plan.totalLeaveDaysUsed;

  const effColor =
    plan.efficiency >= 3.5
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
      : plan.efficiency >= 2.5
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
      : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400";

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-xl border-2 p-4
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        ${isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-700"
        }
      `}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold uppercase tracking-widest ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}>
            {t.planLabel} {index + 1}
          </span>
          {index === 0 && (
            <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
              {t.best}
            </span>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">
            {plan.totalVacationDays}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t.daysOff}</div>
        </div>
      </div>

      {/* Block date ranges */}
      <div className="space-y-1 mb-3">
        {plan.blocks.map((block, bi) => (
          <div key={bi} className="flex items-center justify-between text-xs">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {plan.blocks.length > 1 && (
                <span className="text-gray-400 dark:text-gray-500 mr-1">{bi + 1}.</span>
              )}
              {formatDateRange(block.startDate, block.endDate, lang)}
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2 shrink-0">{block.totalVacationDays}{t.daysSuffix}</span>
          </div>
        ))}
      </div>

      {/* Stats footer */}
      <div className="pt-2.5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{plan.totalLeaveDaysUsed}</span>
          {" "}{t.leaveArrow}{" "}
          <span className="text-gray-400 dark:text-gray-500 mx-0.5">→</span>{" "}
          <span className="font-bold text-gray-900 dark:text-white">{plan.totalVacationDays}</span>
          {" "}{t.daysWord}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${effColor}`}>
          {plan.efficiency.toFixed(1)}x
        </span>
      </div>

      {unusedLeave > 0 && (
        <p className="mt-1.5 text-xs text-amber-500 dark:text-amber-400">{t.unusedLeave(unusedLeave)}</p>
      )}
    </button>
  );
}

// ─── Mandatory Month Picker (used inside modal) ────────────────────────────────

interface MandatoryMonthPickerProps {
  year: number;
  today: string;
  monthName: string;
  monthIndex: number;
  days: number;
  startDay: number;
  holidayData: Holiday[];
  selected: Set<string>;
  onToggle: (date: string) => void;
  weekdayLabels: string[];
  maxReached?: boolean;
}

function MandatoryMonthPicker({
  year, today, monthName, monthIndex, days, startDay, holidayData, selected, onToggle, weekdayLabels, maxReached = false,
}: MandatoryMonthPickerProps) {
  const holidayMap = new Map(holidayData.map((h) => [h.date, h]));
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: startDay });

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-600">
      <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 text-center mb-2 tracking-wide uppercase">
        {monthName}
      </h3>
      <div className="grid grid-cols-7 mb-1">
        {weekdayLabels.map((label, idx) => (
          <div
            key={idx}
            className={`text-center text-[9px] font-semibold py-0.5 ${
              idx >= 5 ? "text-blue-400 dark:text-blue-500" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {emptyCells.map((_, i) => <div key={`e${i}`} />)}
        {daysArray.map((day) => {
          const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const holiday = holidayMap.get(dateStr);
          const dow = dayjs(dateStr).day();
          const isWeekend = dow === 0 || dow === 6;
          const isHoliday = !!holiday;
          const isPast = dateStr < today;
          const isSelected = selected.has(dateStr);
          const isSelectable = !isPast && !isWeekend && !isHoliday;
          // When budget is full, unselected future workdays can't be added
          const isBlocked = isSelectable && !isSelected && maxReached;

          let cls = "rounded border text-[9px] sm:text-[10px] flex items-center justify-center w-full aspect-square transition-all duration-100 select-none ";

          if (isPast) {
            cls += "opacity-30 bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 cursor-default text-gray-500";
          } else if (isSelected) {
            cls += "bg-violet-200 dark:bg-violet-700 border-violet-400 dark:border-violet-500 text-violet-900 dark:text-violet-100 font-bold cursor-pointer ring-2 ring-violet-400 ring-offset-1 dark:ring-offset-gray-700";
          } else if (holiday?.type === "full") {
            cls += "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 cursor-default font-semibold";
          } else if (holiday?.type === "half") {
            cls += "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 text-orange-600 dark:text-orange-400 cursor-default";
          } else if (isWeekend) {
            cls += "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-500 dark:text-blue-400 cursor-default";
          } else if (isBlocked) {
            cls += "opacity-40 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 cursor-not-allowed";
          } else {
            cls += "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-300 dark:hover:border-violet-600";
          }

          return (
            <div
              key={day}
              className={cls}
              onClick={() => isSelectable && !isBlocked && onToggle(dateStr)}
              title={holiday?.name}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mandatory Day Picker Modal ────────────────────────────────────────────────

interface MandatoryDayPickerModalProps {
  year: number;
  today: string;
  holidayData: Holiday[];
  initialSelected: string[];
  initialUseFromBudget: boolean;
  leaveDaysInput: number;
  onConfirm: (days: string[], useFromBudget: boolean) => void;
  onCancel: () => void;
}

function MandatoryDayPickerModal({
  year, today, holidayData, initialSelected, initialUseFromBudget, leaveDaysInput, onConfirm, onCancel,
}: MandatoryDayPickerModalProps) {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [useFromBudget, setUseFromBudget] = useState(initialUseFromBudget);

  const toggleDay = (date: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const remainingMonths = useMemo(() => {
    const result = [];
    for (let m = 0; m < 12; m++) {
      const md = dayjs().year(year).month(m);
      const lastDate = `${year}-${String(m + 1).padStart(2, "0")}-${String(md.daysInMonth()).padStart(2, "0")}`;
      if (lastDate < today) continue;
      const startOfMonth = md.startOf("month");
      const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
      result.push({
        monthIndex: m,
        name: md.locale(lang).format("MMMM"),
        days: md.daysInMonth(),
        startDay,
      });
    }
    return result;
  }, [year, today, lang]);

  // "Use from budget" mode: cap at leaveDaysInput
  const atBudgetLimit = useFromBudget && selected.size >= leaveDaysInput;
  const overBudget = useFromBudget && selected.size > leaveDaysInput;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.mandatoryLeaveBtn}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.mandatoryLeaveDesc}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Calendar grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {remainingMonths.map((month) => (
              <MandatoryMonthPicker
                key={month.monthIndex}
                year={year}
                today={today}
                monthName={month.name}
                monthIndex={month.monthIndex}
                days={month.days}
                startDay={month.startDay}
                holidayData={holidayData}
                selected={selected}
                onToggle={toggleDay}
                weekdayLabels={t.weekdayLabels}
                maxReached={atBudgetLimit}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-3 h-3 rounded bg-violet-200 border border-violet-400 flex-shrink-0" />
            <span className={`text-sm font-semibold ${overBudget ? "text-red-500 dark:text-red-400" : atBudgetLimit ? "text-amber-600 dark:text-amber-400" : "text-violet-700 dark:text-violet-400"}`}>
              {selected.size} {t.mandatoryDaysSelected}
              {useFromBudget && (
                <span className="ml-1 font-normal text-gray-400 dark:text-gray-500">
                  (max {leaveDaysInput})
                </span>
              )}
            </span>
          </div>

          <select
            value={useFromBudget ? "yes" : "no"}
            onChange={(e) => setUseFromBudget(e.target.value === "yes")}
            className="flex-1 min-w-[200px] border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm
                       bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="yes">{t.mandatoryUseFromBudget}</option>
            <option value="no">{t.mandatoryNotFromBudget}</option>
          </select>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-sm font-semibold
                         text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150"
            >
              {t.mandatoryCancel}
            </button>
            <button
              onClick={() => onConfirm([...selected], useFromBudget)}
              disabled={overBudget}
              className="px-4 py-2 rounded-xl border-2 border-violet-500 text-sm font-semibold
                         text-white bg-violet-500 hover:bg-violet-600 hover:border-violet-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         active:scale-95 transition-all duration-150"
            >
              {t.mandatoryApply}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default function CalendarClientLayout({
  year,
  leaveDaysInput,
  today,
  vacationPlans,
  holidayData,
}: CalendarClientLayoutProps) {
  const { t, lang } = useI18n();
  const router = useRouter();

  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [mandatoryDays, setMandatoryDays] = useState<string[]>([]);
  const [useFromBudget, setUseFromBudget] = useState(true);
  const [showMandatoryModal, setShowMandatoryModal] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [currentPlans, setCurrentPlans] = useState<VacationPlan[]>(vacationPlans);

  const effectiveLeaveDays = useFromBudget
    ? Math.max(0, leaveDaysInput - mandatoryDays.length)
    : leaveDaysInput;

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const month = dayjs().year(year).month(i);
        const startDay = month.startOf("month").day();
        return {
          name: month.locale(lang).format("MMMM"),
          monthIndex: i,
          days: month.daysInMonth(),
          startDay: startDay === 0 ? 6 : startDay - 1,
        };
      }),
    [year, lang]
  );

  const selectedPlan = currentPlans[selectedPlanIndex] ?? null;

  const { leaveDaysList, vacationBlockDaysList } = useMemo(() => {
    if (!selectedPlan) return { leaveDaysList: [], vacationBlockDaysList: [] };
    const leaveSet: string[] = [];
    const blockSet: string[] = [];
    for (const block of selectedPlan.blocks) {
      block.leaveDaysUsed.forEach((d) => leaveSet.push(d));
      const start = dayjs(block.startDate);
      const span = dayjs(block.endDate).diff(start, "day") + 1;
      for (let i = 0; i < span; i++) {
        blockSet.push(start.add(i, "day").format("YYYY-MM-DD"));
      }
    }
    return { leaveDaysList: leaveSet, vacationBlockDaysList: blockSet };
  }, [selectedPlan]);

  const yearStats = useMemo(() => {
    const totalHolidays = holidayData.filter((h) => h.type === "full").length;
    const totalHalfDays = holidayData.filter((h) => h.type === "half").length;
    const totalWeekends = months.reduce(
      (count, m) =>
        count +
        Array.from({ length: m.days }, (_, i) =>
          dayjs(`${year}-${m.monthIndex + 1}-${i + 1}`).day()
        ).filter((d) => d === 0 || d === 6).length,
      0
    );
    return { totalHolidays, totalHalfDays, totalWeekends };
  }, [year, holidayData, months]);

  const handleMandatoryConfirm = (days: string[], fromBudget: boolean) => {
    setIsRecalculating(true);
    setTimeout(() => {
      const budget = fromBudget
        ? Math.max(0, leaveDaysInput - days.length)
        : leaveDaysInput;

      // Always treat mandatory days as free (like public holidays) so the algorithm
      // bridges around them and never picks them as regular leave days.
      // In "from budget" mode the budget is reduced; in "extra" mode budget stays full —
      // but in both cases mandatory days are free anchors the algorithm can exploit.
      const baseHolidays = holidayData as { date: string; name: string; type: "full" | "half" }[];
      const enrichedHolidays = [
        ...baseHolidays,
        ...days.map((d) => ({ date: d, name: t.mandatoryTooltip, type: "full" as const })),
      ];

      const newPlans = calculateOptimalVacationPlans(
        year,
        budget,
        enrichedHolidays,
        today
      );

      setMandatoryDays(days);
      setUseFromBudget(fromBudget);
      setCurrentPlans(newPlans);
      setSelectedPlanIndex(0);
      setIsRecalculating(false);
      setShowMandatoryModal(false);
    }, 50);
  };

  // ── Legend items ─────────────────────────────────────────────────────────
  const legendItems = [
    ...(mandatoryDays.length > 0
      ? [{ bg: "bg-violet-200 border-violet-400", label: t.legendMandatoryLeave }]
      : []),
    { bg: "bg-emerald-200 border-emerald-400", label: t.legendLeaveDay },
    { bg: "bg-emerald-50 border-emerald-200", label: t.legendVacationBlock },
    { bg: "bg-red-100 border-red-300", label: t.legendPublicHoliday },
    { bg: "bg-orange-100 border-orange-300", label: t.legendHalfDay },
    { bg: "bg-blue-50 border-blue-200", label: t.legendWeekend },
    { bg: "bg-gray-100 border-gray-200 opacity-60", label: t.legendPast },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-gray-50 dark:from-gray-900 dark:to-gray-900">
      {/* ── Top bar ── */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-blue-100 dark:border-gray-700 px-5 py-4">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Title + stats */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.calendarTitle}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {t.calendarSubtitle(currentPlans.length, leaveDaysInput)}
              {" · "}
              <span className="text-red-500 font-medium">{yearStats.totalHolidays}</span>{" "}
              {t.publicHolidays}
              {" · "}
              <span className="text-orange-500 font-medium">{yearStats.totalHalfDays}</span>{" "}
              {t.halfDays}
              {" · "}
              <span className="text-blue-500 font-medium">{yearStats.totalWeekends}</span>{" "}
              {t.weekendDays}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mandatory leave button */}
            <button
              onClick={() => setShowMandatoryModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold
                         active:scale-95 transition-all duration-150
                         ${mandatoryDays.length > 0
                           ? "border-violet-500 bg-violet-500 text-white hover:bg-violet-600 hover:border-violet-600"
                           : "border-violet-200 dark:border-violet-700 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 hover:bg-violet-100 dark:hover:bg-violet-900/50 hover:border-violet-300 dark:hover:border-violet-600"
                         }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              {t.mandatoryLeaveBtn}
              {mandatoryDays.length > 0 && (
                <span className="bg-white/30 rounded-full px-1.5 py-0.5 text-xs font-bold leading-none">
                  {mandatoryDays.length}
                </span>
              )}
            </button>

            {/* Back button */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-blue-200 dark:border-blue-700
                         text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30
                         hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-600
                         active:scale-95 transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              {t.changeLeaveDays}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto flex flex-col xl:flex-row">
        {/* ── Sidebar: plan cards ── */}
        <aside className="xl:w-80 2xl:w-96 xl:sticky xl:top-14 xl:self-start xl:max-h-[calc(100vh-56px)] xl:overflow-y-auto
                          bg-white/70 dark:bg-gray-800/70 border-b xl:border-b-0 xl:border-r border-blue-100 dark:border-gray-700 shrink-0">
          <div className="px-4 py-3 border-b border-blue-100 dark:border-gray-700">
            <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {currentPlans.length} {t.planLabel}{currentPlans.length !== 1 ? "s" : ""}
            </h2>
          </div>

          {/* Cards: horizontal scroll on mobile, vertical on xl */}
          <div className="p-3 flex xl:flex-col flex-row xl:gap-2 gap-2
                          overflow-x-auto xl:overflow-x-visible">
            {currentPlans.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 p-4">No plans found.</p>
            ) : (
              currentPlans.map((plan, i) => (
                <div
                  key={i}
                  className="xl:w-full w-72 shrink-0 animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <PlanCard
                    plan={plan}
                    index={i}
                    isSelected={i === selectedPlanIndex}
                    onClick={() => setSelectedPlanIndex(i)}
                    effectiveLeaveDays={effectiveLeaveDays}
                  />
                </div>
              ))
            )}
          </div>
        </aside>

        {/* ── Main: legend + detail + calendar ── */}
        <main className="flex-1 p-5 min-w-0 relative">
          {/* Loading overlay */}
          {isRecalculating && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recalculating plans…</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mb-5 bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
              {t.legendTitle}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {legendItems.map(({ bg, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded border flex-shrink-0 ${bg}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected plan detail */}
          {selectedPlan && (
            <div className="mb-5 bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 shadow-sm p-4 animate-fade-in-up">
              <div className="flex flex-wrap gap-5">
                {selectedPlan.blocks.map((block, bi) => (
                  <div key={bi} className="flex-1 min-w-[200px]">
                    {selectedPlan.blocks.length > 1 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 font-semibold uppercase tracking-wide">
                        {t.blockLabel(bi + 1)}
                      </p>
                    )}
                    <p className="font-bold text-gray-900 dark:text-white">
                      {formatDateRange(block.startDate, block.endDate, lang)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {block.totalVacationDays} {t.daysWord} ·{" "}
                      {block.leaveDaysUsed.length} {t.leaveUsedLabel} ·{" "}
                      {block.efficiency.toFixed(1)}x {t.effLabel}
                    </p>
                    {block.leaveDaysUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {block.leaveDaysUsed.map((d) => (
                          <span
                            key={d}
                            className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400
                                       px-2 py-0.5 rounded-full font-semibold"
                          >
                            {dayjs(d).locale(lang).format("ddd D MMM")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mandatory days info */}
              {mandatoryDays.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">
                    {t.legendMandatoryLeave}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {[...mandatoryDays].sort().map((d) => (
                      <span
                        key={d}
                        className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400
                                   px-2 py-0.5 rounded-full font-semibold"
                      >
                        {dayjs(d).locale(lang).format("ddd D MMM")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Standalone mandatory days panel (shown when no plan is selected) */}
          {!selectedPlan && mandatoryDays.length > 0 && (
            <div className="mb-5 bg-white dark:bg-gray-800 rounded-xl border border-violet-100 dark:border-violet-800 shadow-sm p-4">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">
                {t.legendMandatoryLeave}
              </p>
              <div className="flex flex-wrap gap-1">
                {[...mandatoryDays].sort().map((d) => (
                  <span
                    key={d}
                    className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400
                               px-2 py-0.5 rounded-full font-semibold"
                  >
                    {dayjs(d).locale(lang).format("ddd D MMM")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Calendar grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {months.map((month) => (
              <MonthBox
                key={month.monthIndex}
                year={year}
                today={today}
                monthName={month.name}
                monthIndex={month.monthIndex}
                days={month.days}
                startDay={month.startDay}
                leaveDays={leaveDaysList}
                vacationBlockDays={vacationBlockDaysList}
                holidayData={holidayData}
                weekdayLabels={t.weekdayLabels}
                mandatoryDays={mandatoryDays}
                leaveDayTooltip={t.leaveDayTooltip}
                mandatoryLeaveTooltip={t.mandatoryTooltip}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Mandatory day picker modal */}
      {showMandatoryModal && (
        <MandatoryDayPickerModal
          year={year}
          today={today}
          holidayData={holidayData}
          initialSelected={mandatoryDays}
          initialUseFromBudget={useFromBudget}
          leaveDaysInput={leaveDaysInput}
          onConfirm={handleMandatoryConfirm}
          onCancel={() => setShowMandatoryModal(false)}
        />
      )}
    </div>
  );
}
