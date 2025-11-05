import { useEffect } from "react";
import "./InfoModal.css";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="info-modal-header">
          <h2>📢 Información Importante</h2>
          <button className="info-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="info-modal-body">
          <section className="info-section">
            <h3>📋 Nueva Modalidad de Trabajo - Importante</h3>
            <p>
              Estimado usuario, informamos que a partir de la fecha se
              implementa una nueva modalidad de trabajo en el departamento de
              TI. Le solicitamos leer atentamente las siguientes instrucciones:
            </p>
          </section>

          <section className="info-section">
            <h3>🚪 Acceso a Oficinas de TI</h3>
            <p>
              Las puertas de la oficina de TI permanecerán{" "}
              <strong>cerradas</strong>. El acceso estará{" "}
              <strong>restringido</strong>a menos que exista:
            </p>
            <ul>
              <li>Una reunión previamente coordinada</li>
              <li>Una previa coordinación de soporte presencial</li>
            </ul>
            <p>
              Para cualquier otro requerimiento, utilice los canales digitales
              indicados a continuación.
            </p>
          </section>

          <section className="info-section">
            <h3>🎫 Soporte Técnico - Plataforma de Tickets</h3>
            <p>
              Todo soporte técnico, consultas, problemas o requerimientos
              deberán ser gestionados exclusivamente a través de la
              <strong> plataforma de tickets</strong>. No se atenderán
              solicitudes presenciales sin previo registro en el sistema.
            </p>
          </section>

          <section className="info-section">
            <h3>🛒 Requerimientos de Compra</h3>
            <p>
              Cualquier solicitud de compra de equipos, software, licencias o
              insumos tecnológicos debe realizarse
              <strong>
                {" "}
                únicamente por correo electrónico o tambien por nuestra
                plataforma de tickets
              </strong>
              , siguiendo los procedimientos establecidos por el departamento.
            </p>
          </section>

          <section className="info-section">
            <h3>✉️ Canales de Comunicación Oficiales</h3>
            <p>
              Recuerde utilizar los medios apropiados para cada tipo de
              solicitud:
            </p>
            <ul>
              <li>
                <strong>Soporte técnico:</strong> Plataforma de Tickets
              </li>
              <li>
                <strong>Compras y adquisiciones:</strong> Correo electrónico y/o
                Plataforma de Tickets
              </li>
              <li>
                <strong>Reuniones:</strong> Coordinación previa obligatoria
              </li>
            </ul>
          </section>

          <section className="info-section">
            <p
              style={{
                fontStyle: "italic",
                marginTop: "1rem",
                color: "var(--primary)",
              }}
            >
              Agradecemos su comprensión y colaboración con esta nueva modalidad
              de trabajo, que nos permitirá brindar un mejor servicio y gestión
              de los recursos del departamento.
            </p>
          </section>
        </div>

        <div className="info-modal-footer">
          <button className="info-modal-button" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
