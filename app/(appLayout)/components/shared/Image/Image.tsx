import { Image } from "next-sanity/image";
import { urlFor } from "@/sanity/lib/image";

type Props = {
  asset: any | null;
  priority?: boolean;
  className?: string;
};

const CustomImage = (props: Props) => {
  const { asset, priority = false, className = "" } = props;

  if (!asset) return null;

  const { width, height } = asset.metadata?.dimensions || {
    width: 1000,
    height: 1000,
  };

  const src = urlFor(asset)?.auto("format").url();

  if (asset?._id) {
    return (
      <Image
        sizes="100vw"
        src={src}
        alt={""}
        width={width}
        height={height}
        priority={priority}
        className={className}
      />
    );
  } else {
    return <div style={{ paddingBottom: "100%" }}> Image not found</div>;
  }
};

export default CustomImage;
