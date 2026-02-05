import { useState } from "react";
import { Calendar, Settings, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";

const daysOfWeek = ["Δ", "Τ", "Τ", "Π", "Π", "Σ", "Κ"];

const monthNames = [
  "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος",
  "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος",
  "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
];

// Generate prices for demo
const generatePrices = () => {
  const prices: Record<number, number> = {};
  for (let i = 1; i <= 31; i++) {
    prices[i] = Math.floor(Math.random() * 100) + 100; // €100-€200
  }
  return prices;
};

const HostCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prices] = useState(generatePrices);
  
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and total days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={goToPrevMonth} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">
            {monthNames[currentMonth]} {currentYear}
          </h1>
          <button onClick={goToNextMonth} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Calendar className="w-5 h-5 text-foreground" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            className={`aspect-square p-1 flex flex-col items-center justify-center rounded-lg transition-colors ${
              day ? "hover:bg-muted" : ""
            } ${isToday(day!) ? "bg-primary text-primary-foreground" : ""}`}
            disabled={!day}
          >
            {day && (
              <>
                <span className={`text-sm font-medium ${isToday(day) ? "text-primary-foreground" : "text-foreground"}`}>
                  {day}
                </span>
                <span className={`text-[10px] ${isToday(day) ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  €{prices[day]}
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Floating Today Button */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={goToToday}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-full shadow-lg hover:bg-foreground/90 transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
          <span className="text-sm font-medium">Σήμερα</span>
        </button>
      </div>
    </div>
  );
};

export default HostCalendar;
