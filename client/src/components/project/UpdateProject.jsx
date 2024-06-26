import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axiosInstance';

export default function UpdateProject({ projectId }) {
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //update
  const handleUpdateProject = async () => {
    setLoading(true);
    try {
      if (projectName.trim() === '') {
        toast.error('Project name is required');
        return;
      }

      const res = await axiosInstance.put(`/project/update/${projectId}`, { name: projectName }, { withCredentials: true });

      if (res.status === 201) {
        toast.success('Project update successfully');
        setProjectName('');
        setTimeout(() => {
          navigate(0);
          setLoading(true);
        }, 1500);
      }
    } catch (error) {
      console.log('Error updated project', error);
      toast.error(error);
      setLoading(false);
    }
  };

  //get
  const getSingleData = async () => {
    try {
      const { data } = await axiosInstance.get(`/project/get/${projectId}`);
      setProjectName(data.project.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (projectId) {
      getSingleData();
    }
    // eslint-disable-next-line
  }, [projectId]);

  return (
    <div className="modal fade" id="updateProject" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Update Project : {projectName}
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <div className="input-project">
              <label htmlFor="">Name Project</label>
              <input type="text" placeholder="Name Project" id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            {loading ? (
              <>
                <button type="button" className="btn " style={{ background: '#2c55fb', color: '#fff', display: 'flex', alignItems: 'center' }} onClick={handleUpdateProject}>
                  {/* Add */}
                  <div class="spinner-border spinner-width text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </>
            ) : (
              <button type="button" className="btn " style={{ background: '#2c55fb', color: '#fff', display: 'flex', alignItems: 'center' }} onClick={handleUpdateProject}>
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
