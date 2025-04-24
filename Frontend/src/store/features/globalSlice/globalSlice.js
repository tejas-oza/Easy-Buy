import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: JSON.parse(localStorage.getItem("isDarkMode")) || false,
  isMobileMenuOpen:
    JSON.parse(localStorage.getItem("isMobileMenuOpen")) || false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    toggleDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      localStorage.setItem("isDarkMode", JSON.stringify(action.payload));
    },

    toggleMobileMenu: (state, action) => {
      state.isMobileMenuOpen = action.payload;
      localStorage.setItem("isMobileMenuOpen", JSON.stringify(action.payload));
    },
  },
});

export const { toggleDarkMode, toggleMobileMenu } = globalSlice.actions;
export default globalSlice.reducer;
