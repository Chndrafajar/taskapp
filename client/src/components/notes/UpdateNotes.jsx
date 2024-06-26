import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axiosInstance from '../../config/axiosInstance';

export default function UpdateNotes({ notesId }) {
  const [project, setProject] = useState('');
  const [fitur, setFitur] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //update note
  const handleUpdateNote = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/notes/update/${notesId}`, { project, fitur, desc, status }, { withCredentials: true });

      if (res.status === 200) {
        toast.success('Notes updated successfully');
        // Reset form
        setProject('');
        setFitur('');
        setDesc('');
        setStatus('');
        setTimeout(() => {
          setLoading(false);
          navigate(0);
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating note:', error);
      setLoading(false);
      toast.error('Failed to update note');
    }
  };

  //get
  const getSingleData = async () => {
    try {
      const { data } = await axiosInstance.get(`/notes/get/${notesId}`);
      setProject(data.notes.project._id);
      setFitur(data.notes.fitur);
      setDesc(data.notes.desc);
      setStatus(data.notes.status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (notesId) {
      getSingleData();
    }
    // eslint-disable-next-line
  }, [notesId]);

  return (
    <div className="modal fade" id="updateNotes" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Update Notes : {fitur}
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <div className="input-project">
              <label htmlFor="">Name Project</label>
              <select value={project} onChange={(e) => setProject(e.target.value)} disabled>
                <option value="">{project}</option>
              </select>
            </div>
            <div className="input-project">
              <label htmlFor="">Fitur</label>
              <input type="text" placeholder="Fitur" value={fitur} onChange={(e) => setFitur(e.target.value)} />
            </div>
            <div className="input-project">
              <label htmlFor="">Description</label>
              <ReactQuill theme="snow" value={desc} onChange={setDesc} />
            </div>
            <div className="input-project">
              <label htmlFor="">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">--{status || 'Select Status'}--</option>
                <option value="Done">Done</option>
                <option value="Progress">Progress</option>
                <option value="New">New</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            {loading ? (
              <>
                <button type="button" className="btn " style={{ background: '#2c55fb', color: '#fff', display: 'flex', alignItems: 'center' }} onClick={handleUpdateNote}>
                  <div class="spinner-border spinner-width text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </>
            ) : (
              <button type="button" className="btn " style={{ background: '#2c55fb', color: '#fff', display: 'flex', alignItems: 'center' }} onClick={handleUpdateNote}>
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
