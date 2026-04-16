import Days from "./Days";
import dayjs from "dayjs";
import "dayjs/locale/tr";

dayjs.locale("tr");

interface Holiday {
  date: string;
  name: string;
  type: string;
}

interface MonthBoxProps {
  year: number;
  today: string;
  monthName: string;
  monthIndex: number;
  days: number;
  startDay: number;
  leaveDays: string[];
  vacationBlockDays: string[];
  holidayData: Holiday[];
  weekdayLabels: string[];
}

export default function MonthBox({
  year,
  today,
  monthName,
  monthIndex,
  days,
  startDay,
  leaveDays,
  vacationBlockDays,
  holidayData,
  weekdayLabels,
}: MonthBoxProps) {
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: startDay });

  const leaveSet = new Set(leaveDays);
  const blockSet = new Set(vacationBlockDays);

  const holidayMap = new Map<string, Holiday>(
    holidayData.map((h) => [h.date, h])
  );

  return (
    <div className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-xl p-3 shadow-sm
                    hover:shadow-md transition-shadow duration-200 overflow-visible">
      <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 text-center mb-2 tracking-wide">
        {monthName}
      </h2>

      {/* Weekday header */}
      <div className="grid grid-cols-7 mb-1">
        {weekdayLabels.map((label, idx) => (
          <div
            key={idx}
            className={`text-center text-[10px] font-semibold py-0.5 ${
              idx >= 5 ? "text-blue-400 dark:text-blue-500" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px sm:gap-0.5 overflow-visible">
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {daysArray.map((day) => {
          const fullDate = dayjs(
            `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          ).format("YYYY-MM-DD");

          const holiday = holidayMap.get(fullDate);
          const isHoliday = holiday?.type === "full";
          const isHalfDay = holiday?.type === "half";
          const dayOfWeek = dayjs(fullDate).day();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isLeaveDay = leaveSet.has(fullDate);
          const isVacationBlock = blockSet.has(fullDate);
          const isPast = fullDate < today;

          let tooltip: string | undefined;
          if (holiday) {
            tooltip = holiday.name;
          } else if (isLeaveDay) {
            tooltip = "İzin Günü";
          }

          return (
            <Days
              key={day}
              day={day}
              isHoliday={isHoliday ?? false}
              isHalfDay={isHalfDay ?? false}
              isWeekend={isWeekend}
              isLeaveDay={isLeaveDay}
              isVacationBlock={isVacationBlock}
              isPast={isPast}
              tooltip={tooltip}
            />
          );
        })}
      </div>
    </div>
  );
}
