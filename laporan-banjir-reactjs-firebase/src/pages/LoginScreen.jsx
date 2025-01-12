import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setUser, setLoading, setError } from "../redux/AuthSlice";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect } from "react";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading); // Mengambil state loading dari Redux
  const error = useSelector((state) => state.auth.error); // Mengambil error dari Redux

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await axios.post("http://localhost:3000/api/users/login", {
        uid: user.uid,
        email: user.email,
      });

      dispatch(
        setUser({ uid: user.uid, email: user.email, name: user.displayName })
      );

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat Datang di Monitoring Laporan Banjir!",
      });

      navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(setError(error.message));

      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: error.message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  // use Effect for default set loading and setError to null
  useEffect(() => {
    dispatch(setLoading(false));
    dispatch(setError(null));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-cyan-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-600">
          Login
        </h2>
        {error && <p className="text-red-500">{error}</p>} {/* Error display */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Masukkan email anda"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Masukkan password anda"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors"
            disabled={loading} // Disable button saat loading
          >
            {loading ? "Menunggu..." : "Masuk"} {/* Tampilkan loading */}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum Punya Akun?{" "}
            <Link
              to="/register"
              className="text-cyan-600 font-semibold hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
