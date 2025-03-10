import Image from "next/image";

interface PlaceholderImageProps {
  title: string;
  wrapper: string;
  sizes?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ title, wrapper, sizes }) => {
  return (
    <div className={wrapper}>
      <Image
        src="/placeholder.png"
        alt={title}
        fill
        sizes={sizes || "(max-width: 768px) 100vw, 50vw"} // Valor padrão caso `sizes` não seja passado
        className="object-cover"
        priority
      />
    </div>
  );
};

export default PlaceholderImage;
