import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import Modal from '@/Components/Modal';
import { useRef, useState, React } from 'react';
import { Head ,useForm, usePage, Link} from '@inertiajs/react';
import Swal from 'sweetalert2';
import Pagination from '@/Components//Pagination';
import MiInput from '@/Components/MiInput';
import MiLista from '@/Components/MiLista';
import MiSelectDinamico from '@/Components/MiSelectDinamico';

export default function Grupo(props) {
    const user = usePage().props.auth.user;

    const [socios, setSocios] = useState(props.socios);

    const [cuentas, setCuentas] = useState(props.cuentas);


    const handleBuscaPago = (id) => {
        if (id === '') return;

        Inertia.get(`/pagoCual/${id}`, {
        only: ['cuentas'], // Solo actualiza las cuentas en la vista
        preserveState: true, // Mantiene los datos previos del formulario
    });
       
    };

//  Métodos de la vista


    function handleChange(e) {
        const { name, value } = e.target;
        setData((Data) => ({
            ...Data,
            [name]: value,
        }));
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}            
        >
            <div className="p-6">

            <Link
                href="/mimenu"
                className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                > Regreso
            </Link>
            <span className='bg-blue-100'>CUENTAS POR PAGAR DE <strong>{socios.soc_nombre}</strong></span> 
                                           
                                    
                <div className="bg-white grid v-screen place-items-center py-1">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
   
                            <tr className='bg-gray-100'>
                                <th className='px-2 py-1'>#</th>
                                <th className='px-2 py-1'>TITULO</th>
                                <th className='px-2 py-1'>DESCRIPCION</th>
                                <th className='px-2 py-1'>FECHA</th>
                                <th className='px-2 py-1'>VALOR DEUDA</th>
                                <th className='px-2 py-1'>SALDO ACTUAL</th>
                                <th className='px-2 py-1'>VLR CUOTA</th>
                            </tr>
                        </thead>
    
                        <tbody>
                            {cuentas.map((cuenta) => (
                         
                                <tr key={concepto.id} className='text-sm'>
                                    <td className='border border-gray-400 px-2 py-1'>{cuenta.id}</td>                              
                                    <td className='border border-gray-400 px-2 py-1'>{cuenta.con_titulo}</td>
                                    <td className='border border-gray-400 px-2 py-1'>{cuenta.con_descripcion}</td>
                                    <td className='border border-gray-400 px-2 py-1'>{cuenta.cxc_fecha}</td>
                                    <td className='border border-gray-400 px-2 py-1'>{cuenta.cxc_valor}</td>
                                    <td className='border border-gray-400 px-2 py-1'>{cuenta.cxc_saldo}</td>
  

                                </tr>
                            ))}
                        </tbody>
                    </table>
                        <Pagination class="mt-6" links={props.cuentas.links} />
                </div>    
            
            </div>
        </AuthenticatedLayout>
    );
}
