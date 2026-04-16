import { redirect } from "next/navigation";
import { Metadata } from "next";
import holidayData from "@/data/static/national-holidays-2026.json";
import { calculateOptimalVacationPlans } from "../../helpers/calculateOptimalVacation";
import CalendarClientLayout from "../../layouts/CalendarClientLayout";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import "dayjs/locale/tr";

dayjs.extend(dayOfYear);
dayjs.locale("tr");

export const metadata: Metadata = {
  title: "Holiday Planner 2026 – Results",
  description: "Optimal leave plans based on your available days",
};

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const resolvedParams = await params;
  const leaveDays = parseInt(resolvedParams.number, 10);

  if (isNaN(leaveDays) || leaveDays < 1 || leaveDays > 30) {
    redirect("/");
  }

  const year = 2026;
  // Today's date as a cutoff — past leave days won't be suggested
  const today = dayjs().format("YYYY-MM-DD");

  const vacationPlans = calculateOptimalVacationPlans(
    year,
    leaveDays,
    // JSON import type is read-only; cast to mutable for the function
    holidayData as { date: string; name: string; type: "full" | "half" }[],
    today
  );

  return (
    <CalendarClientLayout
      year={year}
      leaveDaysInput={leaveDays}
      today={today}
      vacationPlans={vacationPlans}
      holidayData={holidayData}
    />
  );
}
