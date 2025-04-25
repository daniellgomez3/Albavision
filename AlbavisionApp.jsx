
import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ["#ff4d4f", "#faad14", "#52c41a"];

const roles = {
  admin: "Administrador",
  tecnico: "Técnico",
  director: "Director"
};

const usuarios = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "tecnico", password: "tecnico123", role: "tecnico" },
  { username: "director", password: "director123", role: "director" }
];

const mockData = [
  {
    equipo: "Transformador TRAFO 1",
    area: "Energía",
    impacto: "Alto",
    backup: "No",
    situacion: "Transformador nuevo",
    contingencia: "Uso de generador externo",
    responsable: "Técnico Energía"
  },
  {
    equipo: "Servidor Video C9N",
    area: "Programación",
    impacto: "Alto",
    backup: "No",
    situacion: "Sin SLA ni backup",
    contingencia: "Implementar virtualización",
    responsable: "Técnico IT"
  }
];

export default function AlbavisionApp() {
  const [riesgos, setRiesgos] = useState(mockData);
  const [nuevo, setNuevo] = useState({ equipo: "", area: "", impacto: "", backup: "", situacion: "", contingencia: "", responsable: "" });
  const [usuario, setUsuario] = useState({ username: "", password: "" });
  const [logueado, setLogueado] = useState(null);

  const login = () => {
    const user = usuarios.find((u) => u.username === usuario.username && u.password === usuario.password);
    if (user) setLogueado(user);
  };

  const agregarRiesgo = () => {
    setRiesgos([...riesgos, nuevo]);
    setNuevo({ equipo: "", area: "", impacto: "", backup: "", situacion: "", contingencia: "", responsable: "" });
  };

  const eliminarRiesgo = (index) => {
    setRiesgos(riesgos.filter((_, i) => i !== index));
  };

  const resumenImpacto = riesgos.reduce((acc, r) => {
    acc[r.impacto] = (acc[r.impacto] || 0) + 1;
    return acc;
  }, {});

  const resumenBackup = riesgos.reduce((acc, r) => {
    acc[r.backup] = (acc[r.backup] || 0) + 1;
    return acc;
  }, {});

  if (!logueado) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login - Albavision Paraguay</h2>
        <input placeholder="Usuario" onChange={(e) => setUsuario({ ...usuario, username: e.target.value })} /><br />
        <input placeholder="Contraseña" type="password" onChange={(e) => setUsuario({ ...usuario, password: e.target.value })} /><br />
        <button onClick={login}>Ingresar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Albavision Paraguay - Gestión de Riesgos ({roles[logueado.role]})</h1>

      {logueado.role !== "director" && (
        <div style={{ marginTop: 20 }}>
          <h2>Nuevo Riesgo</h2>
          <input placeholder="Equipo" value={nuevo.equipo} onChange={(e) => setNuevo({ ...nuevo, equipo: e.target.value })} />
          <input placeholder="Área" value={nuevo.area} onChange={(e) => setNuevo({ ...nuevo, area: e.target.value })} />
          <select onChange={(e) => setNuevo({ ...nuevo, impacto: e.target.value })}>
            <option value="">Impacto</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>
          <select onChange={(e) => setNuevo({ ...nuevo, backup: e.target.value })}>
            <option value="">Backup</option>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>
          <input placeholder="Situación" value={nuevo.situacion} onChange={(e) => setNuevo({ ...nuevo, situacion: e.target.value })} />
          <input placeholder="Contingencia" value={nuevo.contingencia} onChange={(e) => setNuevo({ ...nuevo, contingencia: e.target.value })} />
          <input placeholder="Responsable" value={nuevo.responsable} onChange={(e) => setNuevo({ ...nuevo, responsable: e.target.value })} />
          <button onClick={agregarRiesgo}>Agregar Riesgo</button>
        </div>
      )}

      <div style={{ display: "flex", marginTop: 30 }}>
        <BarChart width={300} height={200} data={Object.entries(resumenImpacto).map(([k, v]) => ({ name: k, value: v }))}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>

        <PieChart width={300} height={200}>
          <Pie data={Object.entries(resumenBackup).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" outerRadius={60} label>
            {Object.entries(resumenBackup).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <table border="1" cellPadding="5" style={{ marginTop: 30 }}>
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Área</th>
            <th>Impacto</th>
            <th>Backup</th>
            <th>Situación</th>
            <th>Contingencia</th>
            <th>Responsable</th>
            {logueado.role === "admin" && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {riesgos.map((r, i) => (
            <tr key={i}>
              <td>{r.equipo}</td>
              <td>{r.area}</td>
              <td>{r.impacto}</td>
              <td>{r.backup}</td>
              <td>{r.situacion}</td>
              <td>{r.contingencia}</td>
              <td>{r.responsable}</td>
              {logueado.role === "admin" && (
                <td><button onClick={() => eliminarRiesgo(i)}>Eliminar</button></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
