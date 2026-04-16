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
  let bgClass = "bg-white";
  let textClass = "text-gray-700";
  let borderClass = "border-gray-200";
  let fontClass = "";
  let ringClass = "";

  if (isLeaveDay) {
    bgClass = "bg-emerald-200";
    textClass = "text-emerald-900";
    borderClass = "border-emerald-400";
    fontClass = "font-bold";
    ringClass = "ring-2 ring-emerald-400 ring-offset-1";
  } else if (isHoliday) {
    bgClass = isVacationBlock ? "bg-red-100" : "bg-red-50";
    textClass = "text-red-700";
    borderClass = "border-red-300";
    fontClass = "font-semibold";
  } else if (isHalfDay) {
    bgClass = isVacationBlock ? "bg-orange-100" : "bg-orange-50";
    textClass = "text-orange-700";
    borderClass = "border-orange-300";
  } else if (isWeekend) {
    bgClass = isVacationBlock ? "bg-blue-100" : "bg-blue-50";
    textClass = "text-blue-600";
    borderClass = "border-blue-200";
  } else if (isVacationBlock) {
    bgClass = "bg-emerald-50";
    textClass = "text-emerald-800";
    borderClass = "border-emerald-200";
  }

  // Past-day overlay: dim everything, no ring
  const pastClass = isPast ? "opacity-35 cursor-default" : "";
  const hoverClass = isPast
    ? ""
    : "hover:scale-110 hover:z-10 hover:shadow-md cursor-default";

  return (
    <div className="relative group/day">
      <div
        className={`
          border rounded-md w-8 h-8 flex items-center justify-center text-xs
          transition-all duration-150 select-none relative
          ${bgClass} ${textClass} ${borderClass} ${fontClass} ${ringClass}
          ${pastClass} ${hoverClass}
        `}
      >
        {day}
      </div>

      {/* Tooltip — only shown when there's content and day is not past */}
      {tooltip && !isPast && (
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
            px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium
            rounded-lg shadow-lg whitespace-nowrap pointer-events-none
            opacity-0 group-hover/day:opacity-100
            -translate-y-1 group-hover/day:translate-y-0
            transition-all duration-150 delay-200
          "
        >
          {tooltip}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
