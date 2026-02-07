import { MapPin } from "lucide-react";

const CenterPin = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
    <div className="relative -mt-6">
      <MapPin className="w-8 h-8 text-primary drop-shadow-lg" fill="hsl(349, 100%, 59%)" />
    </div>
  </div>
);

export default CenterPin;
