import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/Home">LactoProducción</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/Home">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/animales">Animales</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/produccion">Producción</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Cerrar sesión</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
