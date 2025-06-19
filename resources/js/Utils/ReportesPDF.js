// resources/js/Utils/ReportesPDF.js

import { jsPDF } from "jspdf";

// Función auxiliar para formatear el tipo de documento
const tipoDoc = (tipo) => {
    if (tipo === 'C') return 'C.C.';
    if (tipo === 'E') return 'C.E.';
    return 'NIT'; // Por defecto
};

// Función principal para generar el PDF
export function ReportesPDF(sociedad) {
    if (!sociedad) {
        console.error("No se proporcionaron datos de la sociedad para el reporte.");
        alert("Error: No se pudieron cargar los datos para el reporte.");
        return;
    }

    console.log('Iniciando la generación del informe para ' + sociedad.sdd_nombre);

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
    });

    // --- Datos del Reporte ---
    const nomEmpre = sociedad.sdd_nombre;
    const nit = tipoDoc(sociedad.sdd_tipodoc) + ' - ' + sociedad.sdd_nrodoc;
    const tel = sociedad.sdd_telefono;
    const mail = sociedad.sdd_email;
    const logoPath = `/logos/${sociedad.sdd_logo}`; // Ruta pública

    // --- Lógica Asíncrona del Logo ---
    // El resto del PDF se debe generar DENTRO del callback del logo
    // para asegurar que el logo se cargue antes de guardar.
    fetch(logoPath)
        .then(response => {
            if (!response.ok) throw new Error('Logo no encontrado');
            return response.blob();
        })
        .then(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64Logo = reader.result;
                
                // AHORA que tenemos el logo, construimos el PDF
                doc.addImage(base64Logo, 'PNG', 15, 10, 20, 20); // x, y, ancho, alto

                doc.setFont("times", "normal");
                doc.setFontSize(14);
                doc.text(nomEmpre, 105, 16, { align: 'center' });

                doc.setFontSize(10);
                doc.text(nit, 105, 22, { align: 'center' });

                doc.text('Email: '  + mail, 190, 16, { align: 'right' });
                doc.text('Teléfono: ' + tel, 190, 21, { align: 'right' });
                
                // Dibujar el rectángulo
                doc.setLineWidth(0.1);
                doc.setDrawColor("#000");
                doc.rect(10, 26, 190, 0.1); // Solo una línea debajo

                // Aquí iría el cuerpo del reporte (listado de grupos, etc.)
                // Por ejemplo:
                doc.setFontSize(12);
                doc.text("LISTADO DE GRUPOS", 105, 35, { align: 'center' });
                // ...lógica para dibujar la tabla de grupos...

                // --- Guardar el PDF ---
                const hoy = new Date();
                const fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getDate().toString().padStart(2, '0')}`;
                const nombreArchivo = `ListadoGrupos-${sociedad.sdd_nombre.replace(/\s/g, '_')}-${fecha}.pdf`;
                
                doc.save(nombreArchivo);
            };
        })
        .catch(error => {
            console.error('Error cargando el logo:', error);
            alert("Hubo un error al cargar el logo para el reporte. El PDF se generará sin él.");
            // Opcional: podrías generar el PDF sin el logo aquí si falla la carga
        });
}