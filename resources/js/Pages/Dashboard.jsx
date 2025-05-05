import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { useState, React } from 'react';
import { Head, usePage} from '@inertiajs/react';

import MiCard from '@/Components/MiCard';

export default function Dashboard(props) {
    const user = usePage().props.auth.user;
    const [empresa, setEmpresa] = useState(props.empresa);
    // const openModal = () =>{
    //     setModal(true);
    // }

    // const closeModal = () =>{
    //     setModal(false);
    // }

    const [imagen, setImagen] = useState(['../images/postcolor.png', '../images/postcolor.png', '../images/postcolorActual.png']);
 
    return (
        <AuthenticatedLayout empresa={empresa} 
 
        >
   
        <Head title="MultiBlog" />
           

            <>
            {props.posts.data.map((posts) => (
                <MiCard titulo={posts.pos_titulo} texto={posts.pos_descripcion}
                
                 imagen={'../images/'+posts.pos_imagen+posts.pos_estado+'.png'}></MiCard>
            ))}
            </>
 
        </AuthenticatedLayout>
    );
}
