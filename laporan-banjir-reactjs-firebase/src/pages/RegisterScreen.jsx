import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { setUser, setLoading, setError } from "../redux/AuthSlice";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect } from "react";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const { user } = userCredential;

      if (user) {
        await updateProfile(user, { displayName: name });
      }

      console.log("User:", user);

      await axios.post("http://localhost:3000/api/users/register", {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      });

      Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil",
        text: "Silahkan login untuk melanjutkan",
      });

      navigate("/login");

      dispatch(setUser({ uid: user.uid, email, name }));
    } catch (error) {
      console.error("Error occurred:", error.message);
      dispatch(setError(error.message));
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Silahkan coba lagi",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    dispatch(setLoading(false));
    dispatch(setError(null));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-cyan-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-600">
          Daftar Akun
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Masukkan nama anda"
              required
            />
          </div>
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
            disabled={loading}
          >
            {loading ? "Loading..." : "Daftar"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-cyan-600 font-semibold hover:underline"
            >
              Login disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
