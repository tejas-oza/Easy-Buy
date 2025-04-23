import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: JSON.parse(localStorage.getItem("isDarkMode")) || false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    toggleDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      localStorage.setItem("isDarkMode", JSON.stringify(action.payload));
    },
  },
});

export const { toggleDarkMode } = globalSlice.actions;
export default globalSlice.reducer;
