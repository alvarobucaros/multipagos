import {  useState, React } from 'react';
import {  usePage, } from '@inertiajs/react';

import { NumberAsString } from '@/Utils/formatters';

import { jsPDF } from "jspdf";

export default function reportesSociedad(props) {
    const user = usePage().props.auth.user;
 


    const [sociedad, setSociedad] = useState(props.sociedad || {});



   // console.log(reportesSociedad)

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
    
    console.log('Imprimiendo informe de ' + nomEmpre);


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


    let pdfCreado = socio.soc_nombre.toUpperCase()+formatDate(hoy);

    doc.save(pdfCreado);

}