import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  auth: Auth | null;
};

export const initialState: InitialState = {
  auth: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    reset: () => initialState,
    // Add your synchronous reducers here if needed
    setAuth: (state, action: PayloadAction<Auth>) => {
      state.auth = action.payload;
    },
  },
});

export const { setAuth, reset } = globalSlice.actions;

export default globalSlice.reducer;
