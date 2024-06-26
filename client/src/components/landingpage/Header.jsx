import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../config/axiosInstance';

export default function Header() {
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
    window.open('https://taskapp-api.vercel.app/logout', '_self');
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <NavLink className="navbar-brand">
          Task<span>App</span>
        </NavLink>

        {Object?.keys(userData)?.length > 0 ? (
          <>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <div className="dropdown">
                <img src={userData?.image} className="dropdown-item" type="button" data-bs-toggle="dropdown" aria-expanded="false" />
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/notes" className="dropdown-item" style={{ cursor: 'pointer' }}>
                      Dashboard
                    </NavLink>
                  </li>
                  <hr />
                  <li>
                    <a className="dropdown-item" onClick={logout} style={{ cursor: 'pointer' }}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </ul>
          </>
        ) : (
          <>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/login" className="nav-link login-btn">
                  Sign Up
                </NavLink>
              </li>
            </ul>
          </>
        )}
      </div>
    </nav>
  );
}
