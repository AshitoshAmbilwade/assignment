import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import { checkAuth } from "./store/auth.slice";
import socket from "./socket";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // 1️⃣ Check auth on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // 2️⃣ Join socket room when user is available
  useEffect(() => {
    if (user?.id) {
      socket.emit("join", user.id);
    }
  }, [user]);

  // 3️⃣ Listen for hire notification
  useEffect(() => {
    socket.on("hired", (data) => {
      alert(data.message); // simple for demo
    });

    return () => {
      socket.off("hired");
    };
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
