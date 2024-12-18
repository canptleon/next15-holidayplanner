"use client";

import { useEffect, useState } from "react";
import Analytics from "@/components/Analytics";
import MonthBox from "@/components/MonthBox";
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
}

interface VacationPlan {
  blocks: VacationBlock[];
}

interface Holiday {
  date: string;
  name: string;
  type: string;
}

interface CalendarClientLayoutProps {
  year: number;
  vacationPlans: VacationPlan[];
  holidayData: Holiday[];
}

export default function CalendarClientLayout({
  year,
  vacationPlans,
  holidayData,
}: CalendarClientLayoutProps) {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [highlightedDays, setHighlightedDays] = useState<string[]>([]);
  const [months, setMonths] = useState<
    { name: string; monthIndex: number; days: number; startDay: number }[]
  >([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalDays: 0,
    totalHolidays: 0,
    totalHalfDays: 0,
    totalWeekends: 0,
  });

  useEffect(() => {
    const calculatedMonths = Array.from({ length: 12 }, (_, i) => {
      const month = dayjs().year(year).month(i);
      const startDay = month.startOf("month").day();
      const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
      return {
        name: month.format("MMMM"),
        monthIndex: i,
        days: month.daysInMonth(),
        startDay: adjustedStartDay,
      };
    });

    const totalDays = dayjs(`${year}-12-31`).dayOfYear();
    const totalHolidays = holidayData.filter(
      (holiday) => holiday.type === "full"
    ).length;
    const totalHalfDays = holidayData.filter(
      (holiday) => holiday.type === "half"
    ).length;
    const totalWeekends = calculatedMonths.reduce((count, month) => {
      return (
        count +
        Array.from({ length: month.days }, (_, i) =>
          dayjs(`${year}-${month.monthIndex + 1}-${i + 1}`).day()
        ).filter((day) => day === 6 || day === 0).length
      );
    }, 0);

    setMonths(calculatedMonths);
    setAnalyticsData({
      totalDays,
      totalHolidays,
      totalHalfDays,
      totalWeekends,
    });
  }, [year, holidayData]);

  useEffect(() => {
    const plan = vacationPlans[selectedPlanIndex];
    const newHighlightedDays = plan?.blocks.flatMap((block) => block.leaveDaysUsed) || [];
    setHighlightedDays(newHighlightedDays);
  }, [selectedPlanIndex, vacationPlans]);

  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-bold mb-6">
        Holiday Opportunities for {vacationPlans.length} Plans
      </h1>
      <div className="mb-6">
        <Analytics {...analyticsData} />
      </div>
      <div className="mb-6">
        <label htmlFor="plan-select" className="mr-4 text-lg font-medium">
          Tatil Planı Seçin:
        </label>
        <select
          id="plan-select"
          value={selectedPlanIndex}
          onChange={(e) => setSelectedPlanIndex(Number(e.target.value))}
          className="p-2 border rounded-lg"
        >
          {vacationPlans.map((_, index) => (
            <option key={index} value={index}>
              Plan {index + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {months.map((month, index) => (
          <MonthBox
            key={index}
            monthName={month.name}
            monthIndex={month.monthIndex}
            days={month.days}
            startDay={month.startDay}
            highlightedDays={highlightedDays}
          />
        ))}
      </div>
    </div>
  );
}
