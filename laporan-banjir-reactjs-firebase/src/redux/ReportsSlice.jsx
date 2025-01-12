import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reports: [],
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReports: (state, action) => {
      state.reports = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addReport: (state, action) => {
      state.reports.push(action.payload);
      state.loading = false; 
      state.error = null; 
    },
    updateReport: (state, action) => {
      const index = state.reports.findIndex(
        (report) => report.id === action.payload.id
      );
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteReport: (state, action) => {
      state.reports = state.reports.filter(
        (report) => report.id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },
    clearAllReports: (state) => {
      state.reports = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setReports,
  setLoading,
  setError,
  updateReport,
  deleteReport,
  clearAllReports,
  addReport,
} = reportsSlice.actions;

export default reportsSlice.reducer;
