import Image from "next/image";

export const VideoThumbnail = () => {
  return (
    <div className="relative">
      {/* Thumbnail Wrapper */}
      <div className="transitions-all relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={"/placeholder.svg"}
          alt="Thumbnail"
          fill
          className="size-full object-cover"
        />
      </div>

      {/* TODO Video Duration Box */}
      <div></div>
    </div>
  );
};
