import Link from 'next/link';
import Github from './GitHub';

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full border-b-2 py-2 px-2">
      <Link href="/" className="flex space-x-3">
        <img
          alt="header text"
          src="/tourbuddy_logo.png"
          className="h-12"
        />
      </Link>
      {/* <a
        className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100"
        href="https://github.com/Nutlope/twitterbio"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contact
      </a> */}
    </header>
  );
}
