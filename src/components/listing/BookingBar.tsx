import { useNavigate } from "react-router-dom";

interface BookingBarProps {
  price: number;
  listingId: string;
}

const BookingBar = ({ price, listingId }: BookingBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border px-4 py-3 safe-bottom">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div>
          <span className="text-base font-semibold text-foreground">€{price}</span>
          <span className="text-sm text-muted-foreground"> / νύχτα</span>
        </div>
        <button
          onClick={() => {
            // Future: navigate to booking flow
          }}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-[hsl(349,90%,50%)] text-primary-foreground font-semibold text-sm shadow-md active:scale-[0.97] transition-transform"
        >
          Κράτηση
        </button>
      </div>
    </div>
  );
};

export default BookingBar;
