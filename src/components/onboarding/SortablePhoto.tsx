import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Props {
  url: string;
  index: number;
  onDelete: (url: string) => void;
}

const SortablePhoto = ({ url, index, onDelete }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: url });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isFirst = index === 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl overflow-hidden ${
        isFirst ? "col-span-2 aspect-[4/3]" : "aspect-square"
      }`}
    >
      <div {...attributes} {...listeners} className="w-full h-full cursor-grab active:cursor-grabbing">
        <img src={url} alt="" className="w-full h-full object-cover" />
      </div>

      {isFirst && (
        <span className="absolute top-3 left-3 bg-background text-foreground text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
          Φωτογραφία εξωφύλλου
        </span>
      )}

      <div className="absolute top-2 right-2" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="w-7 h-7 rounded-full bg-background shadow-sm flex items-center justify-center hover:bg-accent transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-foreground" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-9 bg-background border border-border rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
            <button
              onClick={() => {
                onDelete(url);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
            >
              Διαγραφή
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortablePhoto;
