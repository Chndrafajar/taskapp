import React, { useEffect, useState } from 'react';
import Authenticated from '../../layout/Authenticated';
import { FaPenToSquare } from 'react-icons/fa6';
import axios from 'axios';
import formatDate from '../../components/formatDate';
import UpdateNotes from '../../components/notes/UpdateNotes';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import axiosInstance from '../../config/axiosInstance';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedNotesId, setSelectedNotesId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAll, setShowAll] = useState(null);

  //button show more
  const handleToggleExpand = (noteId) => {
    setShowAll(showAll === noteId ? null : noteId);
  };

  //get search
  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();

  //get date
  const fetchDate = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await axiosInstance.get('/notes/date', { withCredentials: true, params });
      setNotes(res.data);
    } catch (error) {
      console.log('Error fetching notes:', error);
      toast.error('Failed to fetch notes');
    }
  };

  const handleFilterDate = (e) => {
    e.preventDefault();
    fetchDate(startDate, endDate);
  };
  useEffect(() => {
    fetchDate();
  }, []);

  //search
  const handleSearch = async () => {
    try {
      const res = await axiosInstance.get(`/notes/search/${keyword}`);
      setSearchResult(res.data);
    } catch (error) {
      console.error('Error searching notes:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get('/notes', { withCredentials: true });
      setNotes(res.data);
      // setLoading(false);
    } catch (error) {
      console.log('Error fetching notes:', error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  //get project notes
  const fetchProjectNotes = async (projectId) => {
    try {
      const res = await axiosInstance.get(`/notes/project/${projectId}`, { withCredentials: true });
      setNotes(res.data.notes);
    } catch (error) {
      console.error('Error fetching notes data:', error);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchProjectNotes(selectedProject);
    } else {
      fetchNotes();
    }
  }, [selectedProject]);

  //get project
  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get('/project', { withCredentials: true });
      setProjects(res.data);
    } catch (error) {
      console.log('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  //get id
  const handleUpdate = (id) => {
    setSelectedNotesId(id);
  };

  //delete notes
  const deleteNotes = async (id) => {
    try {
      const res = await axiosInstance.delete(`/notes/delete/${id}`);
      if (res.data.success) {
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah anda ingin menghapus notes ini?')) {
      deleteNotes(id);
      toast.success('Notes deleted successfuly');
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
  };

  return (
    <Authenticated handleSearch={handleSearch} setKeyword={setKeyword} keyword={keyword}>
      <>
        <div className="notes">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="filter">
                    <div className="filter-project">
                      <select onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                        <option value="">--Pilih Project--</option>
                        {projects.map((p) => (
                          <option value={p?._id} key={p?._id}>
                            {p?.name}
                          </option>
                        ))}
                      </select>
                      <div className="left">
                        <form onSubmit={handleFilterDate} className="mt-3">
                          <div className="row">
                            <div className="col-md-5 mb-3">
                              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-date" placeholder="Start Date" />
                            </div>
                            <div className="col-md-5 mb-3">
                              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-date" placeholder="End Date" />
                            </div>
                            <div className="col-md-2">
                              <button type="submit" className="btn w-100" style={{ background: '#2c55fb', color: '#fff' }}>
                                Filter
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {searchResult.length > 0
                ? searchResult.map((n) => (
                    <div className="col-lg-4 col-md-6 col-sm-6" key={n?._id}>
                      <div className="card">
                        <div className="header">
                          <span className="category">{n?.project.name}</span>
                          <div className="icons">
                            <div className="dropdown">
                              <a className="" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <FaPenToSquare />
                              </a>
                              <ul className="dropdown-menu">
                                <li>
                                  <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateNotes" onClick={() => handleUpdate(n?._id)}>
                                    Edit
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="#" onClick={() => handleDelete(n?._id)}>
                                    Delete
                                  </a>
                                </li>
                              </ul>
                            </div>
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
                          <div className={`status-item ${n.status === 'Done' ? 'done' : n.status === 'Progress' ? 'inprogress' : 'newnotes'}`}>{n.status}</div>
                          <span className="date">{formatDate(n?.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                : notes.map((n) => (
                    <div className="col-lg-4 col-md-6 col-sm-6" key={n?._id}>
                      <div className="card">
                        <div className="header">
                          <span className="category">{n?.project.name}</span>
                          <div className="icons">
                            <div className="dropdown">
                              <a className="" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <FaPenToSquare />
                              </a>
                              <ul className="dropdown-menu">
                                <li>
                                  <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateNotes" onClick={() => handleUpdate(n?._id)}>
                                    Edit
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="#" onClick={() => handleDelete(n?._id)}>
                                    Delete
                                  </a>
                                </li>
                              </ul>
                            </div>
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
                          <div className={`status-item ${n.status === 'Done' ? 'done' : n.status === 'Progress' ? 'inprogress' : 'newnotes'}`}>{n.status}</div>
                          <span className="date">{formatDate(n?.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
        <UpdateNotes notesId={selectedNotesId} />
        <NavLink to="/add-notes" className="btn-add">
          <IoMdAdd />
        </NavLink>
      </>
    </Authenticated>
  );
}
