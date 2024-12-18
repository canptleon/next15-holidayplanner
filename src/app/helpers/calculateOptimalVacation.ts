import dayjs from "dayjs";
import holidayData from "@/data/static/national-holidays.json";

interface Holiday {
  date: string;
  name: string;
  type: "full" | "half";
}

export interface VacationBlock {
  startDate: string;
  endDate: string;
  leaveDaysUsed: string[];
  totalVacationDays: number;
}

export interface VacationPlan {
  blocks: VacationBlock[];
  totalVacationDays: number;
}

export function calculateOptimalVacationPlans(year: number, leaveDays: number): VacationPlan[] {
  const allDays = Array.from({ length: 365 }, (_, i) =>
    dayjs(`${year}-01-01`).add(i, "day")
  );

  const weekends = allDays.filter((date) => [6, 0].includes(date.day()));
  const holidays: Holiday[] = holidayData.map((holiday) => {
    if (holiday.type === "full" || holiday.type === "half") {
      return holiday as Holiday;
    } else {
      throw new Error(`Invalid holiday type: ${holiday.type}`);
    }
  });

  const vacationPlans: VacationPlan[] = [];

  for (let i = 0; i < 10; i++) {
    let remainingLeaveDays = leaveDays;
    const blocks: VacationBlock[] = [];
    const usedDays = new Set<string>();

    for (const holiday of holidays) {
      if (remainingLeaveDays <= 0) break;

      const usedLeaveDays: string[] = [];
      const vacationDays: dayjs.Dayjs[] = [];
      let tempLeaveDays = remainingLeaveDays;

      for (let offset = -2; offset <= 2; offset++) {
        const currentDay = dayjs(holiday.date).add(offset, "day");
        const formattedDay = currentDay.format("YYYY-MM-DD");

        if (usedDays.has(formattedDay) || currentDay.year() !== year) continue;

        const isWeekend = weekends.some((d) => d.isSame(currentDay));
        const isHoliday = holidays.some((holiday) =>
          dayjs(holiday.date).isSame(currentDay, "day")
        );
        const isHalfDay = holidays.find((holiday) => {
          const holidayDate = dayjs(holiday.date);
          return holidayDate.isSame(currentDay, "day") && holiday.type === "half";
        });

        if (isHalfDay) {
          const nextDay = currentDay.add(1, "day").format("YYYY-MM-DD");
          if (usedLeaveDays.includes(nextDay)) {
            usedLeaveDays.push(formattedDay);
          }
        }

        if (!isWeekend && !isHoliday) {
          if (tempLeaveDays > 0) {
            usedLeaveDays.push(formattedDay);
            tempLeaveDays--;
          } else {
            break;
          }
        }

        vacationDays.push(currentDay);
        usedDays.add(formattedDay);
      }

      if (vacationDays.length > 1) {
        const startDate = vacationDays[0].format("YYYY-MM-DD");
        const endDate = vacationDays[vacationDays.length - 1].format("YYYY-MM-DD");

        blocks.push({
          startDate,
          endDate,
          leaveDaysUsed: usedLeaveDays,
          totalVacationDays: vacationDays.length,
        });

        remainingLeaveDays -= usedLeaveDays.length;
      }
    }

    if (blocks.length > 0) {
      const totalVacationDays = blocks.reduce(
        (sum, block) => sum + block.totalVacationDays,
        0
      );

      vacationPlans.push({
        blocks,
        totalVacationDays,
      });
    }
  }

  return vacationPlans.sort((a, b) => b.totalVacationDays - a.totalVacationDays);
}
