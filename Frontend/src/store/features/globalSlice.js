import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: JSON.parse(localStorage.getItem("isDarkMode")) || false,
  isNavbarOpen: JSON.parse(localStorage.getItem("isNavbarOpen")) || false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    toggleDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      localStorage.setItem("isDarkMode", JSON.stringify(action.payload));
    },
    toggleNavBar: (state, action) => {
      state.isNavbarOpen = action.payload;
      localStorage.setItem("isNavbarOpen", JSON.stringify(action.payload));
    },
  },
});

export const { toggleDarkMode, toggleNavBar } = globalSlice.actions;
export default globalSlice.reducer;
