import { createSlice } from "@reduxjs/toolkit";
import { set } from "react-hook-form";

const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    console.log("getUserFromStorage called, storedUser:", storedUser);
    if (!storedUser || storedUser === "undefined") return null;
    return JSON.parse(storedUser);
  } catch (error) {
    //console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  allData:null,
  isSidebarOpen: false,
};

const authSlice=createSlice({
    name:"auth",
    initialState,
reducers:{
    setCredentials:(state,action)=>{
        console.log("setCredentials action called",action.payload);

        //console.log("setCredentials action payload:", action.payload);
state.user=action.payload
localStorage.setItem("user",JSON.stringify(action.payload.email))
    },
    setCredentialsWithUser:(state, action) => {
        console.log("setCredentials action called",action.payload);

      //console.log("getting,",action.payload)
state.allData=action.payload
    },
    logout:(state,action)=>{
        state.user=null
        localStorage.removeItem("user")
    },
    setOpenSidebar: (state, action) => {
        state.isSidebarOpen = action.payload;
      },
}})

export const {setCredentials,logout,setOpenSidebar,setCredentialsWithUser}=authSlice.actions
export default authSlice.reducer
