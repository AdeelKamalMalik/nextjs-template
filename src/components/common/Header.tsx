import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Adjust the import path as needed
import Image from 'next/image';
import Link from 'next/link';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleLogout = () => {
    // Clear the user token from local storage or cookies
    localStorage.removeItem('jwt');
    // Redirect to the login page
    window.location.href = '/auth/signin'; // Using window.location.href for a full redirect
  };

  return (
    <header className="flex justify-between items-center bg-white shadow-md p-2">
      <div className="flex items-center">
        <Link href="/" className="mr-2">
          <Image src="/images/logo.png" alt="Logo" width={100} height={60} className="cursor-pointer" />
        </Link>
        <h1 className="text-xl font-semibold">Blog Site</h1>
      </div>

      {currentUser && (
        <div className="flex items-center">
          {/* Create New Blog Button */}
          <Link
            href="/blogs/create"
            className="mr-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            + Create New Blog
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center focus:outline-none"
            >
              {/* Display First and Last Name */}
              <div className="mr-3 text-gray-700">
                <span className="font-medium">{currentUser.firstName}</span> <span>{currentUser.lastName}</span>
              </div>

              {/* Avatar */}
              {currentUser?.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">{currentUser?.username?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <ul>
                  <li>
                    <Link href="/profile" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
