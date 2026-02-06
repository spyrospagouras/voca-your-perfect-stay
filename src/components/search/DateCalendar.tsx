import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAY_NAMES = ["Δ", "Τ", "Τ", "Π", "Π", "Σ", "Κ"];
const MONTH_NAMES = [
  "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος",
  "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος",
];

interface DateCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onSelect: (start: Date | null, end: Date | null) => void;
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const DateCalendar = ({ startDate, endDate, onSelect }: DateCalendarProps) => {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Monday-based: 0=Mon, 6=Sun
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const cells = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [viewMonth, viewYear, daysInMonth, firstDayOfWeek]);

  const handleDayClick = (day: number) => {
    const clicked = new Date(viewYear, viewMonth, day);
    if (!startDate || (startDate && endDate)) {
      onSelect(clicked, null);
    } else {
      if (clicked < startDate) {
        onSelect(clicked, startDate);
      } else if (isSameDay(clicked, startDate)) {
        onSelect(clicked, clicked);
      } else {
        onSelect(startDate, clicked);
      }
    }
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d > startDate && d < endDate;
  };

  const isStart = (day: number) => startDate && isSameDay(new Date(viewYear, viewMonth, day), startDate);
  const isEnd = (day: number) => endDate && isSameDay(new Date(viewYear, viewMonth, day), endDate);
  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-base font-semibold text-foreground">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const past = isPast(day);
          const start = isStart(day);
          const end = isEnd(day);
          const inRange = isInRange(day);

          return (
            <div
              key={i}
              className={`relative flex items-center justify-center ${
                inRange ? "bg-muted" : ""
              } ${start && endDate ? "rounded-l-full bg-muted" : ""} ${end ? "rounded-r-full bg-muted" : ""}`}
            >
              <button
                onClick={() => !past && handleDayClick(day)}
                disabled={past}
                className={`w-10 h-10 text-sm font-medium rounded-full flex items-center justify-center transition-colors ${
                  start || end
                    ? "bg-foreground text-background"
                    : past
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DateCalendar;
