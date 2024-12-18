import Link from "next/link";

export default function Header() {
  return (
    <header className="p-4 bg-blue-500 text-white text-center">
      <Link href="/" className="font-bold hover:underline">
        Holiday Planner
      </Link>
    </header>
  );
}
