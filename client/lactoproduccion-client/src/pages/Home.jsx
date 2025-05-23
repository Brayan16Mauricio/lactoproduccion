import React from 'react';

const Home = () => {
  return (
    <div className="home-page" style={{ backgroundColor: '#f3f1e7', minHeight: '100vh' }}>
      {/* Encabezado tipo Starbucks */}
      <header className="bg-success text-white py-4 shadow">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Bienvenido a LactoProducción</h1>
          <p className="lead">Gestión inteligente para tu finca, con sabor a campo ☕</p>
        </div>
      </header>

      {/* Sección principal */}
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img 
              src="https://images.unsplash.com/photo-1615486365671-d23eeb54df09" 
              alt="Finca" 
              className="img-fluid rounded-4 shadow" 
            />
          </div>
          <div className="col-md-6">
            <h2 className="text-success fw-bold">Controla tu producción con estilo</h2>
            <p className="text-muted">
              Desde el registro de animales hasta el seguimiento de la producción diaria.
              Tu finca merece tecnología tan confiable como tu café de la mañana.
            </p>
            <a href="/animales" className="btn btn-success btn-lg mt-3">
              <i className="bi bi-cow me-2"></i> Ver animales
            </a>
          </div>
        </div>
      </section>

      {/* Sección destacada */}
      <section className="bg-white py-5 border-top">
        <div className="container text-center">
          <h3 className="text-success fw-bold mb-4">¿Por qué usar LactoProducción?</h3>
          <div className="row g-4">
            <div className="col-md-4">
              <i className="bi bi-bar-chart-line text-success fs-1 mb-3"></i>
              <h5 className="fw-bold">Análisis de datos</h5>
              <p className="text-muted">Toma decisiones con base en métricas claras y precisas.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-cloud-upload text-success fs-1 mb-3"></i>
              <h5 className="fw-bold">Todo en la nube</h5>
              <p className="text-muted">Accede a tu información desde cualquier lugar y en cualquier momento.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-heart text-success fs-1 mb-3"></i>
              <h5 className="fw-bold">Diseñado para el campo</h5>
              <p className="text-muted">Simple, eficiente y con cariño por el trabajo rural.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-success text-white text-center py-3 mt-5">
        <p className="mb-0">© 2025 LactoProducción | Hecho con ❤️ para el campo</p>
      </footer>
    </div>
  );
};

export default Home;
