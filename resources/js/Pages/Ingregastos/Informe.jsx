import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';

import { useRef, useState, useEffect, React } from 'react';
import { Head ,useForm, usePage, Link} from '@inertiajs/react';
import Monto from '@/Components/Monto';


import { jsPDF } from "jspdf";

export default function Ingregasto(props) {
    const user = usePage().props.auth.user;
 
    const [socio, setSocio] = useState(props.socios || {});

    const [sociedad, setSociedad] = useState(props.sociedad || {});

    const [abonos, setAbonos] = useState(props.abonos || []);

    const [ingregasto, setImgregastos] = useState(props.ingregasto || []);

    console.log(ingregasto)

    const tipoDoc = (tipo) => {
        var ti= 'NIT';
        if(tipo === 'C'){ti = 'C.C.'};
        if(tipo === 'E'){ti = 'C.E.'};
        return (ti);
    }

    const hoy= Date("d-m-Y");
    const nomEmpre = sociedad.sdd_nombre;         
    const nit = tipoDoc(sociedad.sdd_tipodoc) + '- ' +  sociedad.sdd_nrodoc;
    const tel = sociedad.sdd_telefono; 
    const mail = sociedad.sdd_email;  
    const logo = '../../../logos/images/' + sociedad.sdd_logo;


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

    doc.text('SOCIO',13,28)
    doc.text(socio.soc_nombre.toUpperCase(),13,33)
    doc.text(tipoDoc(socio.soc_tipodoc) + '- ' +  socio.soc_nrodoc,93,33)
    doc.text('Teléfono: ' + socio.soc_telefono,13,37)
    doc.text('Correo  : ' + socio.soc_email,13,41)

    doc.rect(10, 55, 186, 6);
    doc.text('CONCEPTO',20,59)
    doc.text('FECHA',90,59)
    doc.text('DEUDA',122,59)
    doc.text('  VLR ABONO',139,59)
    doc.text('SALDO',174,59)

    if (ingregasto.iga_tipo = 'I')
    {
        doc.text('INGRESO NRO: ',25,51)
    }else{
        doc.text('EGRESO NRO: ',25,51)
    }
    doc.text(ingregasto.iga_numero.toString(), 53, 51);

    doc.text('Del ' + ingregasto.iga_Fecha, 61 , 51)

    doc.text(ingregasto.iga_detalle, 86 , 51)

    let total = 0;
    let y= 0;
     if (ingregasto.iga_tipo = 'I')
    {
        for (let i = 0; i < abonos.length; i++) {
            y = 65 + i*4;
            let saldo = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
        abonos[i].abo_saldo)
                let abono = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
        abonos[i].abo_abono)
            total += abonos[i].abo_saldo;
        let neto = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
        abonos[i].abo_saldo - abonos[i].abo_abono)             

            doc.text(abonos[i].con_descripcion,10,y)
            doc.text(abonos[i].abo_fecha,88,y)
            doc.text(saldo,123,y)
            doc.text(abono,148,y)
            doc.text(neto,175,y)
        }
        y += 6
        doc.line(10, y, 197, y);
        y += 5
        doc.text('TOTAL ABONO',137,y)
        let total2 = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
        total)

        //   falta los anticipos, colocarle un campo para vincular al id del ingreso y poder enlazarlo
        //  falta total en letras, fecha de impresi+on  y las firmas

        doc.text(total2,173,y)
    }else{
        //  trabajare los egresos.
    }

    doc.save("texto.pdf");
}