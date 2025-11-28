import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image src="/logo.svg" alt="New Tube Logo" width={50} height={50} />
      <p className="text-xl font-semibold tracking-tight">New Tube</p>
    </div>
  );
}
