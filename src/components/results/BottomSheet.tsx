import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";

interface BottomSheetProps {
  children: ReactNode;
  headerContent: ReactNode;
  /** Height of the collapsed sheet (header + peek of first card) */
  collapsedHeight?: number;
  /** Bottom offset to keep above bottom nav */
  bottomOffset?: number;
}

const BottomSheet = ({
  children,
  headerContent,
  collapsedHeight = 200,
  bottomOffset = 64,
}: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const startY = useRef(0);
  const startTranslate = useRef(0);
  const scrollTop = useRef(0);

  // Full height available = viewport - bottomOffset
  const getMaxHeight = useCallback(
    () => window.innerHeight - bottomOffset,
    [bottomOffset]
  );

  const collapsedTranslateY = useCallback(
    () => getMaxHeight() - collapsedHeight,
    [getMaxHeight, collapsedHeight]
  );

  // Initialize to collapsed
  useEffect(() => {
    setTranslateY(collapsedTranslateY());
  }, [collapsedTranslateY]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // If expanded and content is scrolled, don't intercept
      if (expanded && contentRef.current && contentRef.current.scrollTop > 0) {
        return;
      }
      startY.current = e.touches[0].clientY;
      startTranslate.current = translateY;
      scrollTop.current = contentRef.current?.scrollTop || 0;
      setDragging(true);
    },
    [expanded, translateY]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragging) return;
      const dy = e.touches[0].clientY - startY.current;

      // If expanded and trying to scroll up inside content, let it scroll
      if (expanded && dy < 0 && scrollTop.current > 0) {
        setDragging(false);
        return;
      }

      const newY = Math.max(0, Math.min(startTranslate.current + dy, collapsedTranslateY()));
      setTranslateY(newY);
    },
    [dragging, expanded, collapsedTranslateY]
  );

  const handleTouchEnd = useCallback(() => {
    if (!dragging) return;
    setDragging(false);

    const threshold = collapsedTranslateY() * 0.4;
    if (translateY < threshold) {
      // Snap to expanded
      setTranslateY(0);
      setExpanded(true);
    } else {
      // Snap to collapsed
      setTranslateY(collapsedTranslateY());
      setExpanded(false);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  }, [dragging, translateY, collapsedTranslateY]);

  return (
    <div
      ref={sheetRef}
      className="fixed inset-x-0 z-[1000] md:hidden"
      style={{
        top: 0,
        bottom: `${bottomOffset}px`,
        transform: `translateY(${translateY}px)`,
        transition: dragging ? "none" : "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="h-full bg-card rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden">
        {/* Handle bar */}
        <div className="flex justify-center py-3 shrink-0 cursor-grab">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header content */}
        <div className="px-4 pb-3 shrink-0">{headerContent}</div>

        {/* Scrollable content */}
        <div
          ref={contentRef}
          className={`flex-1 overflow-y-auto px-4 pb-4 ${
            expanded ? "" : "overflow-hidden"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
