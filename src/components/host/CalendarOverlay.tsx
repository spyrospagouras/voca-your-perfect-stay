import { useState, useEffect } from "react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { X, Check, Plus, Pencil, Square, CheckSquare } from "lucide-react";

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
  blockReason?: string;
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
  blockReason,
}: CalendarOverlayProps) => {
  const [showNote, setShowNote] = useState(false);
  const [visible, setVisible] = useState(false);

  const isOpen = selectedDates.length > 0;

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      setShowNote(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const dateLabel =
    sorted.length === 1
      ? format(first, "d MMM", { locale: el })
      : `${format(first, "d", { locale: el })}-${format(last, "d MMM", { locale: el })}`;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 pt-2 pointer-events-none"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.25s ease",
      }}
    >
      <div className="pointer-events-auto max-w-lg mx-auto flex gap-2">
        {/* Left Card – Status */}
        <div className="flex-1 bg-neutral-900 rounded-2xl p-4 flex flex-col justify-between min-h-[200px]">
          <div>
            {/* Status indicator */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  editAvailable ? "bg-emerald-400" : "bg-red-500"
                }`}
              />
              <span className="text-white text-[13px] font-medium leading-tight">
                {editAvailable ? "Διαθέσιμο" : "Μη διαθέσιμο"}
              </span>
            </div>

            {/* Note section */}
            {showNote ? (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Γράψτε μια σημείωση..."
                className="w-full bg-neutral-800 text-white text-xs rounded-lg p-2 mb-3 resize-none h-14 border-none outline-none placeholder:text-neutral-500"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setShowNote(true)}
                className="flex items-center gap-1.5 mb-3 hover:opacity-80 transition-opacity"
              >
                <Pencil className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-400 text-xs underline">Προσθέστε μια σημείωση</span>
              </button>
            )}

            {/* Availability checkboxes */}
            <button
              onClick={() => setEditAvailable(true)}
              className="flex items-center gap-2 w-full py-1.5 hover:opacity-80 transition-opacity"
            >
              {editAvailable ? (
                <CheckSquare className="w-4 h-4 text-white" />
              ) : (
                <Square className="w-4 h-4 text-neutral-500" />
              )}
              <span className={`text-xs ${editAvailable ? "text-white font-medium" : "text-neutral-400"}`}>
                Άνοιγμα Διαθεσιμότητας
              </span>
            </button>

            <button
              onClick={() => setEditAvailable(false)}
              className="flex items-center gap-2 w-full py-1.5 hover:opacity-80 transition-opacity"
            >
              {!editAvailable ? (
                <CheckSquare className="w-4 h-4 text-white" />
              ) : (
                <Square className="w-4 h-4 text-neutral-500" />
              )}
              <span className={`text-xs ${!editAvailable ? "text-white font-medium" : "text-neutral-400"}`}>
                Κλείσιμο Διαθεσιμότητας
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={onCancel}
              className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 active:scale-95 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50"
            >
              <Check className="w-5 h-5 text-neutral-900" />
            </button>
          </div>
        </div>

        {/* Right Card – Pricing */}
        <div className="flex-1 bg-neutral-900 rounded-2xl p-4 flex flex-col justify-between min-h-[170px]">
          <div>
            <span className="text-neutral-400 text-xs font-medium">{dateLabel}</span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-white text-3xl font-bold">€</span>
              <input
                type="number"
                inputMode="numeric"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="bg-transparent text-white text-3xl font-bold w-24 outline-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="0"
              />
            </div>
            <span className="text-neutral-500 text-[11px] mt-1.5 block">Έξυπνη τιμολόγηση</span>
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
