interface DayProps {
  day: number;
  isHoliday: boolean;
  isHalfDay: boolean;
  isWeekend: boolean;
  isHighlighted: boolean;
}

export default function Days({ day, isHoliday, isHalfDay, isWeekend, isHighlighted}: DayProps) {
  let borderClass = "border-gray-300";
  let textClass = "text-gray-900";

  if (isHoliday) {
    borderClass = "border-red-500";
    textClass = "text-red-500";
  } 
  else if (isHighlighted) {
    borderClass = "border-green-500";
    textClass = "text-green-500";
  }
  else if (isHalfDay) {
    borderClass = "border-dashed border-green-500";
    textClass = "text-red-500";
  } 
  else if (isWeekend) {
    borderClass = "border-blue-500";
    textClass = "text-blue-500";
  } 

  return (
    <div className={`border rounded-md w-10 h-10 flex items-center justify-center bg-white shadow-sm ${borderClass} ${textClass}`}>
      {day}
    </div>
  );
}
