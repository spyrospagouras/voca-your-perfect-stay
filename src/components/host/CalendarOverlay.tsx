import { useState } from "react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { X, Check, Plus } from "lucide-react";

interface CalendarOverlayProps {
  selectedDates: Date[];
  editPrice: string;
  setEditPrice: (v: string) => void;
  editAvailable: boolean;
  setEditAvailable: (v: boolean) => void;
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
  note: string;
  setNote: (v: string) => void;
}

const CalendarOverlay = ({
  selectedDates,
  editPrice,
  setEditPrice,
  editAvailable,
  setEditAvailable,
  onCancel,
  onSave,
  isSaving,
  note,
  setNote,
}: CalendarOverlayProps) => {
  const [showNote, setShowNote] = useState(false);

  if (selectedDates.length === 0) return null;

  const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const dateLabel =
    sorted.length === 1
      ? format(first, "d MMM", { locale: el })
      : `${format(first, "d MMM", { locale: el })} - ${format(last, "d MMM", { locale: el })}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 pt-2 pointer-events-none">
      <div className="pointer-events-auto max-w-lg mx-auto flex gap-2">
        {/* Left Card – Status */}
        <div className="flex-1 bg-neutral-900 rounded-2xl p-4 flex flex-col justify-between min-h-[160px]">
          <div>
            <button
              onClick={() => setEditAvailable(!editAvailable)}
              className="flex items-center gap-2 mb-2"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  editAvailable ? "bg-emerald-400" : "bg-red-500"
                }`}
              />
              <span className="text-white text-sm font-medium">
                {editAvailable ? "Διαθέσιμο" : "Αποκλείστηκε από εσάς"}
              </span>
            </button>

            {showNote ? (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Γράψτε μια σημείωση..."
                className="w-full bg-neutral-800 text-white text-xs rounded-lg p-2 mt-1 resize-none h-16 border-none outline-none placeholder:text-neutral-500"
              />
            ) : (
              <button
                onClick={() => setShowNote(true)}
                className="text-neutral-400 text-xs underline mt-1"
              >
                Προσθέστε μια σημείωση
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={onCancel}
              className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              <Check className="w-5 h-5 text-neutral-900" />
            </button>
          </div>
        </div>

        {/* Right Card – Pricing */}
        <div className="flex-1 bg-neutral-900 rounded-2xl p-4 flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-neutral-400 text-xs">{dateLabel}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-white text-2xl font-bold">€</span>
              <input
                type="number"
                inputMode="numeric"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="bg-transparent text-white text-2xl font-bold w-20 outline-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="0"
              />
            </div>
            <span className="text-neutral-500 text-[11px] mt-1 block">Έξυπνη τιμολόγηση</span>
          </div>

          <button className="flex items-center gap-1.5 text-neutral-400 text-xs mt-3 hover:text-neutral-300 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            <span>Εξατομικευμένες ρυθμίσεις</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarOverlay;
