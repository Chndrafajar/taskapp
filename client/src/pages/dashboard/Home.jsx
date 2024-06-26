import React, { useEffect, useState } from 'react';
import Authenticated from '../../layout/Authenticated';
import { FaPenToSquare } from 'react-icons/fa6';
import formatDate from '../../components/formatDate';
import { IoMdAdd } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../config/axiosInstance';

export default function Home() {
  const [userData, setUserData] = useState({});
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(null);

  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axiosInstance.get(`/notes/search/${keyword}`);
      setSearchResult(res.data);
    } catch (error) {
      console.error('Error searching notes:', error);
    }
  };

  // console.log('res', notes);

  //button show more
  const handleToggleExpand = (noteId) => {
    setShowAll(showAll === noteId ? null : noteId);
  };

  const getUser = async () => {
    try {
      const res = await axiosInstance.get('/login/success', { withCredentials: true });
      setUserData(res.data.user);
    } catch (error) {
      console.log('error', error);
    }
  };
  const getNotes = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/notes/all');
      setTimeout(() => {
        setLoading(false);
      }, 1500);
      setNotes(res.data);
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    getUser();
    getNotes();
  }, []);

  return (
    <Authenticated handleSearch={handleSearch} setKeyword={setKeyword} keyword={keyword}>
      <div className="home">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card" style={{ padding: '40px 20px', background: '#2c55fb', color: '#fff' }}>
                <h4>Welcome To World Notes {userData?.displayName}</h4>
              </div>
            </div>
          </div>
          <div className="row">
            {loading ? (
              <>
                <div className="col-12" style={{ display: 'flex', justifyContent: 'center', height: '40vh', alignItems: 'center' }}>
                  <div className="card">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </>
            ) : searchResult.length > 0 ? (
              searchResult.map((n) => (
                <div className="col-lg-4 col-md-6 col-sm-6">
                  <div className="card">
                    <div className="header">
                      <span className="category">{n.project.name}</span>
                      <div className="icons">
                        <span className="category">{formatDate(n?.updatedAt)}</span>
                      </div>
                    </div>
                    <h6 className="title">{n.fitur}</h6>
                    <div className="desc" dangerouslySetInnerHTML={{ __html: showAll === n._id ? n.desc : n.desc.slice(0, 100) }}></div>
                    {n.desc.length > 100 && (
                      <a className="show" onClick={() => handleToggleExpand(n._id)}>
                        {showAll === n._id ? 'Show Less.....' : 'Show More.....'}
                      </a>
                    )}
                    <div className="info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={n.userId.image} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        <h6 style={{ margin: '0px' }}>{n.userId.displayName}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              notes?.map((n) => (
                <div className="col-lg-4 col-md-6 col-sm-6">
                  <div className="card">
                    <div className="header">
                      <span className="category">{n.project.name}</span>
                      <div className="icons">
                        <span className="category">{formatDate(n?.updatedAt)}</span>
                      </div>
                    </div>
                    <h6 className="title">{n.fitur}</h6>
                    <div className="desc" dangerouslySetInnerHTML={{ __html: showAll === n._id ? n.desc : n.desc.slice(0, 100) }}></div>
                    {n.desc.length > 100 && (
                      <a className="show" onClick={() => handleToggleExpand(n._id)}>
                        {showAll === n._id ? 'Show Less.....' : 'Show More.....'}
                      </a>
                    )}
                    <div className="info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={n.userId.image} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        <h6 style={{ margin: '0px' }}>{n.userId.displayName}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <NavLink to="/add-notes" className="btn-add">
        <IoMdAdd />
      </NavLink>
    </Authenticated>
  );
}
