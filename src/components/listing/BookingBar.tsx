interface BookingBarProps {
  price: number;
  listingId: string;
}

const BookingBar = ({ price, listingId }: BookingBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border px-5 py-3 safe-bottom">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div>
          <span className="text-base font-bold text-foreground">€{price}</span>
          <span className="text-sm text-muted-foreground"> συνολικά</span>
        </div>
        <button
          onClick={() => {
            // Future: booking flow
          }}
          className="px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md active:scale-[0.97] transition-transform"
        >
          Κράτηση
        </button>
      </div>
    </div>
  );
};

export default BookingBar;
