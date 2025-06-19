// resources/js/Utils/ReportesCP.js   CONCEPTOS

import { jsPDF } from "jspdf";

// Función auxiliar para formatear el tipo de documento
const tipoDoc = (tipo) => {
    if (tipo === 'C') return 'C.C.';
    if (tipo === 'E') return 'C.E.';
    return 'NIT'; // Por defecto
};

  const tipos = {
        I: 'Ingreso',
        G: 'Gasto',
        A: 'Ajuste',
        D: 'Deuda',
        S: 'Saldo'
    }; 

    const estados = {
        A: 'Activo',
        I: 'Inactivo'
    };

    const aplica ={
        T: 'Todos',
        G: 'Grupo'
    }

// Función principal para generar el PDF
export function ReportesCP(sociedad, conceptos) {
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
                
                doc.setFontSize(12);
                doc.text("LISTADO DE CONCEPTOS", 105, 27, { align: 'center' });

                // Dibujar el rectángulo
                doc.setLineWidth(0.1);
                doc.setDrawColor("#000");
                doc.rect(10, 28, 275, 0.1); // Solo una línea debajo



                // Aquí iría el cuerpo del reporte (listado de grupos, etc.)
              
                doc.setFontSize(10);
                  
                let y= 36;
                let pageHeight = 287;

                // Encabezados de la tabla

                doc.text('TIPO',10,y);
                doc.text('TITULO',30,y);
                doc.text('DESCRIPCION', 52, y);
                doc.text('FCH DESDE', 122, y);
                doc.text('FCH HASTA', 144, y);
                doc.text('VALOR', 174, y);
                doc.text('CUOTAS', 190, y);
                doc.text('VLR CUOTA', 212, y);
                doc.text('GRUPO', 240, y);
            
                doc.text('ESTADO', 270, y);

                doc.setFontSize(9);

                for (let i = 0; i < conceptos.length; i++) {
                    if (y >= pageHeight) {
                        doc.addPage();
                        y = 10; // Reiniciar la posición Y en una nueva página
                    }
                    y += 6;
                    // Formatear los valores
                    let valor = (new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                        conceptos[i].con_valorCobro)).replace(/[^0-9.,-]+/g, "").trim();
                    let valorCuota = (new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                        conceptos[i].con_valorCuota)).replace(/[^0-9.,-]+/g, "").trim();

                    // Tipo de concepto
                    let tipo = tipos[conceptos[i].con_tipo] || 'CONCEPTO';

                    // Estado del concepto
                    let estado = estados[conceptos[i].con_estado] || 'DESCONOCIDO';

                    // Aplicación del concepto
                    let Aplica = aplica[conceptos[i].con_aplica] || 'DESCONOCIDO';

                    let fechaDesde = conceptos[i].con_fechaDesde ? new Date(conceptos[i].con_fechaDesde).toLocaleDateString('es-CO') : '';
                    let fechaHasta = conceptos[i].con_fechaHasta ? new Date(conceptos[i].con_fechaHasta).toLocaleDateString('es-CO') : '';

                    doc.text(tipo, 10, y);
                    doc.text(conceptos[i].con_titulo, 26, y, { align: 'left' });
                    doc.text(conceptos[i].con_descripcion, 55, y, { align: 'left' });
                    doc.text(fechaDesde, 138, y, { align: 'right' });
                    doc.text(fechaHasta, 160, y, { align: 'right' });
                    doc.text(valor, 185, y, { align: 'right' });
                    doc.text(conceptos[i].con_cuotas, 200, y, { align: 'right' });
                    doc.text(valorCuota, 227, y, { align: 'right' });
                    doc.text(conceptos[i].grp_titulo, 237, y, { align: 'left' });

                    doc.text(estado, 280, y, { align: 'right' });

                }
                    
              
                // --- Resumen --- grupos.grp_titulo
                y += 8;


                doc.text("---- Fin Infome", 25, y);

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