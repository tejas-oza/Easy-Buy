import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("userData")) || null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCrenditials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCrenditials, logOut } = authSlice.actions;
export default authSlice.reducer;
