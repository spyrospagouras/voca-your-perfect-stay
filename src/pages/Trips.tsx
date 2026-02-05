import { Map } from "lucide-react";

const Trips = () => {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-4">Ταξίδια</h1>
      
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Map className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Δεν υπάρχουν κρατήσεις
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Όταν κλείσετε ένα ταξίδι, θα εμφανιστεί εδώ
        </p>
      </div>
    </div>
  );
};

export default Trips;
