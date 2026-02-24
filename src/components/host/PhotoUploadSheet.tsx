import { useRef } from "react";
import { X, Image as ImageIcon, Camera } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface PhotoUploadSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesSelected: (files: FileList) => void;
}

const PhotoUploadSheet = ({
  open,
  onOpenChange,
  onFilesSelected,
}: PhotoUploadSheetProps) => {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onFilesSelected(e.target.files);
      onOpenChange(false);
    }
    e.target.value = "";
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-lg mx-auto">
        <DrawerHeader className="flex items-center justify-between px-5 pt-4 pb-2">
          <DrawerTitle className="sr-only">Προσθήκη φωτογραφίας</DrawerTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Κλείσιμο"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </DrawerHeader>

        <div className="px-5 pb-8 space-y-3">
          {/* Upload from device */}
          <button
            onClick={() => galleryRef.current?.click()}
            className="w-full flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Ανεβάστε φωτογραφίες από τη συσκευή σας
              </p>
            </div>
          </button>

          {/* Take photo */}
          <button
            onClick={() => cameraRef.current?.click()}
            className="w-full flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <Camera className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Λήψη φωτογραφίας
              </p>
            </div>
          </button>
        </div>

        {/* Hidden inputs */}
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFiles}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default PhotoUploadSheet;
