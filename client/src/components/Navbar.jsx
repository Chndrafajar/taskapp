import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa6';
import { LuSearch } from 'react-icons/lu';
import axiosInstance from '../config/axiosInstance';

export default function Navbar({ menuOpen, setMenuOpen, setKeyword, handleSearch, keyword }) {
  const [userData, setUserData] = useState({});
  // console.log('res', userData);

  const getUser = async () => {
    try {
      const res = await axiosInstance.get('/login/success', { withCredentials: true });
      setUserData(res.data.user);
    } catch (error) {
      console.log('error', error);
    }
  };

  //logout
  const logout = () => {
    window.open('http://localhost:8080/logout', '_self');
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <nav className="navbar">
      <div className="icons-bar">
        <FaBars onClick={() => setMenuOpen(!menuOpen)} />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search your task" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <LuSearch onClick={handleSearch} />
      </div>
      <div className="dropdown">
        {Object?.keys(userData)?.length > 0 ? (
          <>
            <img src={userData?.image} className="dropdown-item" type="button" data-bs-toggle="dropdown" aria-expanded="false" />
          </>
        ) : (
          <>
            <a className="dropdown-item" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Login
            </a>
          </>
        )}

        <ul className="dropdown-menu">
          <li>
            <a className="dropdown-item" onClick={logout} style={{ cursor: 'pointer' }}>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
