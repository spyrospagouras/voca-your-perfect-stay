import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Settings, ArrowUp } from "lucide-react";
import { format, addMonths, startOfMonth, getDaysInMonth, getDay, isSameDay, isBefore, startOfDay, eachDayOfInterval } from "date-fns";
import { el } from "date-fns/locale";
import { toast } from "sonner";
import CalendarOverlay from "@/components/host/CalendarOverlay";

const DAY_NAMES = ["Δ", "Τ", "Τ", "Π", "Π", "Σ", "Κ"];

interface AvailabilityEntry {
  date: string;
  price: number | null;
  is_blocked: boolean | null;
}

const EditCalendar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const todayRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());
  const MONTHS_TO_SHOW = 12;

  const { data: listing } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("title, price_per_night")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: availabilityData } = useQuery({
    queryKey: ["availability-calendar", id],
    queryFn: async () => {
      const from = format(today, "yyyy-MM-dd");
      const to = format(addMonths(today, MONTHS_TO_SHOW), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("availability")
        .select("date, price, is_blocked")
        .eq("listing_id", id!)
        .gte("date", from)
        .lte("date", to);
      if (error) throw error;
      return data as AvailabilityEntry[];
    },
    enabled: !!id,
  });

  const availMap = useMemo(() => {
    const map = new Map<string, AvailabilityEntry>();
    availabilityData?.forEach((e) => map.set(e.date, e));
    return map;
  }, [availabilityData]);

  const months = useMemo(() => {
    const arr = [];
    for (let i = 0; i < MONTHS_TO_SHOW; i++) {
      arr.push(addMonths(startOfMonth(today), i));
    }
    return arr;
  }, []);

  // Multi-selection state
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editAvailable, setEditAvailable] = useState(true);
  const [note, setNote] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const isSelected = useCallback(
    (date: Date) => selectedDates.some((d) => isSameDay(d, date)),
    [selectedDates]
  );

  const handleDayClick = (date: Date) => {
    if (!rangeStart) {
      // First click – start selection
      setRangeStart(date);
      setSelectedDates([date]);
      // Initialize overlay values from this date
      const key = format(date, "yyyy-MM-dd");
      const entry = availMap.get(key);
      setEditPrice(
        entry?.price != null
          ? String(entry.price)
          : listing?.price_per_night != null
          ? String(listing.price_per_night)
          : ""
      );
      setEditAvailable(entry ? !entry.is_blocked : false);
      setBlockReason(entry?.is_blocked ? "Αποκλείστηκε από εσάς" : "");
      setNote("");
    } else {
      // Second click – create range
      const start = rangeStart < date ? rangeStart : date;
      const end = rangeStart < date ? date : rangeStart;
      const range = eachDayOfInterval({ start, end });
      setSelectedDates(range);
      setRangeStart(null); // Allow next click to start fresh
    }
  };

  const clearSelection = () => {
    setSelectedDates([]);
    setRangeStart(null);
    setNote("");
    setBlockReason("");
  };

  // Bulk upsert mutation
  const upsertMutation = useMutation({
    mutationFn: async () => {
      if (selectedDates.length === 0 || !id) return;
      const priceNum = editPrice ? parseFloat(editPrice) : null;

      const rows = selectedDates.map((d) => ({
        listing_id: id,
        date: format(d, "yyyy-MM-dd"),
        price: priceNum,
        is_blocked: !editAvailable,
      }));

      const { error } = await supabase
        .from("availability")
        .upsert(rows, { onConflict: "listing_id,date" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability-calendar", id] });
      clearSelection();
      toast.success("Ενημερώθηκε!");
    },
    onError: () => toast.error("Σφάλμα κατά την αποθήκευση"),
  });

  useEffect(() => {
    setTimeout(() => todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
  }, []);

  const scrollToToday = useCallback(() => {
    todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const defaultPrice = listing?.price_per_night;
  const hasSelection = selectedDates.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground truncate max-w-[200px]">
            {listing?.title ?? "..."}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Calendar className="w-5 h-5 text-foreground" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="sticky top-[57px] z-20 bg-background border-b border-border px-4">
        <div className="grid grid-cols-7 gap-1">
          {DAY_NAMES.map((d, i) => (
            <div key={i} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
        </div>
      </div>

      {/* Scrollable months */}
      <div className={`flex-1 overflow-y-auto px-4 ${hasSelection ? "pb-52" : "pb-24"}`}>
        {months.map((monthStart) => {
          const year = monthStart.getFullYear();
          const month = monthStart.getMonth();
          const daysInMonth = getDaysInMonth(monthStart);
          const firstDayOfWeek = (getDay(monthStart) + 6) % 7;
          const cells: (number | null)[] = [];
          for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
          for (let d = 1; d <= daysInMonth; d++) cells.push(d);

          return (
            <div key={`${year}-${month}`} className="mt-6">
              <h2 className="text-base font-semibold text-foreground mb-3 capitalize">
                {format(monthStart, "LLLL yyyy", { locale: el })}
              </h2>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                  if (day === null) return <div key={i} />;
                  const date = new Date(year, month, day);
                  const dateKey = format(date, "yyyy-MM-dd");
                  const entry = availMap.get(dateKey);
                  // Default: blocked unless explicitly opened (is_blocked === false)
                  const isOpen = entry?.is_blocked === false;
                  const isBlocked = !isOpen;
                  const price = entry?.price ?? defaultPrice;
                  const isToday = isSameDay(date, today);
                  const isPast = isBefore(date, today);
                  const selected = isSelected(date);

                  let inRange = false;
                  if (selectedDates.length >= 2) {
                    const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
                    inRange = date >= sorted[0] && date <= sorted[sorted.length - 1] && !selected;
                  }

                  return (
                    <div
                      key={i}
                      ref={isToday ? todayRef : undefined}
                      onClick={() => !isPast && handleDayClick(date)}
                      className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-colors relative cursor-pointer ${
                        isPast ? "opacity-30 cursor-default" : ""
                      } ${isToday && !selected ? "ring-2 ring-destructive" : ""} ${
                        selected
                          ? "bg-foreground border-foreground"
                          : inRange
                          ? "bg-muted border-border"
                          : isOpen
                          ? "bg-white dark:bg-background border-border"
                          : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold ${
                          selected
                            ? "text-background"
                            : isToday
                            ? "bg-destructive text-destructive-foreground w-7 h-7 rounded-full flex items-center justify-center"
                            : isBlocked
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {day}
                      </span>
                      {price != null && !selected && (
                        <span
                          className={`text-[10px] mt-0.5 ${
                            isBlocked
                              ? "text-muted-foreground/60"
                              : entry?.price != null && entry.price !== defaultPrice
                              ? "text-primary font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          €{price}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Footer Buttons – hide when overlay is visible */}
      {!hasSelection && (
        <>
          <div className="fixed bottom-6 left-4 z-40">
            <button
              onClick={scrollToToday}
              className="flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-full shadow-lg hover:bg-foreground/90 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">Σήμερα</span>
            </button>
          </div>
          <div className="fixed bottom-6 right-4 z-40">
            <button
              onClick={() => navigate(`/host/edit/${id}`)}
              className="flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-full shadow-lg hover:bg-foreground/90 transition-colors"
            >
              <span className="text-sm font-medium">Επόμενο</span>
            </button>
          </div>
        </>
      )}

      {/* Floating Bottom Overlay */}
      <CalendarOverlay
        selectedDates={selectedDates}
        editPrice={editPrice}
        setEditPrice={setEditPrice}
        editAvailable={editAvailable}
        setEditAvailable={setEditAvailable}
        onCancel={clearSelection}
        onSave={() => upsertMutation.mutate()}
        isSaving={upsertMutation.isPending}
        note={note}
        setNote={setNote}
        blockReason={blockReason}
      />
    </div>
  );
};

export default EditCalendar;
