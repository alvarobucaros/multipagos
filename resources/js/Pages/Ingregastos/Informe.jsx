import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';

import { useRef, useState, useEffect, React } from 'react';
import { Head ,useForm, usePage, Link} from '@inertiajs/react';
// import Monto from '@/Utils/Monto';   http://localhost:8000/datosIngreGasto/6|2|I|12"
import { NumberAsString } from '@/Utils/formatters';

import { jsPDF } from "jspdf";

export default function Ingregasto(props) {
    const user = usePage().props.auth.user;
 
    const[llave, setLlave] = useState(props.llave || {});

    const [socio, setSocio] = useState(props.socios || {});

    const [sociedad, setSociedad] = useState(props.sociedad || {});

    const [abonos, setAbonos] = useState(props.abonos || []);

    const [ingregasto, setImgregastos] = useState(props.ingregasto || []);

    const [anticipo, setAnticipo] = useState(props.anticipos || []);

   // console.log(ingregasto)

    const tipoDoc = (tipo) => {
        var ti= 'NIT';
        if(tipo === 'C'){ti = 'C.C.'};
        if(tipo === 'E'){ti = 'C.E.'};
        return (ti);
    }


    const hoy = new Date();
    const formatDate = (d) => {
        return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() 
    }

    const nomEmpre = sociedad.sdd_nombre;         
    const nit = tipoDoc(sociedad.sdd_tipodoc) + '- ' +  sociedad.sdd_nrodoc;
    const tel = sociedad.sdd_telefono; 
    const mail = sociedad.sdd_email;
    const administra = sociedad.sdd_administra.toUpperCase();
    const logo = 'logos/' + sociedad.sdd_logo;
    
    function imprimelogo() {
        fetch('/logos/logo.png') // Usa la ruta pública
        .then(response => response.blob())
        .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64Logo = reader.result;
            doc.addImage(base64Logo, 'PNG', 5, 10, 20, 20);
            
        };
    })
    .catch(error => console.error('Error cargando el logo:', error));
    
    } 

    var pdfCreado ='';
    var longitud = 0; 

    var doc = new jsPDF({
        orientation: "portrait", // Orientación vertical
        unit: "mm", // Unidades en milímetros
    });

    doc.setFont("times", "normal");
    // Configuración de las líneas

    var line_width = 0.1; // Ancho de la línea
    var line_color = "#000"; // Color de la línea

    doc.setFontSize(14);
    longitud = nomEmpre.length;
    doc.text(nomEmpre,(70-longitud/2),16)

    doc.setFontSize(10);
    doc.text(nit,80,20)
 
    doc.text('Email: ' + mail,160,16)
    doc.text('Teléfono: '+ tel,160,21)

    // Dibujar el rectángulo
    doc.setLineWidth(line_width);
    doc.setDrawColor(line_color);
    doc.rect(10, 24, 186, 20);
    if (ingregasto.iga_tipo === 'I'){
        doc.text('SOCIO',13,28)
    }
  
    doc.text(socio.soc_nombre.toUpperCase(),13,33)
    doc.text(tipoDoc(socio.soc_tipodoc) + '- ' +  socio.soc_nrodoc,93,33)
    doc.text('Teléfono: ' + socio.soc_telefono,13,37)
    doc.text('Correo  : ' + socio.soc_email,13,41)
   // doc.addImage(logo, 'PNG', 5, 10, 20, 20);
    imprimelogo();
    doc.setFontSize(12);
    if (ingregasto.iga_tipo === 'I')
    {
        doc.text('INGRESO NRO: ',20,51)
        doc.text(ingregasto.iga_numero.toString(), 50, 51);
        doc.text('Del ' + ingregasto.iga_Fecha, 60 , 51)
        doc.text(ingregasto.iga_detalle, 90 , 51)
        doc.setFontSize(10);
        doc.rect(10, 55, 186, 6);
        doc.text('CONCEPTO',20,59)
        doc.text('FECHA',90,59)
        doc.text('DEUDA',122,59)
        doc.text('  VLR ABONO',139,59)
        doc.text('SALDO',174,59)
    }else{
        doc.text('EGRESO NRO: ',25,51)
        doc.text(ingregasto.iga_numero.toString(), 53, 51);
        doc.text('De   ' + ingregasto.iga_Fecha, 61 , 51)   
        doc.setFontSize(10);
    }
 

    let total = 0;
    let y= 0;
     if (ingregasto.iga_tipo === 'I')
    {
        for (let i = 0; i < abonos.length; i++) {
            y = 65 + i*4;
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
        for (let i = 0; i < anticipo.length; i++) {
            y = y1 + i*4;
            let saldo = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
    anticipo[i].ant_valor)
            doc.text(anticipo[i].ant_detalle,10,y)
            doc.text(anticipo[i].ant_fecha,88,y)
            doc.text(saldo,148,y)
            total += parseFloat(anticipo[i].ant_valor);
        };

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
    }else{
        doc.text('En la fecha se le ha pagado a:',25,60)
        doc.text(socio.soc_nombre,70,60)
        doc.text('Indetificado con ',25,66) 
        doc.text(tipoDoc(socio.soc_tipodoc) + '- ' +  socio.soc_nrodoc,53,66)
        doc.text('Correo : ',25,72)
        doc.text(socio.soc_email,53,72)
        doc.text('Por concepto de',25,78)
        let detalle =  ingregasto.iga_detalle
        doc.text(detalle,53,78)
    
        doc.text('La suma de',25,84) 
        let saldo = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
    ingregasto.iga_credito)
        let montoEnLetras = NumberAsString( ingregasto.iga_credito) + '('+ saldo + ')';
        doc.text(montoEnLetras,53,84)

        y = 100;
        doc.line(20, y, 80, y);
        y += 3;
        doc.text(administra,25,y)
   
        //  trabajare los egresos.  
        // id, , , , , , iga_concepto_id, iga_detalle, iga_Documento, iga_credito
        // 'soc_nombre', 'soc_telefono', 'soc_email' ,'soc_tipodoc' ,'soc_nrodoc'
    }

    pdfCreado = socio.soc_nombre.toUpperCase()+formatDate(hoy);

    doc.save(pdfCreado);

}