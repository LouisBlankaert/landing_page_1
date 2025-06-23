import Image from "next/image";

interface Photo {
  src: string;
  alt: string;
}

interface PhotoGridProps {
  photos: Photo[];
  columns?: number;
  rows?: number;
}

export function PhotoGrid({ photos, columns = 4, rows = 2 }: PhotoGridProps) {
  // Limiter le nombre de photos à afficher en fonction des lignes et colonnes
  const limitedPhotos = photos.slice(0, columns * rows);
  
  return (
    <div 
      className="grid gap-4 w-full"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
    >
      {limitedPhotos.map((photo, index) => (
        <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
