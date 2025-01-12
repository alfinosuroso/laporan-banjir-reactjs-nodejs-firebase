// src/components/Dashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setReports } from "../redux/ReportsSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.reports);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/reports");
        const reportsData = response.data
          ? Object.entries(response.data).map(([id, data]) => ({
              id,
              ...data,
            }))
          : [];
        dispatch(setReports(reportsData));
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-cyan-800">
        Dashboard Semua Laporan
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
                <p className="text-sm">Ketinggian air: {report.height}m</p>
                <p className="text-sm">Cuaca: {report.weather}</p>
              </div>
              <p className="mt-2 text-sm text-blue-600">
                Author: {report.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
