import React from 'react';
import { NavLink } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="hero">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h2>
              Make your <span>task</span> management <br /> easier with the <span>taskapp</span>
            </h2>
            <p>Welcome to taskapp, the best solution to organize your task with high efficiency. With an intuitive interface and powerful features</p>
            <NavLink to="/login" className="btn-mulai">
              Start Now
            </NavLink>
          </div>
          <div className="col-lg-6">
            <img src="/images/illustrator.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
