import React, { useEffect } from "react";
import SideBar from "./Components/SideBar/SideBar"
import Chat from "./Components/Chat/Chat"
import SignUp from "./Components/Authentication/SignUp"
import { useSelector, useDispatch } from "react-redux";
import { checkAuthenticated, getUsers } from "./Store/AuthSlice";
import "./App.css";
function App() {

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuthenticated());
    if (isAuthenticated) {
      dispatch(getUsers());
    }
  }, [dispatch, isAuthenticated])

  return (

    isAuthenticated ?
      (<div className="app">
        <SideBar />
        <Chat />
      </div>) :
      <div className="app">
        <SignUp />
      </div>



  );
}

export default App;
