"use client";

import {
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
  UserButton,
} from "@clerk/nextjs";

const Dashboard = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Verificar si el usuario tiene el rol de ADMIN
  const isAdmin = user?.publicMetadata?.role === "ADMIN";

  const firstName = user?.firstName || "User"; // Usar "User" como valor predeterminado si no hay nombre

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 py-4 shadow-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <div className="flex items-center gap-4">
            <SignedIn>
              <div className="flex items-center gap-2">
                <SignOutButton redirectUrl="/">
                  <div className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition cursor-pointer">
                    Sign Out
                  </div>
                </SignOutButton>
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition">
                Sign In
              </button>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">
          Welcome to your Dashboard, {firstName}!
        </h2>
        <p className="text-lg text-gray-400 mb-4">
          This is your main control panel. Manage your account and settings
          here.
        </p>

        {/* Section for Admins Only */}
        {isAdmin ? (
          <div className="bg-gray-800 rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-2">Admin Section</h3>
            <p className="text-gray-400">
              This section is visible only to admins.
            </p>
            {/* Testing admin functionality */}
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition">
              Admin Action
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
            <p className="text-gray-400">
              You do not have access to the admin section. Contact your
              administrator.
            </p>
          </div>
        )}

        {/* Regular Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p className="text-gray-400">
              Update your personal information and preferences.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-400">
              View detailed stats about your account activity.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Settings</h3>
            <p className="text-gray-400">
              Customize your account settings and preferences.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-4">
        <div className="container mx-auto px-6 text-center text-gray-400">
          © {new Date().getFullYear()} My Dashboard. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
