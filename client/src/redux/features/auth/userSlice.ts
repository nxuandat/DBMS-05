import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{token: string}>) => {
      state.token = action.payload.token;
    },
    setUser: (state, action: PayloadAction<{user: any}>) => {
      state.user = action.payload.user;
    },
    userLoggedIn: (state, action:PayloadAction<{accessToken:string,user:string}>) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = "";
    },
  },
});

export const { userRegistration, setUser, userLoggedIn, userLoggedOut } =
  userSlice.actions;

export default userSlice.reducer;
