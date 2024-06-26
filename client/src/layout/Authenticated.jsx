import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Authenticated({ children, setKeyword, handleSearch, keyword }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <section className="authenticated">
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className="content">
          <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setKeyword={setKeyword} handleSearch={handleSearch} keyword={keyword} />
          <div className="content-wrapper">{children}</div>
        </div>
      </section>
    </>
  );
}
