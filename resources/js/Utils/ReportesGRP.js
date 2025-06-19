// resources/js/Utils/ReportesAN.js grupos

import { jsPDF } from "jspdf";

// Función auxiliar para formatear el tipo de documento
const tipoDoc = (tipo) => {
    if (tipo === 'C') return 'C.C.';
    if (tipo === 'E') return 'C.E.';
    return 'NIT'; // Por defecto
};

// Función principal para generar el PDF
export function ReportesGRP(sociedad, grupos, tipo) {
    if (!sociedad) {
        console.error("No se proporcionaron datos de la sociedad para el reporte.");
        alert("Error: No se pudieron cargar los datos para el reporte.");
        return;
    }

  //  console.log('Iniciando la generación del informe para ' + sociedad.sdd_nombre);

    var doc = new jsPDF({
        orientation: "portrait", // Orientación vertical
        unit: "mm", // Unidades en milímetros
    });

    const pageHeight = 287; // Altura de la página en mm (A4 en vertical)

    // --- Datos del Reporte ---
    const nomEmpre = sociedad.sdd_nombre;
    const nit = tipoDoc(sociedad.sdd_tipodoc) + ' - ' + sociedad.sdd_nrodoc;
    const tel = sociedad.sdd_telefono;
    const mail = sociedad.sdd_email;
    const logoPath = `/logos/${sociedad.sdd_logo}`; // Ruta pública

    function header(doc) {

    }

   

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

                doc.text('Email: '  + mail, 190, 16, { align: 'right' });
                doc.text('Teléfono: ' + tel, 190, 21, { align: 'right' });
                
                doc.setFontSize(12);
                if (tipo === 'G') {
                    doc.text("RELACION DE GRUPOS Y SUS SOCIOS", 105, 27, { align: 'center' });
                }else{
                    doc.text("RELACION DE SOCIOS CON SUS GRUPOS", 105, 27, { align: 'center' });
                }

                // Dibujar el rectángulo
                doc.setLineWidth(0.1);
                doc.setDrawColor("#000");
                doc.rect(10, 28, 190, 0.1); // Solo una línea debajo
                doc.setFontSize(10);
                if (tipo === 'G') {
                    doc.text("GRUPOS ", 25, 36, { align: 'center' });
                    doc.text("SOCIOS ", 105, 36, { align: 'center' });
                }else{
                    doc.text("SOCIOS ", 25, 36, { align: 'center' });
                    doc.text("GRUPOS ", 105, 36, { align: 'center' });
                }

                let y = 42;

                for (let i = 0; i < grupos.length; i++) {
                    let grupo = grupos[i].grp_titulo +' ' + grupos[i].grp_detalle;
                    let socio = grupos[i].soc_nombre;
                    if (tipo === 'G') {
                        if(i>0 && grupos[i].grp_titulo === grupos[i-1].grp_titulo){
                            doc.text(socio.toUpperCase(), 95, y);
                        } else{
                            y+=2;
                            doc.text(grupo, 25, y);
                             y += 5;
                            doc.text(socio.toUpperCase(), 95, y);
                        }
                    } else {
                        if(i>0 && grupos[i].soc_nombre === grupos[i-1].soc_nombre){
                            doc.text(grupo, 95, y);
                        } else{
                            y+=2;
                            doc.text(socio.toUpperCase(), 25, y);
                             y += 5;
                            doc.text(grupo, 95, y);
                        }
                    }
                    y += 5;
                    if (y >= pageHeight) {
                        doc.addPage();
                        doc.setFontSize(12);
                        if (tipo === 'G') {
                            doc.text("RELACION DE GRUPOS Y SUS SOCIOS", 105, 27, { align: 'center' });
                        }else{
                            doc.text("RELACION DE SOCIOS CON SUS GRUPOS", 105, 27, { align: 'center' });
                        }

                        // Dibujar el rectángulo
                        doc.setLineWidth(0.1);
                        doc.setDrawColor("#000");
                        doc.rect(10, 28, 190, 0.1); // Solo una línea debajo
                        doc.setFontSize(10);
                        if (tipo === 'G') {
                            doc.text("GRUPOS ", 25, 36, { align: 'center' });
                            doc.text("SOCIOS ", 105, 36, { align: 'center' });
                        }else{
                            doc.text("SOCIOS ", 25, 36, { align: 'center' });
                            doc.text("GRUPOS ", 105, 36, { align: 'center' });
                        }
                        y = 42;
                    }
                }
               
                y += 8;

                doc.text("---- Fin Informe", 25, y);

                // --- Guardar el PDF ---
                const hoy = new Date();
                const fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getDate().toString().padStart(2, '0')}`;
                const nombreArchivo = `Grupos - ${fecha}.pdf`;
                
                doc.save(nombreArchivo);
            };
        })
        .catch(error => {
            console.error('Error cargando el logo:', error);
            alert("Hubo un error al cargar el logo para el reporte. El PDF se generará sin él.");
            // Opcional: podrías generar el PDF sin el logo aquí si falla la carga
        });
}