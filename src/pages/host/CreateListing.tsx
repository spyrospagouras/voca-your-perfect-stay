import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const CreateListing = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [hostType, setHostType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !price || !hostType) {
      toast({
        title: "Συμπληρώστε όλα τα πεδία",
        description: "Όλα τα υποχρεωτικά πεδία πρέπει να συμπληρωθούν.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate saving (no backend)
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast({
      title: "Επιτυχία!",
      description: "Η καταχώρησή σας δημοσιεύτηκε με επιτυχία.",
    });

    setIsSubmitting(false);
    navigate("/host/listings");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button
          onClick={() => navigate("/host/menu")}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">
          Νέα καταχώρηση
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Τίτλος Καταλύματος</Label>
          <Input
            id="title"
            placeholder="π.χ. Stivari View"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Τοποθεσία</Label>
          <Input
            id="location"
            placeholder="π.χ. Αθήνα, Ελλάδα"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Τιμή (€)</Label>
          <Input
            id="price"
            type="number"
            min="1"
            max="99999"
            placeholder="150"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Φωτογραφία (URL)</Label>
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            maxLength={500}
          />
        </div>

        <div className="space-y-2">
          <Label>Τύπος Οικοδεσπότη</Label>
          <Select value={hostType} onValueChange={setHostType}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Επιλέξτε τύπο" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="professional">
                Επαγγελματίας οικοδεσπότης
              </SelectItem>
              <SelectItem value="private">Ιδιώτης</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Preview */}
        {imageUrl && (
          <div className="space-y-2">
            <Label>Προεπισκόπηση</Label>
            <div className="rounded-xl overflow-hidden border border-border aspect-video">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full rounded-full h-12 text-base font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Δημοσίευση..." : "Δημοσίευση"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
