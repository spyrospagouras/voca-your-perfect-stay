import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInDays } from "date-fns";
import { el } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface AvailabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  pricePerNight: number;
}

const AvailabilityModal = ({
  open,
  onOpenChange,
  listingId,
  pricePerNight,
}: AvailabilityModalProps) => {
  const [range, setRange] = useState<DateRange | undefined>();

  // Fetch blocked dates
  const { data: blockedDates } = useQuery({
    queryKey: ["availability", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability")
        .select("date, is_blocked")
        .eq("listing_id", listingId)
        .eq("is_blocked", true);
      if (error) throw error;
      return (data ?? []).map((d) => new Date(d.date));
    },
    enabled: open,
  });

  const nights = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    return differenceInDays(range.to, range.from);
  }, [range]);

  const total = nights * pricePerNight;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-base font-bold text-foreground">
            Επιλέξτε ημερομηνίες
          </DialogTitle>
        </DialogHeader>

        <div className="px-3 pb-2 flex justify-center">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            locale={el}
            disabled={[{ before: new Date() }, ...(blockedDates ?? [])]}
            numberOfMonths={1}
            className="pointer-events-auto"
          />
        </div>

        {/* Summary */}
        <div className="px-5 pb-5 space-y-3">
          {nights > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                €{pricePerNight} × {nights} {nights === 1 ? "νύχτα" : "νύχτες"}
              </span>
              <span className="font-semibold text-foreground">€{total}</span>
            </div>
          )}

          <button
            disabled={nights === 0}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md disabled:opacity-50 active:scale-[0.97] transition-transform"
          >
            {nights > 0
              ? `Κράτηση · €${total}`
              : "Επιλέξτε ημερομηνίες"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;
