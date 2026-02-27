import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Settings, ArrowUp } from "lucide-react";
import { format, addMonths, startOfMonth, getDaysInMonth, getDay, isSameDay, isBefore, startOfDay } from "date-fns";
import { el } from "date-fns/locale";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

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

  // Fetch listing for title & default price
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

  // Fetch availability entries for next 12 months
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

  // Build lookup map
  const availMap = useMemo(() => {
    const map = new Map<string, AvailabilityEntry>();
    availabilityData?.forEach((e) => map.set(e.date, e));
    return map;
  }, [availabilityData]);

  // Generate months
  const months = useMemo(() => {
    const arr = [];
    for (let i = 0; i < MONTHS_TO_SHOW; i++) {
      arr.push(addMonths(startOfMonth(today), i));
    }
    return arr;
  }, []);

  // Selected date + drawer
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editPrice, setEditPrice] = useState("");
  const [editAvailable, setEditAvailable] = useState(true);

  const openDrawer = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    const entry = availMap.get(key);
    setSelectedDate(date);
    setEditPrice(
      entry?.price != null
        ? String(entry.price)
        : listing?.price_per_night != null
        ? String(listing.price_per_night)
        : ""
    );
    setEditAvailable(entry ? !entry.is_blocked : true);
    setDrawerOpen(true);
  };

  // Upsert mutation
  const upsertMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDate || !id) return;
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const priceNum = editPrice ? parseFloat(editPrice) : null;

      const { error } = await supabase
        .from("availability")
        .upsert(
          {
            listing_id: id,
            date: dateStr,
            price: priceNum,
            is_blocked: !editAvailable,
          },
          { onConflict: "listing_id,date" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability-calendar", id] });
      setDrawerOpen(false);
      toast.success("Ενημερώθηκε!");
    },
    onError: () => toast.error("Σφάλμα κατά την αποθήκευση"),
  });

  // Scroll to today on mount
  useEffect(() => {
    setTimeout(() => todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
  }, []);

  const scrollToToday = useCallback(() => {
    todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const defaultPrice = listing?.price_per_night;

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

      {/* Day headers - sticky */}
      <div className="sticky top-[57px] z-20 bg-background border-b border-border px-4">
        <div className="grid grid-cols-7 gap-1">
          {DAY_NAMES.map((d, i) => (
            <div key={i} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
        </div>
      </div>

      {/* Scrollable months */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {months.map((monthStart) => {
          const year = monthStart.getFullYear();
          const month = monthStart.getMonth();
          const daysInMonth = getDaysInMonth(monthStart);
          const firstDayOfWeek = (getDay(monthStart) + 6) % 7; // Mon=0
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
                  const isBlocked = entry?.is_blocked === true;
                  const price = entry?.price ?? defaultPrice;
                  const isToday = isSameDay(date, today);
                  const isPast = isBefore(date, today);

                  return (
                    <div
                      key={i}
                      ref={isToday ? todayRef : undefined}
                      onClick={() => !isPast && openDrawer(date)}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-colors relative cursor-pointer ${
                        isPast ? "opacity-30 cursor-default" : "hover:bg-muted"
                      } ${isToday ? "ring-2 ring-destructive" : ""}`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          isToday
                            ? "bg-destructive text-destructive-foreground w-7 h-7 rounded-full flex items-center justify-center"
                            : "text-foreground"
                        } ${isBlocked ? "line-through text-muted-foreground" : ""}`}
                      >
                        {day}
                      </span>
                      {price != null && (
                        <span
                          className={`text-[10px] mt-0.5 ${
                            isBlocked
                              ? "line-through text-muted-foreground/60"
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

      {/* Floating Today Button */}
      <div className="fixed bottom-6 right-4 z-40">
        <button
          onClick={scrollToToday}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-full shadow-lg hover:bg-foreground/90 transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
          <span className="text-sm font-medium">Σήμερα</span>
        </button>
      </div>

      {/* Edit Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-w-lg mx-auto">
          <DrawerHeader>
            <DrawerTitle>
              {selectedDate ? format(selectedDate, "EEEE, d MMMM yyyy", { locale: el }) : ""}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-6 space-y-5 pb-2">
            {/* Price */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Τιμή (€)</label>
              <Input
                type="number"
                inputMode="numeric"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder={defaultPrice != null ? `Προεπιλογή: €${defaultPrice}` : "Τιμή"}
                className="text-lg"
              />
            </div>
            {/* Availability toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Διαθέσιμο</span>
              <Switch checked={editAvailable} onCheckedChange={setEditAvailable} />
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={() => upsertMutation.mutate()}
              disabled={upsertMutation.isPending}
              className="w-full"
            >
              {upsertMutation.isPending ? "Αποθήκευση..." : "Αποθήκευση"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default EditCalendar;
