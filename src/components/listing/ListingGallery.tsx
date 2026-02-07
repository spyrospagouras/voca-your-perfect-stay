import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ListingGalleryProps {
  images: string[];
}

const ListingGallery = ({ images }: ListingGalleryProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {images.map((src, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full">
              <div className="aspect-[4/3] bg-muted">
                <img
                  src={src}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image counter badge */}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 bg-foreground/70 backdrop-blur-sm text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
          {current + 1}/{images.length}
        </div>
      )}

      {/* Dots */}
      {images.length > 1 && images.length <= 8 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === current
                  ? "bg-primary-foreground"
                  : "bg-primary-foreground/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingGallery;
