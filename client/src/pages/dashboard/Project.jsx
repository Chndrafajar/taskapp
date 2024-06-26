import React, { useEffect, useState } from 'react';
import Authenticated from '../../layout/Authenticated';
import { FaPenToSquare } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import AddProject from '../../components/project/AddProject';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UpdateProject from '../../components/project/UpdateProject';
import axiosInstance from '../../config/axiosInstance';

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const navigate = useNavigate();

  //get
  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get('/project', { withCredentials: true });
      setProjects(res.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching projects:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  //delete project
  const deleteProject = async (id) => {
    try {
      const res = await axiosInstance.delete(`/project/delete/${id}`);
      if (res.data.success) {
        setProjects((prevProjects) => prevProjects.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah anda ingin menghapus project ini?')) {
      deleteProject(id);
      toast.success('Project deleted successfully');
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
  };

  //update
  const handleEdit = (id) => {
    setSelectedProjectId(id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Authenticated>
      <div className="project-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <button className="btn-add-project" data-bs-toggle="modal" data-bs-target="#addProject">
                  Add project
                </button>
                <div className="table-project">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects?.map((p, i) => (
                        <>
                          <tr key={p?._id}>
                            <th scope="row">{i + 1}</th>
                            <td>{p?.name}</td>
                            <td style={{ display: 'flex', gap: '10px' }}>
                              <div className="btn-delete" onClick={() => handleDelete(p._id)}>
                                <FaTrash />
                              </div>
                              <div className="btn-edit" data-bs-toggle="modal" data-bs-target="#updateProject" onClick={() => handleEdit(p?._id)}>
                                <FaPenToSquare />
                              </div>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpdateProject projectId={selectedProjectId} />
      <AddProject />
    </Authenticated>
  );
}
