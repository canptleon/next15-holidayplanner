export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-blue-100 dark:border-gray-700 py-5 px-4">
      <div className="max-w-screen-2xl mx-auto flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Holiday Planner</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © 2026{" "}
          <a
            href="https://www.ardakeyisoglu.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-150"
          >
            Arda Keyişoğlu
          </a>
          {" · "}All rights reserved.
        </p>
      </div>
    </footer>
  );
}
