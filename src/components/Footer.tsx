export default function Footer() {
  return (
    <footer className="bg-white border-t border-blue-100 py-5 px-4">
      <div className="max-w-screen-2xl mx-auto flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-gray-700">Holiday Planner</p>
        <p className="text-xs text-gray-400">
          © 2026{" "}
          <a
            href="https://www.ardakeyisoglu.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-150"
          >
            Arda Keyişoğlu
          </a>
          {" · "}All rights reserved.
        </p>
      </div>
    </footer>
  );
}
