import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { useState, React } from 'react';

import { Head, Link , usePage} from '@inertiajs/react';

import MiCard from '@/Components/MiCard';

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const empresa = usePage().props.empresas;
    const [modal,setModal] = useState(true);

    const openModal = () =>{
        setModal(true);
    }

    const closeModal = () =>{
        setModal(false);
    }

    const [imagen, setImagen] = useState(['../images/postcolor.png', '../images/postcolor.png', '../images/postcolorActual.png']);
    const [titulo,setTitulo] = useState(['Grupo de mis productos', 'SUB GRUPO de mis productos', 'Productos']);

    const texto = ['Esto Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta  Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy dia de martes Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy en la noche tambié como es hoy',
        'Web Developer is the ultimate online web developer community. de hoy es un arreglo Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy de multiples cosas que Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy yo giro',
        'Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy dia de martes Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy en la noche tambié como es hoy',
        'Web Developer is the ultimate online web developer community. You will find articles, tutorials,  Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy questions and answers, jobs, tools, and more - all from web developers in the community!'
     ]  ;  
    
    return (
        <AuthenticatedLayout empresa={empresa} 
 
        >
   
        <Head title="MultiBlog" />
            {user.name ? ( 

            <>
                <MiCard titulo={titulo[0]} texto={texto[0]} imagen={imagen[0]}></MiCard>
                <MiCard titulo={titulo[1]} texto={texto[1]} imagen={imagen[1]}></MiCard>
                <MiCard titulo={titulo[2]} texto={texto[2]} imagen={imagen[2]}></MiCard>
            </>
                ) : (
                'Debe autenticarse'
               )} 
        </AuthenticatedLayout>
    );
}
