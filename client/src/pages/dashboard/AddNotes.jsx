import React, { useEffect, useState } from 'react';
import Authenticated from '../../layout/Authenticated';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axiosInstance from '../../config/axiosInstance';

export default function AddNotes() {
  const [getProject, setGetProject] = useState([]);
  const [project, setProject] = useState('');
  const [fitur, setFitur] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('New');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //get project
  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get('/project', { withCredentials: true });
      setGetProject(res.data);
    } catch (error) {
      console.log('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  //add note
  const handleAddNote = async () => {
    setLoading(true);
    try {
      if (!project || !fitur || !desc) {
        toast.error('Semua field harus diisi');
        return;
      }

      const newNote = {
        project,
        fitur,
        desc,
        status,
      };

      const res = await axiosInstance.post('/notes/add', newNote, { withCredentials: true });

      if (res.status === 201) {
        toast.success('Notes add successfully');
        // Reset form
        setProject('');
        setFitur('');
        setDesc('');
        setStatus('New');
        setTimeout(() => {
          setLoading(false);
          navigate('/notes');
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Gagal menambahkan catatan');
      setLoading(false);
    }
  };

  return (
    <Authenticated>
      <div className="add-notes">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <h5>Add New Notes</h5>
                <div className="form-input">
                  <div className="input-notes">
                    <label htmlFor="">Name Project</label>
                    <select value={project} onChange={(e) => setProject(e.target.value)}>
                      <option value="">--Pilih Project---</option>
                      {getProject.map((p) => (
                        <option value={p?._id} key={p?._id}>
                          {p?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-notes">
                    <label htmlFor="">Fitur</label>
                    <input type="text" placeholder="Fitur" value={fitur} onChange={(e) => setFitur(e.target.value)} />
                  </div>
                  <div className="input-notes">
                    <label htmlFor="">Description</label>
                    <ReactQuill theme="snow" value={desc} onChange={setDesc} />
                  </div>

                  {loading ? (
                    <button className="add-notes-btn">
                      <div class="spinner-border spinner-width text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </button>
                  ) : (
                    <button className="add-notes-btn" onClick={handleAddNote}>
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
