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
  comingSoon?: boolean;
}

export const APPLICATIONS: Application[] = [
  {
    id: "tickets",
    name: "Tickets y Gestión de activos",
    description:
      "Sistema de levantamiento de tickets con modulo de gestión de activos",
    icon: "🎫",
    url: "http://192.168.200.80:5002",
    color: "#ff6b35",
  },
  {
    id: "stock",
    name: "Stock",
    description: "Panel de stock de vehículos",
    icon: "📦",
    url: "http://192.168.200.80:5004",
    color: "#f7931e",
  },
  {
    id: "notas-venta",
    name: "Notas de venta y Cotizaciones",
    description: "Sistema de creacion de notas de venta y cotizaciones",
    icon: "📋",
    url: "http://192.168.200.80:5003",
    color: "#ff8555",
  },
  {
    id: "flujo-caja",
    name: "Flujo de caja",
    description: "Plataforma de comunicación interna del equipo",
    icon: "📈",
    url: "http://192.168.200.80:5001",
    color: "#ff6b35",
    comingSoon: true,
  },
  {
    id: "gestion-tecnico",
    name: "Dashboard de Horas Diarias",
    description: "Dashboard para gestión de técnicos",
    icon: "🕐",
    url: "http://192.168.200.80:5000",
    color: "#ff7f50",
  },
  {
    id: "apk-stock-mobil",
    name: "APK Stock Móvil - Android",
    description:
      "Descarga aquí la nueva aplicación para visualizar el stock, fácil y rápido desde tus dispositivos móviles",
    icon: "📲",
    url: "http://192.168.200.80:3000/apk/app-release16.apk",
    color: "#e5522b",
  },
  {
    id: "solicitud-repuestos",
    name: "Solicitud de Repuestos",
    description: "Sistema para gestionar y solicitar repuestos",
    icon: "🔧",
    url: "http://192.168.200.100/app-login",
    color: "#ff8c42",
  },
  {
    id: "pago-comisiones",
    name: "Pago de comisiones",
    description: "Sistema de gestión y pago de comisiones",
    icon: "💰",
    url: "#",
    color: "#ff9f55",
    comingSoon: true,
  },
];

export function Dashboard() {
  const { usuario } = useAuth();

  const applications =
    usuario && isAdminUser(usuario.usuario)
      ? APPLICATIONS
      : APPLICATIONS.filter((app) => usuario?.permisos.includes(app.id));

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
              comingSoon={app.comingSoon}
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
