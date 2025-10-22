import { AppCard } from "./AppCard";
import { UserHeader } from "./UserHeader";
import { useAuth } from "../contexts/AuthContext";
import { isAdminUser } from "../types/admin.types";
import vivibraLogo from "../assets/vivipra.png";
import "../App.css";

export interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  color: string;
}

export const APPLICATIONS: Application[] = [
  {
    id: "tickets",
    name: "Tickets y Gestión de activos",
    description:
      "Panel de levantamiento de tickets con modulo de gestión de activos",
    icon: "🎫",
    url: "http://192.168.200.80:5002/login",
    color: "#ff6b35",
  },
  {
    id: "stock",
    name: "Stock",
    description: "Panel de stock de vehículos",
    icon: "📦",
    url: "http://192.168.200.80:5004/login",
    color: "#f7931e",
  },
  {
    id: "notas-venta",
    name: "Notas de venta y Cotizaciones",
    description: "Sistema de creacion de notas de venta y cotizaciones",
    icon: "📋",
    url: "http://192.168.200.80:5003/login",
    color: "#ff8555",
  },
  {
    id: "flujo-caja",
    name: "Flujo de caja",
    description: "Plataforma de comunicación interna del equipo",
    icon: "📈",
    url: "http://192.168.200.80:5001/login",
    color: "#ff6b35",
  },
  {
    id: "archivos",
    name: "Archivos",
    description: "Almacenamiento y gestión de documentos",
    icon: "📁",
    url: "https://archivos.example.com",
    color: "#e5522b",
  },
  {
    id: "configuracion",
    name: "Configuración",
    description: "Ajustes y preferencias del sistema",
    icon: "🔧",
    url: "https://config.example.com",
    color: "#ff7f50",
  },
];

export function Dashboard() {
  const { usuario } = useAuth();

  // Filter applications based on user permissions
  // Admin users see all apps, regular users see only apps they have permission for
  const applications = usuario && isAdminUser(usuario.usuario)
    ? APPLICATIONS
    : APPLICATIONS.filter(app => usuario?.permisos.includes(app.id));

  return (
    <div className="app-container">
      <UserHeader />

      <header className="header">
        <img src={vivibraLogo} alt="Vivipra Logo" className="logo" />
        <h1 className="title">Centro de Aplicaciones</h1>
        <p className="subtitle">
          Accede a todas tus herramientas en un solo lugar
        </p>
      </header>

      <div className="apps-grid">
        {applications.length > 0 ? (
          applications.map((app, index) => (
            <AppCard
              key={index}
              name={app.name}
              description={app.description}
              icon={app.icon}
              url={app.url}
              color={app.color}
            />
          ))
        ) : (
          <div className="no-apps">
            <p>No tienes permisos para acceder a ninguna aplicación.</p>
            <p>Contacta al administrador para solicitar acceso.</p>
          </div>
        )}
      </div>
    </div>
  );
}
