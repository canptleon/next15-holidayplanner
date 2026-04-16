"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import MonthBox from "@/components/MonthBox";
import { useI18n } from "@/components/I18nProvider";
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

function formatDateRange(start: string, end: string): string {
  const s = dayjs(start);
  const e = dayjs(end);
  if (s.month() === e.month()) return `${s.format("D")}–${e.format("D MMM")}`;
  return `${s.format("D MMM")} – ${e.format("D MMM")}`;
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

interface PlanCardProps {
  plan: VacationPlan;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  leaveDaysInput: number;
}

function PlanCard({ plan, index, isSelected, onClick, leaveDaysInput }: PlanCardProps) {
  const { t } = useI18n();
  const unusedLeave = leaveDaysInput - plan.totalLeaveDaysUsed;

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
              {formatDateRange(block.startDate, block.endDate)}
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2 shrink-0">{block.totalVacationDays}g</span>
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

  const selectedPlan = vacationPlans[selectedPlanIndex] ?? null;

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

  // ── Legend items ─────────────────────────────────────────────────────────
  const legendItems = [
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
              {t.calendarSubtitle(vacationPlans.length, leaveDaysInput)}
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

      <div className="max-w-screen-2xl mx-auto flex flex-col xl:flex-row">
        {/* ── Sidebar: plan cards ── */}
        <aside className="xl:w-80 2xl:w-96 xl:sticky xl:top-14 xl:self-start xl:max-h-[calc(100vh-56px)] xl:overflow-y-auto
                          bg-white/70 dark:bg-gray-800/70 border-b xl:border-b-0 xl:border-r border-blue-100 dark:border-gray-700 shrink-0">
          <div className="px-4 py-3 border-b border-blue-100 dark:border-gray-700">
            <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {vacationPlans.length} Plan
            </h2>
          </div>

          {/* Cards: horizontal scroll on mobile, vertical on xl */}
          <div className="p-3 flex xl:flex-col flex-row xl:gap-2 gap-2
                          overflow-x-auto xl:overflow-x-visible">
            {vacationPlans.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 p-4">No plans found.</p>
            ) : (
              vacationPlans.map((plan, i) => (
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
                    leaveDaysInput={leaveDaysInput}
                  />
                </div>
              ))
            )}
          </div>
        </aside>

        {/* ── Main: legend + detail + calendar ── */}
        <main className="flex-1 p-5 min-w-0">
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
                      {formatDateRange(block.startDate, block.endDate)}
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
                            {dayjs(d).format("ddd D MMM")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
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
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
