// src/components/CreateReport.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setLoading, setError, addReport } from "../redux/ReportsSlice";
import { useEffect } from "react";
import Swal from "sweetalert2";

const CreateReport = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    height: "",
    weather: "",
    image: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);

  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uid = user.uid;
    const author = user.name;
    const formDataToSend = new FormData();

    formDataToSend.append("image", formData.image);

    const newReport = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      height: formData.height,
      weather: formData.weather,
      uid,
      author,
    };

    formDataToSend.append("reportData", JSON.stringify(newReport));

    dispatch(setLoading(true));

    try {
      const response = await axios.post(
        "http://localhost:3000/api/reports",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch(addReport({ id: response.data.id, ...newReport }));

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Laporan berhasil dibuat.",
      });
      navigate("/");
    } catch (error) {
      dispatch(setError(error.message));
      console.error("Error creating report", error);
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Terjadi kesalahan saat membuat laporan.",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  useEffect(() => {
    dispatch(setLoading(false));
    dispatch(setError(null));
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Buat Laporan Baru
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gambar
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-1 block w-full"
                  accept="image/*"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lokasi
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              {/* height */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ketinggian Air (meter)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Weather */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kondisi Cuaca
                </label>
                <select
                  name="weather"
                  value={formData.weather}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih Kondisi Cuaca</option>
                  <option value="Cerah">Cerah</option>
                  <option value="Berawan">Berawan</option>
                  <option value="Hujan Ringan">Hujan Ringan</option>
                  <option value="Hujan Sedang">Hujan Sedang</option>
                  <option value="Hujan Lebat">Hujan Lebat</option>
                  <option value="Berkabut">Berkabut</option>
                </select>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  disabled={loading}
                >
                  {loading ? "Sedang Mengirim..." : "Mengirim Laporan"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
