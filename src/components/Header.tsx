import React from 'react';
import { Camera, Search, LogIn, LogOut } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

interface HeaderProps {
  onUploadClick: () => void;
}

export function Header({ onUploadClick }: HeaderProps) {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-800">Realist</h1>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for real photos..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={onUploadClick}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-colors"
              >
                Upload Photo
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="relative group">
                  <button className="text-gray-700 hover:text-gray-900">
                    {user?.name}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block">
                    <button
                      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}