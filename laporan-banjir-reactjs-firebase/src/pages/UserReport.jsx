import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setReports, deleteReport, updateReport } from "../redux/ReportsSlice"; 
import Swal from "sweetalert2"; 
import Modal from "react-modal"; 

const UserReport = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.reports);
  const user = useSelector((state) => state.auth.user);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    location: "",
    height: "",
    weather: "",
  });

  const loading = useSelector((state) => state.auth.loading); 

  useEffect(() => {
    fetchReports();
  }, [dispatch]);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/reports/${user.uid}`
      );
      const reportsData = response.data
        ? Object.entries(response.data).map(([id, data]) => ({
            id,
            ...data,
          }))
        : [];

      console.log("response.data", response.data);
      dispatch(setReports(reportsData));
    } catch (error) {
      console.error("Error fetching reports:", error);
    }

    console.log("reports", reports);
  };

  const handleDelete = (id) => {
    
    Swal.fire({
      title: "Apakah kamu yakin",
      text: "Kamu akan menghapus laporan ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/api/reports/${id}`)
          .then(() => {
            dispatch(deleteReport(id));
            Swal.fire("Terhapus!", "Laporan berhasil dihapus.", "success");
          })
          .catch((error) => {
            console.error("Error deleting report:", error);
            Swal.fire("Error!", "Gagal menghapus laporan.", "error");
          });
      }
    });
  };

  const openUpdateModal = (report) => {
    setCurrentReport(report);
    setFormData({
      title: report.title,
      image: report.image,
      description: report.description,
      location: report.location,
      height: report.height,
      weather: report.weather,
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append(
      "reportData",
      JSON.stringify({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        height: formData.height,
        weather: formData.weather,
      })
    );

    formDataToSend.append("image", formData.image);

    try {
      await axios.put(
        `http://localhost:3000/api/reports/${currentReport.id}`,
        formDataToSend
      );
      Swal.fire("Terupdate!", "Laporan berhasil diupdate.", "success");
      closeModal();
      fetchReports();
    } catch (error) {
      Swal.fire("Error!", "Gagal mengupdate laporan.", "error");
      console.error("Error updating report:", error);
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

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-cyan-800">
          {reports.length === 0 ? "Laporan tidak ditemukan" : "Laporan Saya"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {report.image && (
                <img
                  src={"http://localhost:3000" + report.image}
                  alt={report.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-cyan-700">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
                <p className="mt-2">{report.description}</p>
                <div className="mt-2">
                  <p className="text-sm">Lokasi: {report.location}</p>
                  <p className="text-sm">Ketinggian Air: {report.height}m</p>
                  <p className="text-sm">Cuaca: {report.weather}</p>
                </div>
                <p className="mt-2 text-sm text-blue-600">
                  By: {report.author}
                </p>

                {/* Update and Delete buttons */}
                <div className="mt-4 flex">
                  <button
                    className="flex-1 bg-cyan-600 text-white px-3 py-1 mr-2 rounded hover:bg-cyan-700"
                    onClick={() => openUpdateModal(report)}
                  >
                    Update
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white px-3 py-1 ml-2 rounded hover:bg-red-700"
                    onClick={() => handleDelete(report.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center"
      >
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Update Laporan
          </h3>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
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
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                className="w-full"
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
                rows="2"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* height */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ketinggian (m)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                className="w-full py-2 px-4 bg-cyan-600 text-white rounded-md shadow-sm hover:bg-cyan-700 transition-all"
              >
                {loading ? "Updating..." : "Update Report"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full mt-4 py-2 px-4 bg-gray-400 text-white rounded-md shadow-sm hover:bg-gray-500 transition-all"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UserReport;
