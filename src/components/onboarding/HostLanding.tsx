import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/host-landing-hero.jpg";

interface Props {
  onStart: () => void;
}

const HostLanding = ({ onStart }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
        aria-label="Επιστροφή στην αρχική"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {/* Hero image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Beautiful villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 justify-end p-6 pb-12 max-w-lg mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          Ανοίξτε την πόρτα σας στη φιλοξενία
        </h1>
        <p className="text-lg text-white/80 mb-8 leading-relaxed">
          Βγάλτε έσοδα μοιράζοντας τον χώρο σας με εκατομμύρια επισκέπτες στη VOCA.
        </p>
        <button
          onClick={onStart}
          className="w-full h-14 rounded-lg bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(349,100%,50%)] text-white font-semibold text-base transition-transform active:scale-[0.98]"
        >
          Ξεκινήστε
        </button>
      </div>
    </div>
  );
};

export default HostLanding;
