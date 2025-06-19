// resources/js/Utils/ReportesLS.js

import { jsPDF } from "jspdf";

// Función auxiliar para formatear el tipo de documento
const tipoDoc = (tipo) => {
    if (tipo === 'C') return 'C.C.';
    if (tipo === 'E') return 'C.E.';
    return 'NIT'; // Por defecto
};

// Función principal para generar el PDF
export function ReportesLS(sociedad, socios) {
    if (!sociedad) {
        console.error("No se proporcionaron datos de la sociedad para el reporte.");
        alert("Error: No se pudieron cargar los datos para el reporte.");
        return;
    }

  //  console.log('Iniciando la generación del informe para ' + sociedad.sdd_nombre);

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
                doc.addImage(base64Logo, 'PNG', 15, 8, 20, 18); // x, y, ancho, alto

                doc.setFont("times", "normal");
                doc.setFontSize(14);
                doc.text(nomEmpre, 105, 16, { align: 'center' });

                doc.setFontSize(10);
                doc.text(nit, 105, 22, { align: 'center' });

                doc.text('Email: '  + mail, 265, 16, { align: 'right' });
                doc.text('Teléfono: ' + tel, 265, 21, { align: 'right' });
                
                // Dibujar el rectángulo 0.1 una línea
                doc.setLineWidth(0.1);
                doc.setDrawColor("#000");
                doc.rect(10, 26, 275, 0.1); // Solo una línea debajo

                // Aquí iría el cuerpo del reporte (listado de grupos, etc.)
              
                doc.setFontSize(10);
                  
                let y= 32;
                let tipoSoc = '';
                let pageHeight = 280;
                doc.text('NOMBRE',10,y);
                doc.text('DOCUMENTO',96,y);
                doc.text('DIRECCION', 125, y);
                doc.text('CIUDAD', 170, y);
                doc.text('TELEFONO', 200, y);
                doc.text('EMAIL', 230, y);
                doc.text('ESTADO', 270, y);

                for (let i = 0; i < socios.length; i++) {
                    if (socios[i].soc_tiposocio !== tipoSoc) {
                        tipoSoc = socios[i].soc_tiposocio
   
                        if (tipoSoc === 'S') {
                            y += 4; 
                            doc.text('--------------------------', 5, y);
                            if (socios[i].soc_tiposocio === 'S'){
                                y += 3;
                                doc.text('SOCIOS', 10, y);
                            }

                            else{
                                y += 3;
                                doc.text('PROVEEDOES', 10, y);
                            }
                            y += 4;
                            doc.text('--------------------------', 5, y);
                        }
                        tipoSoc = socios[i].soc_tiposocio
                    }
                    y += 5;
                    //   nit = tipoDoc(socios[i].soc_tipodoc) + ' - ' + socios[i].soc_nrodoc;
                    doc.text(socios[i].soc_nombre,10,y);
                    doc.text(socios[i].soc_tipodoc,100,y);
                    doc.text(socios[i].soc_nrodoc,108,y);
                    doc.text(socios[i].soc_direccion, 120, y);
                    doc.text(socios[i].soc_ciudad, 170, y);
                    doc.text(socios[i].soc_telefono, 200, y);
                    doc.text(socios[i].soc_email, 230, y);
                    doc.text(socios[i].soc_estado, 280, y);
                    if (y >= pageHeight) {
                        doc.addPage();
                        y = 10; // Reiniciar la posición Y en una nueva página
                    }
                }
                
                         

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