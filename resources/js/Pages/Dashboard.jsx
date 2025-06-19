import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { useState, React } from 'react';
import { Head, usePage, Link} from '@inertiajs/react';

import MiCard from '@/Components/MiCard';

export default function Dashboard(props) {
    const user = usePage().props.auth.user;
    const [empresa, setEmpresa] = useState(props.empresa);


    const [imagen, setImagen] = useState(['../images/postcolor.png', '../images/postcolor.png', '../images/postcolorActual.png']);
 
    return (
        <AuthenticatedLayout empresa={empresa} 
 
        >
   
        <Head title="MultiPagos" />
           

            <>
            
                <Link
                    href="/mimenu"
                    className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                    > Menú
                </Link>

            {props.posts.data.map((posts) => (
                <MiCard titulo={posts.pos_titulo} texto={posts.pos_descripcion}
                
                 imagen={'../images/'+posts.pos_imagen+posts.pos_estado+'.png'}></MiCard>
            ))}
            </>
 
        </AuthenticatedLayout>
    );
}
