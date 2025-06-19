// resources/js/Utils/ReportesAN.js ANTICIPOS

import { jsPDF } from "jspdf";

// Función auxiliar para formatear el tipo de documento
const tipoDoc = (tipo) => {
    if (tipo === 'C') return 'C.C.';
    if (tipo === 'E') return 'C.E.';
    return 'NIT'; // Por defecto
};

// Función principal para generar el PDF
export function ReportesAN(sociedad, anticipos) {
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

                doc.text('Email: '  + mail, 190, 16, { align: 'right' });
                doc.text('Teléfono: ' + tel, 190, 21, { align: 'right' });
                
                doc.setFontSize(12);
                doc.text("REGISTRO DE ANTICIPOS", 105, 27, { align: 'center' });

                // Dibujar el rectángulo
                doc.setLineWidth(0.1);
                doc.setDrawColor("#000");
                doc.rect(10, 28, 190, 0.1); // Solo una línea debajo



                // Aquí iría el cuerpo del reporte (listado de grupos, etc.)
              
                doc.setFontSize(10);
                  
                let y= 36;
                 let pageHeight = 287;

                // Encabezados de la tabla

                doc.text('SOCIO',10,y);
                doc.text('FECHA',80,y);
                doc.text('DETALLE', 125, y);
                doc.text('VALOR', 167, y);
                doc.text('SALDO', 185, y);
          
                let total = 0;  //  suma de saldos

                for (let i = 0; i < anticipos.length; i++) {
         
                    y += 8;
                let saldo = (new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
    anticipos[i].ant_saldo)).replace(/[^0-9.,-]+/g, "").trim()
    let valor = (new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
    anticipos[i].ant_valor)).replace(/[^0-9.,-]+/g, "").trim();

                    doc.text(anticipos[i].soc_nombre,10,y);
                    doc.text(anticipos[i].ant_fecha,80,y);
                    doc.text(anticipos[i].ant_detalle,100,y);
                    doc.text(valor,182,y, { align: 'right' });
                    doc.text(saldo,205,y, { align: 'right' });

                    total += parseFloat(anticipos[i].ant_saldo); // Sumar el saldo al total
                                     
                    if (y >= pageHeight) {
                        doc.addPage();
                        y = 10; // Reiniciar la posición Y en una nueva página
                    }
                }

                // --- Resumen ---
                y += 8;
                let Total = (new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                    total
                )).replace(/[^0-9.,-]+/g, "").trim();
                doc.setFontSize(12);
                doc.text("RESUMEN", 105, y, { align: 'center' });
                doc.setFontSize(10);
                doc.text(`Total Saldo: ${Total}`, 190, y, { align: 'right' });

                // --- Guardar el PDF ---
                const hoy = new Date();
                const fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getDate().toString().padStart(2, '0')}`;
                const nombreArchivo = `Anticipos - ${fecha}.pdf`;
                
                doc.save(nombreArchivo);
            };
        })
        .catch(error => {
            console.error('Error cargando el logo:', error);
            alert("Hubo un error al cargar el logo para el reporte. El PDF se generará sin él.");
            // Opcional: podrías generar el PDF sin el logo aquí si falla la carga
        });
}