interface DayProps {
  day: number;
  isHoliday: boolean;
  isHalfDay: boolean;
  isWeekend: boolean;
  isLeaveDay: boolean;
  isVacationBlock: boolean;
  isPast: boolean;
  tooltip?: string;
}

export default function Days({
  day,
  isHoliday,
  isHalfDay,
  isWeekend,
  isLeaveDay,
  isVacationBlock,
  isPast,
  tooltip,
}: DayProps) {
  // ── Colour priority ─────────────────────────────────────────────
  // leave day > holiday > half-day > weekend > vacation-block > default
  let bgClass = "bg-white dark:bg-gray-700";
  let textClass = "text-gray-700 dark:text-gray-300";
  let borderClass = "border-gray-200 dark:border-gray-600";
  let fontClass = "";
  let ringClass = "";

  if (isLeaveDay) {
    bgClass = "bg-emerald-200 dark:bg-emerald-700";
    textClass = "text-emerald-900 dark:text-emerald-100";
    borderClass = "border-emerald-400 dark:border-emerald-500";
    fontClass = "font-bold";
    ringClass = "ring-2 ring-emerald-400 dark:ring-emerald-500 ring-offset-1 dark:ring-offset-gray-800";
  } else if (isHoliday) {
    bgClass = isVacationBlock ? "bg-red-100 dark:bg-red-900/50" : "bg-red-50 dark:bg-red-900/30";
    textClass = "text-red-700 dark:text-red-400";
    borderClass = "border-red-300 dark:border-red-700";
    fontClass = "font-semibold";
  } else if (isHalfDay) {
    bgClass = isVacationBlock ? "bg-orange-100 dark:bg-orange-900/50" : "bg-orange-50 dark:bg-orange-900/30";
    textClass = "text-orange-700 dark:text-orange-400";
    borderClass = "border-orange-300 dark:border-orange-700";
  } else if (isWeekend) {
    bgClass = isVacationBlock ? "bg-blue-100 dark:bg-blue-900/50" : "bg-blue-50 dark:bg-blue-900/20";
    textClass = "text-blue-600 dark:text-blue-400";
    borderClass = "border-blue-200 dark:border-blue-700";
  } else if (isVacationBlock) {
    bgClass = "bg-emerald-50 dark:bg-emerald-900/20";
    textClass = "text-emerald-800 dark:text-emerald-300";
    borderClass = "border-emerald-200 dark:border-emerald-700";
  }

  const pastClass = isPast ? "opacity-35 cursor-default" : "";
  const hoverClass = isPast
    ? ""
    : "hover:scale-110 hover:z-10 hover:shadow-md cursor-default";

  return (
    <div className="relative group/day">
      <div
        className={`
          border rounded-md w-full aspect-square flex items-center justify-center text-[10px] sm:text-xs
          transition-all duration-150 select-none relative
          ${bgClass} ${textClass} ${borderClass} ${fontClass} ${ringClass}
          ${pastClass} ${hoverClass}
        `}
      >
        {day}
      </div>

      {/* Tooltip */}
      {tooltip && !isPast && (
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
            px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium
            rounded-lg shadow-lg whitespace-nowrap pointer-events-none
            opacity-0 group-hover/day:opacity-100
            -translate-y-1 group-hover/day:translate-y-0
            transition-all duration-150 delay-200
          "
        >
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
}
