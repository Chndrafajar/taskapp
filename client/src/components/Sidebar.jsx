import React from 'react';
import { NavLink } from 'react-router-dom';
import { BiSolidCategory } from 'react-icons/bi';
import { IoHome } from 'react-icons/io5';
import { IoIosFolderOpen } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

export default function Sidebar({ menuOpen, setMenuOpen }) {
  return (
    <div className={menuOpen ? 'sidebar active' : 'sidebar'}>
      <div className="sidebar-brand">
        <NavLink to="/">
          Task<span>App</span>
        </NavLink>
        <div className="icons-close" onClick={() => setMenuOpen(!menuOpen)}>
          <IoClose />
        </div>
      </div>
      <ul className="sid-nav">
        <li>
          <NavLink className="sid-link" to="/home">
            <IoHome /> <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink className="sid-link" to="/project">
            <BiSolidCategory /> <span>Project</span>
          </NavLink>
        </li>
        <li>
          <NavLink className="sid-link" to="/notes">
            <IoIosFolderOpen /> <span>My Notes</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
