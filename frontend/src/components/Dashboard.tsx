import { AppCard } from "./AppCard";
import { UserHeader } from "./UserHeader";
import vivibraLogo from "../assets/vivipra.png";
import "../App.css";

export function Dashboard() {
  const applications = [
    {
      name: "Tickets y Gestión de activos",
      description:
        "Panel de levantamiento de tickets con modulo de gestión de activos",
      icon: "🎫",
      url: "http://192.168.200.80:5002/login",
      color: "#ff6b35",
    },
    {
      name: "Stock",
      description: "Panel de stock de vehículos",
      icon: "📦",
      url: "http://192.168.200.80:5004/login",
      color: "#f7931e",
    },
    {
      name: "Notas de venta y Cotizaciones",
      description: "Sistema de creacion de notas de venta y cotizaciones",
      icon: "📋",
      url: "http://192.168.200.80:5003/login",
      color: "#ff8555",
    },
    {
      name: "Mensajería",
      description: "Plataforma de comunicación interna del equipo",
      icon: "💬",
      url: "https://mensajeria.example.com",
      color: "#ff6b35",
    },
    {
      name: "Archivos",
      description: "Almacenamiento y gestión de documentos",
      icon: "📁",
      url: "https://archivos.example.com",
      color: "#e5522b",
    },
    {
      name: "Configuración",
      description: "Ajustes y preferencias del sistema",
      icon: "🔧",
      url: "https://config.example.com",
      color: "#ff7f50",
    },
  ];

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
        {applications.map((app, index) => (
          <AppCard
            key={index}
            name={app.name}
            description={app.description}
            icon={app.icon}
            url={app.url}
            color={app.color}
          />
        ))}
      </div>
    </div>
  );
}
