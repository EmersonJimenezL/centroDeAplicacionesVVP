import { useState } from "react";
import "./AppCard.css";

interface AppCardProps {
  name: string;
  description: string;
  icon: string;
  url: string;
  color?: string;
}

export function AppCard({
  name,
  description,
  icon,
  url,
  color = "var(--orange-primary)",
}: AppCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Detectar si es un archivo descargable (APK, PDF, etc.)
    const isDownloadable = url.match(/\.(apk|pdf|zip|rar|exe)$/i);

    if (isDownloadable) {
      // Crear un elemento <a> temporal para forzar la descarga
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Para URLs normales, abrir en nueva pestaña
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="app-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ "--card-color": color } as React.CSSProperties}
    >
      <div className="app-card-inner">
        <div className="app-icon">
          <span className="icon-text">{icon}</span>
        </div>
        <div className="app-info">
          <h3 className="app-name">{name}</h3>
          <p className="app-description">{description}</p>
        </div>
        <div className={`app-arrow ${isHovered ? "active" : ""}`}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="app-card-glow"></div>
    </div>
  );
}
