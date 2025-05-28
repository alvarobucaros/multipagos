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

export default function PagosSoc(props) {
    const user = usePage().props.auth.user;

    const [title,setTitle] = useState('');

    const [operation,setOperation] = useState(1);

    const [socios, setSocios] = useState(props.socios);

    const [cuentas, setCuentas] = useState(props.cuentas);

    // const { data,setData,delete:destroy,post,put,
    // processing,reset,errors} = useForm({
    //     id:'',
    //     con_titulo:'', 
    //     con_descripcion:'', 
    //     cxc_fecha:'',
    //     cxc_valor:'', 
    //     cxc_saldo:'',    
    // });
 
    const [role, setRole] = useState(user.role) 
    
    const [isVisible, setIsVisible] = useState(false);

    const [isDeuda, setIsDeuda] = useState(false);


    // const save = (e) =>{
    //     e.preventDefault();
    //     if(validate()){
    //     if(operation === 1){  
    //         try {
    //             const response = Inertia.post(`/concepto`, data);
    //             alert('Datos actualizados exitosamente');
    //             console.log('Respuesta:', response);
    //         } catch (error) {
    //             console.error('Error al crear el concepto:', error);
    //         }
    //     }
    //     else{      
    //         try {
    //             const response = Inertia.put(`/concepto/${data.id}`, data);
    //             alert('Datos actualizados exitosamente');
    //             console.log('Respuesta:', response);
    //         } catch (error) {
    //             console.error('Error al actualizar el concepto:', error);
    //         }
    //         setModal(false);
    //     }
    // }else{
    //     alert('Error en la validación de datos');
    // }
    // }
 
    // const eliminar = (id, con_titulo) =>{
    //     const alerta = Swal.mixin({ buttonsStyling:true});
    //         alerta.fire({
    //         title:'Seguro de eliminar el concepto '+id + ' '+con_titulo,
    //         text:'Se perderá el concepto',
    //         icon:'question', showCancelButton:true,
    //         confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
    //         cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Cancelar'
    //     }).then((result) => {
    //         if(result.isConfirmed){
    //             Inertia.delete(`/concepto/${id}`, {
    //                 onSuccess: () => {
    //                     alert('concepto eliminado exitosamente.');
    //                 },
    //                 onError: (errors) => {
    //                     console.error('Error al eliminar el concepto:', errors);
    //                 },
    //             });
    //         }
    //     });
    // }


    //  Médotos usados en la pagina


    // function validate(){

    //     return(true)
    // }

 
    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     setData(Data => {
    //         const newData = {
    //             ...Data,
    //             [name]: value
    //         };
            
    //         if(name === 'con_tipo'){
    //             if (value === 'D') {
    //                 setIsDeuda(true);
    //             }else {
    //                 setIsDeuda(false);
    //             }
    //         }
    //         // Si el campo es "con_aplica" y su valor es "G", muestra el select
    //         if (name === 'con_aplica'){
    //             if (value === 'G') {
    //                 setIsVisible(true);
    //             }else {
    //                 setIsVisible(false);
    //             }
    //         }
    //         // cálculo del valor de la cuota
    //         if (data.con_valorCobro > 0 && data.con_cuotas > 0) {
    //             calcularCuota();
    //         }

    //         return newData;
    //     });
    // };


    
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
            <span className='bg-blue-100'> CUENTAS POR PAGAR DE <strong>{socios.soc_nombre}</strong> </span> 
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
                        {/* {cuentas.map((cuenta) => (
                        
                            <tr key={concepto.id} className='text-sm'>
                                <td className='border border-gray-400 px-2 py-1'>{cuenta.id}</td>                              
                                <td className='border border-gray-400 px-2 py-1'>{cuenta.con_titulo}</td>
                                <td className='border border-gray-400 px-2 py-1'>{cuenta.con_descripcion}</td>
                                <td className='border border-gray-400 px-2 py-1'>{cuenta.cxc_fecha}</td>
                                <td className='border border-gray-400 px-2 py-1'>{cuenta.cxc_valor}</td>
                                <td className='border border-gray-400 px-2 py-1'>{cuenta.cxc_saldo}</td>


                            </tr>
                        ))} */}
                    </tbody>
                </table>
                 {/* <Pagination class="mt-6" links={props.cuentas.links} /> */}
            </div>    

        </div>
        </AuthenticatedLayout>
    );
}
