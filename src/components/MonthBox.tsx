import Days from "./Days";
import holidayData from "@/data/static/national-holidays.json";
import dayjs from "dayjs";
import "dayjs/locale/tr";
dayjs.locale("tr");

interface MonthBoxProps {
  monthName: string;
  monthIndex: number;
  days: number;
  startDay: number;
  highlightedDays: string[];
}

export default function MonthBox({
  monthName,
  monthIndex,
  days,
  startDay,
  highlightedDays,
}: MonthBoxProps) {
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const weekdays = ["P", "S", "Ç", "P", "C", "C", "P"];
  const emptyCells = Array.from({ length: startDay }, () => null);

  return (
    <div className="border rounded-lg p-4 text-black bg-blue-100 shadow w-full md:w-48 lg:w-80">
      <h2 className="text-lg font-bold mb-2 text-center">{monthName}</h2>
      <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-700 mb-2">
        {weekdays.map((weekday, index) => (
          <div key={`${monthIndex}-${weekday}-${index}`}>{weekday}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for padding */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`}></div>
        ))}

        {/* Calendar days */}
        {daysArray.map((day) => {
          const fullDate = dayjs(
            `2025-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          ).format("YYYY-MM-DD");

          const holiday = holidayData.find((holiday) => holiday.date === fullDate);
          const isHoliday = holiday?.type === "full";
          const isHalfDay = holiday?.type === "half";
          const dayOfWeek = dayjs(fullDate).day();
          const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
          const isHighlighted = highlightedDays.includes(fullDate);

          return (
            <Days
              key={day}
              day={day}
              isHoliday={isHoliday}
              isHalfDay={isHalfDay}
              isWeekend={isWeekend}
              isHighlighted={isHighlighted}
            />
          );
        })}
      </div>
    </div>
  );
}
