// resources/js/Utils/ReportesAN.js ANTICIPOS

import { jsPDF } from "jspdf";

// Función auxiliar para formatear el tipo de documento
const tipoDoc = (tipo) => {
    if (tipo === 'C') return 'C.C.';
    if (tipo === 'E') return 'C.E.';
    return 'NIT'; // Por defecto
};

// Función principal para generar el PDF
export function ReportesMORA(sociedad, cuentas, fecha) {
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
    const fechaCorte = fecha.toString(); 

    function diferenciaEnMeses(fechaFin) {
        const inicio = new Date(fechaCorte);
        var diff = fechaFin - inicio;

        return diff;

        // const inicio = new Date(fechaCorte);
        // const fin = new Date(fechaFin);

        // const años = fin.getFullYear() - inicio.getFullYear();
        // const meses = fin.getMonth() - inicio.getMonth();

        // return años * 12 + meses;
    }

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
                doc.addImage(base64Logo, 'PNG', 15, 8, 20, 18); // x, y, ancho, alto
                // AHORA que tenemos el logo, construimos el PDF
                
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
                doc.text('SOCIO',20,y);
                doc.text('DETALLE',76,y);
                doc.text('FECHA', 132, y);
                doc.text('NO VENCIDO', 150, y);
                doc.text('DE 01 A 30', 175, y);
                doc.text('DE 31 A 60', 198, y);
                doc.text('DE 61 A 90', 220, y);
                doc.text('DE 01 A 120',242, y);
                doc.text('MAS DE 120', 265, y);
               
                for (let i = 0; i < cuentas.length; i++) {
                    if (y >= pageHeight) {
                        doc.addPage();
                        y = 32; // Reiniciar la posición Y en una nueva página
                    }
                     y +=6;
                     let n = diferenciaEnMeses(cuentas[i].cxc_fecha)
                    doc.text(cuentas[i].soc_nombre,10,y);
                    doc.text(cuentas[i].con_descripcion,76,y);
                    doc.text(cuentas[i].cxc_fecha, 130, y);

                    doc.text(n.toString(), 265, y);
                }

//    ->select('socios.', 'conceptos.con_descripcion', 'cxh_detalle', 
//                  '', 'cxc_saldo')

let saldos = 9999999;
                let saldono = (new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
    saldos)).replace(/[^0-9.,-]+/g, "").trim()
                doc.text('SANDFORD SMITH BENJAMIN JOHN',10,y);
                doc.text('Uniformes para equipos de deporte',76,y);
                doc.text('2025-07-01', 130, y);
                doc.text(saldono, 150, y);
                doc.text(saldono, 175, y);
                doc.text(saldono, 198, y);
                doc.text(saldono, 220, y);
                doc.text(saldono,242, y);
                doc.text(saldono, 265, y);  
                let total = 0;  //  suma de saldos


    //             for (let i = 0; i < anticipos.length; i++) {
         
    //                 y += 8;
    //             let saldo = (new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
    // anticipos[i].ant_saldo)).replace(/[^0-9.,-]+/g, "").trim()
    // let valor = (new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
    // anticipos[i].ant_valor)).replace(/[^0-9.,-]+/g, "").trim();

    //                 doc.text(anticipos[i].soc_nombre,10,y);
    //                 doc.text(anticipos[i].ant_fecha,80,y);
    //                 doc.text(anticipos[i].ant_detalle,100,y);
    //                 doc.text(valor,182,y, { align: 'right' });
    //                 doc.text(saldo,205,y, { align: 'right' });

    //                 total += parseFloat(anticipos[i].ant_saldo); // Sumar el saldo al total
                                     
    //                 if (y >= pageHeight) {
    //                     doc.addPage();
    //                     y = 10; // Reiniciar la posición Y en una nueva página
    //                 }
    //             }

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
                const nombreArchivo = `CarteraMora - ${fecha}.pdf`;
                
                doc.save(nombreArchivo);
            };
        })
        .catch(error => {
            console.error('Error cargando el logo:', error);
            alert("Hubo un error al cargar el logo para el reporte. El PDF se generará sin él.");
            // Opcional: podrías generar el PDF sin el logo aquí si falla la carga
        });
}