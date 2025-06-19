// resources/js/Utils/ReportesAN.js grupos


import { jsPDF } from "jspdf";
import { NumberAsString } from '@/Utils/formatters';

// Función auxiliar para formatear el tipo de documento
const tipoDoc = (tipo) => {
    if (tipo === 'C') return 'C.C.';
    if (tipo === 'E') return 'C.E.';
    return 'NIT'; // Por defecto
};

// Función principal para generar el PDF  
export function ReportesIG(sociedad, socios, ingregasto, abonos, anticipos) {
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
    const administra = sociedad.sdd_administra.toUpperCase();


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
 
      
                doc.setFontSize(10);
                let y=36; 
                const line_width = 0.1;
                const line_color = "#000";

                // Dibujar el rectángulo
                doc.setLineWidth(line_width);
                doc.setDrawColor(line_color);
                doc.rect(10, 30, 190, 20);
                if (ingregasto.iga_tipo === 'I'){
                    doc.text('SOCIO',13,34)
                }
            
                doc.text(socios.soc_nombre.toUpperCase(),13,40)
                doc.text(tipoDoc(socios.soc_tipodoc) + '- ' +  socios.soc_nrodoc,93,40)
                doc.text('Teléfono: ' + socios.soc_telefono,13,44)
                doc.text('Correo  : ' + socios.soc_email,13,48)
                doc.setFontSize(12);

                if (ingregasto.iga_tipo === 'I')
                {
                    doc.text('INGRESO NRO: ',20,56)
                    doc.text(ingregasto.iga_numero.toString(), 50, 56);
                    doc.text('Del ' + ingregasto.iga_Fecha, 60 , 56)
                    doc.text(ingregasto.iga_detalle, 90 , 56)
                    doc.setFontSize(10);
                    doc.rect(10, 62, 190, 6);
                    doc.text('CONCEPTO',20,66)
                    doc.text('FECHA',90,66)
                    doc.text('DEUDA',122,66)
                    doc.text('  VLR ABONO',139,66)
                    doc.text('SALDO',174,66)
                }else{
                    doc.text('SOCIO / TERCERO',13,34)
                    doc.text('EGRESO NRO: ',25,63)
                    doc.text(ingregasto.iga_numero.toString(), 53, 63);
                    doc.text('De   ' + ingregasto.iga_Fecha, 61 , 63)
                    doc.setFontSize(10);
                }

               let total = 0;
               y= 0;
               if (ingregasto.iga_tipo === 'I')
               {
                   for (let i = 0; i < abonos.length; i++) {
                       y = 73 + i*4;
                       let saldo = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                   abonos[i].abo_saldo)
                           let abono = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                   abonos[i].abo_abono)
                           total += parseFloat(abonos[i].abo_abono);
                       let neto = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                       abonos[i].abo_saldo - abonos[i].abo_abono)             
               
                           doc.text(abonos[i].con_descripcion,10,y)
                           doc.text(abonos[i].abo_fecha,88,y)
                           doc.text(saldo,123,y)
                           doc.text(abono,148,y)
                           doc.text(neto,175,y)
                       }
                       // Imprime los anticipos
                       let y1 = y+5;
                       for (let i = 0; i < anticipos.length; i++) {
                           y = y1 + i*4;
                           let saldo = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                   anticipos[i].ant_valor)
                           doc.text(anticipos[i].ant_detalle,10,y)
                           doc.text(anticipos[i].ant_fecha,88,y)
                           doc.text(saldo,148,y)
                           total += parseFloat(anticipos[i].ant_valor);
                       };
               
                       if (y > 0){                      
                            y += 6
                            doc.line(10, y, 197, y);
                            y += 5
                            doc.text('TOTAL ABONO',137,y)
                            let total2 = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                            total)
                    
                            //  falta total en letras, fecha de impresi+on  y las firmas
                    
                            doc.text(total2,173,y)
                            y += 8;
                            let montoEnLetras = NumberAsString(total);
                            doc.text('SON : ' + montoEnLetras,20,y)
                            y += 20;
                                doc.line(20, y, 80, y);
                                y += 3;
                            doc.text(administra,25,y)
                       }
                   }else{
                       doc.text('En la fecha se le ha pagado a:',25,70)
                       doc.text(socios.soc_nombre,70,70)
                       doc.text('Indetificado con ',25,76) 
                       doc.text(tipoDoc(socios.soc_tipodoc) + '- ' +  socios.soc_nrodoc,53,76)
                       doc.text('Correo : ',25,82)
                       doc.text(socios.soc_email,53,82)
                       doc.text('Por concepto de',25,88)
                       let detalle =  ingregasto.iga_detalle
                       doc.text(detalle,53,88)

                       doc.text('La suma de',25,94)
                       let saldo = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                   ingregasto.iga_credito)
                       let montoEnLetras = NumberAsString( ingregasto.iga_credito) + '('+ saldo + ')';
                       doc.text(montoEnLetras,53,94)
               
                       y = 110;
                       doc.line(20, y, 80, y);
                       y += 3;
                       doc.text(administra,25,y)
                
                   }
               

                // --- Guardar el PDF ---
                const hoy = new Date();
                const fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getDate().toString().padStart(2, '0')}`;
                const nombreArchivo = `IngreGasto - ${fecha}.pdf`;
                
                doc.save(nombreArchivo);
            };
        })
        .catch(error => {
            console.error('Error cargando el logo:', error);
            alert("Hubo un error al cargar el logo para el reporte. El PDF se generará sin él.");
            // Opcional: podrías generar el PDF sin el logo aquí si falla la carga
        });
}