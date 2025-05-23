import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Animales = () => {
  const [animales, setAnimales] = useState([]);
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    edad: '',
    raza: '',
    ultimo_servicio: '',
    foto: ''
  });
  const [editando, setEditando] = useState(false);
  const [animalEditando, setAnimalEditando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const fetchAnimales = async () => {
    setCargando(true);
    try {
      const res = await axios.get('http://localhost:3001/api/animales');
      setAnimales(res.data);
    } catch (error) {
      console.error('Error al cargar los animales:', error);
      setError('Error al cargar los animales');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchAnimales();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      if (editando) {
        await axios.put(`http://localhost:3001/api/animales/${animalEditando.id}`, form);
      } else {
        await axios.post('http://localhost:3001/api/animales', form);
      }
      fetchAnimales();
      limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar animal:', error);
      setError('Error al guardar el animal');
    } finally {
      setCargando(false);
    }
  };

  const editarAnimal = (animal) => {
    setForm(animal);
    setAnimalEditando(animal);
    setEditando(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarAnimal = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este animal?')) return;
    
    setCargando(true);
    try {
      await axios.delete(`http://localhost:3001/api/animales/${id}`);
      fetchAnimales();
    } catch (error) {
      console.error('Error al eliminar animal:', error);
      setError('Error al eliminar el animal');
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setForm({ id: '', nombre: '', edad: '', raza: '', ultimo_servicio: '', foto: '' });
    setEditando(false);
    setAnimalEditando(null);
  };

  const animalesFiltrados = busqueda
    ? animales.filter(animal => 
        animal.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        animal.raza.toLowerCase().includes(busqueda.toLowerCase()) ||
        animal.id.toString().includes(busqueda))
    : animales;
  return (
    <div className="container-fluid py-4">
      {/* Encabezado */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-5 fw-bold text-primary">
            <i className="bi bi-egg-fill me-2"></i>
            Registro de Animales
          </h1>
          <p className="lead text-muted">Gestión del inventario ganadero</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className={`bi ${editando ? 'bi-pencil' : 'bi-plus'} me-2`}></i>
                {editando ? 'Editar' : 'Nuevo'} Animal
              </h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Número de identificación*</label>
                    <input
                      type="text"
                      name="id"
                      className="form-control"
                      placeholder="Ej: 1234"
                      value={form.id}
                      onChange={handleChange}
                      required
                      disabled={editando}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Nombre*</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      placeholder="Ej: Lola"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Edad (años)*</label>
                    <input
                      type="number"
                      name="edad"
                      className="form-control"
                      placeholder="Ej: 3"
                      value={form.edad}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Raza*</label>
                    <input
                      type="text"
                      name="raza"
                      className="form-control"
                      placeholder="Ej: Holstein"
                      value={form.raza}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Último servicio</label>
                    <input
                      type="date"
                      name="ultimo_servicio"
                      className="form-control"
                      value={form.ultimo_servicio}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">URL de la foto</label>
                    <input
                      type="text"
                      name="foto"
                      className="form-control"
                      placeholder="https://ejemplo.com/foto.jpg"
                      value={form.foto}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      {editando && (
                        <button
                          type="button"
                          onClick={limpiarFormulario}
                          className="btn btn-outline-secondary me-md-2"
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancelar
                        </button>
                      )}
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={cargando}
                      >
                        {cargando ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <i className={`bi ${editando ? 'bi-check' : 'bi-save'} me-2`}></i>
                            {editando ? 'Actualizar' : 'Guardar'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador y Lista */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h3 className="mb-0">
                <i className="bi bi-search me-2"></i>
                Buscar Animales
              </h3>
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-filter"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, raza o ID"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>

          {cargando && animales.length === 0 ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando animales...</p>
            </div>
          ) : animalesFiltrados.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle-fill me-2"></i>
              No se encontraron animales registrados
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Raza</th>
                    <th>Edad</th>
                    <th>Último Servicio</th>
                    <th>Foto</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {animalesFiltrados.map((animal) => (
                    <tr key={animal.id}>
                      <td>{animal.id}</td>
                      <td>
                        <strong>{animal.nombre}</strong>
                      </td>
                      <td>{animal.raza}</td>
                      <td>{animal.edad} años</td>
                      <td>{animal.ultimo_servicio || '-'}</td>
                      <td>
                        {animal.foto ? (
                          <img 
                            src={animal.foto} 
                            alt={animal.nombre} 
                            className="img-thumbnail" 
                            style={{width: '80px', height: '80px', objectFit: 'cover'}}
                          />
                        ) : (
                          <span className="text-muted">Sin foto</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => editarAnimal(animal)}
                          className="btn btn-sm btn-outline-primary me-2"
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => eliminarAnimal(animal.id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Eliminar"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Animales;