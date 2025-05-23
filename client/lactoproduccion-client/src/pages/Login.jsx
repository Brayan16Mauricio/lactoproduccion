import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
 // ← Asegúrate de importar axios

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setCargando(true);

  try {
    if (!usuario.trim() || !password.trim()) {
      throw new Error('Por favor complete todos los campos');
    }

    // Envía la solicitud POST al backend con usuario y contraseña
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: usuario,
      password: password
    });

    // Si la respuesta es exitosa, redirige
    navigate('/home');
  } catch (err) {
    if (err.response && err.response.status === 401) {
      setError('Usuario o contraseña incorrectos');
    } else {
      setError('Error al iniciar sesión');
    }
  } finally {
    setCargando(false);
  }
};
  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center py-3">
              <h2 className="mb-0">
                <i className="bi bi-shield-lock me-2"></i>
                Lactoproducción
              </h2>
              <p className="mb-0 small">Sistema de gestión ganadera</p>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError('')}
                  ></button>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="usuario" className="form-label fw-bold">
                    <i className="bi bi-person-fill me-2"></i>
                    Usuario
                  </label>
                  <input
                    type="text"
                    id="usuario"
                    className="form-control form-control-lg"
                    placeholder="Ingrese su usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold">
                    <i className="bi bi-key-fill me-2"></i>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control form-control-lg"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={cargando}
                  >
                    {cargando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Verificando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Ingresar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer text-center py-3 bg-light">
              <small className="text-muted">
                <i className="bi bi-info-circle me-2"></i>
                Sistema de acceso restringido
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;