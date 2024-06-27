import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Project from './pages/dashboard/Project';
import Notes from './pages/dashboard/Notes';
import AddNotes from './pages/dashboard/AddNotes';
import { useEffect, useState } from 'react';
import Home from './pages/dashboard/Home';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import Login from './pages/Login';
import HomePages from './pages/HomePages';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from './config/axiosInstance';

function Layout() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  const getUser = async () => {
    try {
      const res = await axiosInstance.get('/login/success', { withCredentials: true });
      setUserData(res.data.user);
    } catch (error) {
      console.log('error', error);
      setUserData(false); // Set user data to false if there's an error
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (userData) {
    // Pengguna telah login, render halaman private
    return <Outlet />;
  }

  // Pengguna belum login, arahkan ke halaman login
  return <Navigate to="/login" state={{ from: location }} replace />;
}

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      nprogress.start();
      setLoading(true);
    };

    const handleStop = () => {
      nprogress.done();
      setLoading(false);
    };

    handleStart();

    const timer = setTimeout(() => {
      handleStop();
    }, 500);

    return () => {
      clearTimeout(timer);
      handleStop();
    };
  }, [location]);

  return (
    <>
      {loading && <div className="loading-spinner"></div>}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/notes" element={<Notes />} />
          <Route path="/add-notes" element={<AddNotes />} />
          <Route path="/project" element={<Project />} />
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
