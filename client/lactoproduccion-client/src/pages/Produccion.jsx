import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Produccion() {
  const [fecha, setFecha] = useState("");
  const [litros, setLitros] = useState("");
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFin, setFiltroFin] = useState("");

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    setCargando(true);
    setError(null);
    try {
      let url = "http://localhost:3001/api/registros";
      
      const params = new URLSearchParams();
      if (filtroInicio) params.append('inicio', filtroInicio);
      if (filtroFin) params.append('fin', filtroFin);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await axios.get(url);
      setRegistros(res.data);
    } catch (err) {
      console.error("Error al cargar registros", err);
      setError("Error al cargar los registros. Intente nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const validarDatos = () => {
    if (!fecha || !litros) {
      throw new Error("Todos los campos son obligatorios");
    }
    
    if (isNaN(parseFloat(litros))) {
      throw new Error("Los litros deben ser un número válido");
    }
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      throw new Error("Formato de fecha inválido. Use YYYY-MM-DD");
    }
  };

  const agregarRegistro = async (e) => {
    e.preventDefault();
    try {
      validarDatos();
      
      const nuevo = { 
        fecha, 
        litros: parseFloat(litros) 
      };

      setCargando(true);
      const res = await axios.post("http://localhost:3001/api/registros", nuevo);
      
      console.log(res.data.message);
      setFecha("");
      setLitros("");
      await cargarRegistros();
    } catch (err) {
      console.error("Error al guardar", err);
      setError(err.message || "Hubo un error al guardar el registro");
    } finally {
      setCargando(false);
    }
  };

  const calcularTotalHoy = () => {
    const hoy = new Date().toISOString().split('T')[0];
    return registros
      .filter(reg => reg.fecha === hoy)
      .reduce((sum, reg) => sum + reg.litros, 0);
  };

  const calcularPromedioSemanal = () => {
    const datosSemanales = obtenerDatosSemanales().datasets[0].data;
    return datosSemanales.reduce((a, b) => a + b, 0) / datosSemanales.length || 0;
  };

  const obtenerDatosMensuales = () => {
    const datos = {};

    registros.forEach(({ fecha, litros }) => {
      const dateObj = new Date(fecha);
      const mes = dateObj.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short'
      });

      datos[mes] = (datos[mes] || 0) + litros;
    });

    return {
      labels: Object.keys(datos),
      datasets: [{
        label: "Producción mensual (L)",
        data: Object.values(datos),
        fill: true,
        backgroundColor: 'rgba(13, 110, 253, 0.2)',
        borderColor: 'rgba(13, 110, 253, 1)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'rgba(13, 110, 253, 1)'
      }]
    };
  };

  const obtenerDatosDiarios = () => {
    const datos = {};

    registros.forEach(({ fecha, litros }) => {
      const dia = new Date(fecha).toLocaleDateString('es-CO');
      datos[dia] = (datos[dia] || 0) + litros;
    });

    return {
      labels: Object.keys(datos),
      datasets: [{
        label: "Producción diaria (L)",
        data: Object.values(datos),
        fill: true,
        backgroundColor: 'rgba(25, 135, 84, 0.2)',
        borderColor: 'rgba(25, 135, 84, 1)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'rgba(25, 135, 84, 1)'
      }]
    };
  };

  const obtenerDatosSemanales = () => {
    const datos = {};

    registros.forEach(({ fecha, litros }) => {
      const dateObj = new Date(fecha);
      const year = dateObj.getFullYear();
      const onejan = new Date(year, 0, 1);
      const week = Math.ceil((((dateObj - onejan) / 86400000) + onejan.getDay() + 1) / 7);
      const etiqueta = `Semana ${week} - ${year}`;

      datos[etiqueta] = (datos[etiqueta] || 0) + litros;
    });

    return {
      labels: Object.keys(datos),
      datasets: [{
        label: "Producción semanal (L)",
        data: Object.values(datos),
        fill: true,
        backgroundColor: 'rgba(111, 66, 193, 0.2)',
        borderColor: 'rgba(111, 66, 193, 1)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'rgba(111, 66, 193, 1)'
      }]
    };
  };

  const limpiarFiltros = () => {
    setFiltroInicio("");
    setFiltroFin("");
    cargarRegistros();
  };

  return (
    <div className="container-fluid px-4 py-4 bg-light">
      {/* Encabezado */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary rounded p-2 me-3">
              <i className="bi bi-droplet text-white fs-4"></i>
            </div>
            <div>
              <h1 className="h2 mb-0 text-primary">Panel de Producción Lechera</h1>
              <p className="text-muted mb-0">Seguimiento diario de producción</p>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Producción Hoy</h6>
                  <h2 className="mb-0">
                    {calcularTotalHoy().toFixed(2)} <small className="fs-6 text-muted">L</small>
                  </h2>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-droplet text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Total Registros</h6>
                  <h2 className="mb-0">{registros.length}</h2>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-list-check text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Promedio Semanal</h6>
                  <h2 className="mb-0">
                    {calcularPromedioSemanal().toFixed(2)} <small className="fs-6 text-muted">L</small>
                  </h2>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="bi bi-graph-up text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario y Filtros */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Registro
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={agregarRegistro}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="fecha" className="form-label fw-bold">
                      <i className="bi bi-calendar me-2"></i>
                      Fecha
                    </label>
                    <input
                      type="date"
                      className="form-control border-2"
                      id="fecha"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="litros" className="form-label fw-bold">
                      <i className="bi bi-droplet me-2"></i>
                      Litros
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control border-2"
                      id="litros"
                      value={litros}
                      onChange={(e) => setLitros(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary mt-3 w-100"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i>
                      Guardar Registro
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-funnel me-2"></i>
                Filtros
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Rango de fechas</label>
                <div className="input-group">
                  <input
                    type="date"
                    className="form-control"
                    value={filtroInicio}
                    onChange={(e) => setFiltroInicio(e.target.value)}
                  />
                  <span className="input-group-text">a</span>
                  <input
                    type="date"
                    className="form-control"
                    value={filtroFin}
                    onChange={(e) => setFiltroFin(e.target.value)}
                  />
                </div>
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button 
                  className="btn btn-info text-white me-md-2"
                  onClick={cargarRegistros}
                  disabled={cargando}
                >
                  <i className="bi bi-funnel me-2"></i>
                  Aplicar
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={limpiarFiltros}
                  disabled={cargando}
                >
                  <i className="bi bi-trash me-2"></i>
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Gráficos */}
      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-bar-chart-line me-2"></i>
                Producción Diaria
              </h5>
            </div>
            <div className="card-body">
              <div style={{height: '300px'}}>
                <Line 
                  data={obtenerDatosDiarios()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(2)} L`
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-purple text-white" style={{backgroundColor: '#6f42c1'}}>
              <h5 className="mb-0">
                <i className="bi bi-bar-chart-line me-2"></i>
                Producción Semanal
              </h5>
            </div>
            <div className="card-body">
              <div style={{height: '300px'}}>
                <Line 
                  data={obtenerDatosSemanales()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-bar-chart-line me-2"></i>
                Producción Mensual
              </h5>
            </div>
            <div className="card-body">
              <div style={{height: '300px'}}>
                <Line 
                  data={obtenerDatosMensuales()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Produccion;