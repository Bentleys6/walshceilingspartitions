import { useState } from "react";
import { images, type ImageKey } from "@/data/images";

type Props = {
  name: ImageKey;
  className?: string;
  /** Load straight away (above the fold) instead of lazily. */
  eager?: boolean;
  /** Rendered width hint for the browser to pick from srcSet, e.g. "(min-width: 768px) 33vw, 100vw". */
  sizes?: string | undefined;
  alt?: string;
};

/**
 * Image from src/data/images.ts. Width/height are set so the page doesn't jump while photos load,
 * and a "photo to be supplied" placeholder shows if the file is missing.
 */
export function Img({ name, className = "", eager, sizes, alt }: Props) {
  const image = images[name];
  const [failed, setFailed] = useState(false);
  if (failed) {
    const file = image.src.split("/").pop();
    return (
      <div
        role="img"
        aria-label={alt ?? image.alt}
        className={`flex items-center justify-center bg-placeholder p-4 text-center text-sm text-muted-foreground ${className}`}
      >
        {file} — photo to be supplied
      </div>
    );
  }
  const srcSet = "srcSet" in image ? image.srcSet : undefined;
  return (
    <img
      src={image.src}
      srcSet={srcSet}
      sizes={srcSet ? (sizes ?? "100vw") : undefined}
      alt={alt ?? image.alt}
      width={image.width}
      height={image.height}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding={eager ? "sync" : "async"}
      fetchPriority={eager ? "high" : undefined}
      onError={() => setFailed(true)}
    />
  );
}
