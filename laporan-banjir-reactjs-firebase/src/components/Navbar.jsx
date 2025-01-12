import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { logout } from "../redux/AuthSlice";
import clearAllReports from "../redux/ReportsSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      dispatch(clearAllReports);
      navigate("/login");
    } catch (error) {
      console.log("Error logging out:" + error);
    }
  };

  return (
    <nav className="bg-cyan-600 border-b border-cyan-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center text-white">
              <span className="text-2xl font-bold">
                Monitoring Laporan Banjir
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${
                  location.pathname === "/"
                    ? "border-white text-white"
                    : "border-transparent text-gray-200"
                }  hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              {user && (
                <Link
                  to="/create-report"
                  className={`${
                    location.pathname === "/create-report"
                      ? "border-white text-white"
                      : "border-transparent text-gray-200"
                  }  hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Buat Laporan
                </Link>
              )}
              {user && (
                <Link
                  to="/user-report"
                  className={`${
                    location.pathname === "/user-report"
                      ? "border-white text-white"
                      : "border-transparent text-gray-200"
                  }  hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Laporan Saya
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <>
                <span className="text-sm text-white mr-4">
                  Selamat Datang, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-white hover:text-gray-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-cyan-600 text-sm font-medium rounded-md hover:bg-gray-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
