import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import Modal from '@/Components/Modal';
import {useState, React } from 'react';
import {useForm, usePage, Link} from '@inertiajs/react';
import Swal from 'sweetalert2';
import Pagination from '@/Components//Pagination';
import MiInput from '@/Components/MiInput';
import MiListaU from '@/Components/MiListaU';

export default function User(props) {
    const user = usePage().props.auth.user;
    const [modal,setModal] = useState(false);
    const [title,setTitle] = useState('');
    const [operation,setOperation] = useState(1);

    const { data,setData,delete:destroy,post,put,
    processing,reset,errors} = useForm({   
        empresa_id:user.empresa_id,
        name: '',
        email: '',
        email_verified_at: 'null',
        password: '',
        password2: '',
        role: 'User',
        remember_token: 'null',
    });

    const [role, setRole] = useState(user.role) 
    
    const openModal = (op) =>{
        setModal(true);
        setOperation(op);
        if(op === 1){
            setTitle('Añadir usuario');
            setData({ empresa_id:user.empresa_id, name:'',email:'',email_verified_at:'null',  
                password:'', role:'User', remember_token:'null'});   
        }
        else{
            setTitle('Modificar usuario');
        }
    }

    const closeModal = () =>{
        setModal(false);
    }

    const privilegioOptions = [
        { value: '', label: '-- Selecciona un privilegio --' }, // Opción por defecto/placeholder
        { value: 'A', label: 'Admin' },
        { value: 'S', label: 'Super' },
        { value: 'U', label: 'User' },
    ];

    const save = (e) =>{
            e.preventDefault();
            if(data.password !== data.password2){
                alert('Las contraseñas no coinciden. Reviselas');
                return;
            }
            if(operation === 1){  
                try {
                    const response = Inertia.post(`/user`, data);
                    alert('Datos actualizados exitosamente');
                    console.log('Respuesta:', response);
                } catch (error) {
                    console.error('Error al crear el usuario:', error);
                }
            }
            else{      
                try {
                    const response = Inertia.put(`/user/${data.id}`, data);
                    alert('Datos actualizados exitosamente');
                    console.log('Respuesta:', response);
                } catch (error) {
                    console.error('Error al actualizar el usuario:', error);
                }
                setModal(false);
            }
        }
     
        const eliminar = (id, name) =>{
            const alerta = Swal.mixin({ buttonsStyling:true});
                alerta.fire({
                title:'Seguro de eliminar el usuario '+id + ' '+name,
                text:'Se perderá el usuario',
                icon:'question', showCancelButton:true,
                confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
                cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Cancelar'
            }).then((result) => {
                if(result.isConfirmed){
                    Inertia.delete(`/user/${id}`, {
                        onSuccess: () => {
                            alert('Usuario eliminado exitosamente.');
                        },
                        onError: (errors) => {
                            console.error('Error al eliminar el usuario:', errors);
                        },
                    });
                }
            });
        }
    
    
        function handleChange(e) {
            const { name, value } = e.target;
            setData((Data) => ({
                ...Data,
                [name]: value,
            }));
        }


    return(
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}    
        >
        <div className="p-6">
            {role !== 'User' && (
                <> 
                    <button
                        className="bg-blue-500 text-white px-4 py-1 rounded mb-4"
                        onClick={() => openModal(1)}
                        > Crear User 
                    </button>
                </>
            )}
      
            <span className='bg-blue-100'> ADMINISTRADORES DEL BLOG </span>    
            <div className="bg-white grid v-screen place-items-center py-1">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='px-2 py-1'>#</th>
                            <th className='px-2 py-1'>NOMBRE</th>
                            <th className='px-2 py-1'>CORREO</th>
                            <th className='px-2 py-1'>PRIVILEGIO</th>
                            <th className='px-2 py-1' colSpan={2}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.users.data.map((user) => (
                            <tr key={user.id}>
                                <td className='border border-gray-400 px-2 py-1'>{user.id}</td>
                                <td className='border border-gray-400 px-2 py-1'>{user.name}</td>
                                <td className='border border-gray-400 px-2 py-1'>{user.email}</td>
                                <td className='border border-gray-400 px-2 py-1'>{user.role}</td>
      
                                <td className='border border-gray-400 px-2 py-1'>
                                    <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                    onClick={() => {
                                        setData(user); // Precarga los datos en el formulario
                                        openModal(0);                                          
                                    }}
                                >
                                    Editar
                                </button>
                                </td>
                                <td className='border border-gray-400 px-2 py-1'>
                                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded'
                                    onClick={() => eliminar(user.id,user.name)}>
                                    Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <Pagination class="mt-6" links={props.users.links} />
            </div>  

            <Modal show={modal} onClose={closeModal}>
            <h2 className="p-3 text-lg font-medium text-gray-900">
                {title}
            </h2>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                <form onSubmit={save}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <MiInput  Id="name" Type="text" Label="Nombre usuario" onChange={handleChange}
                        classNameI="md:col-span-2" maxLength ="100" data ={data.name} required={true}  
                        OnChange = {handleChange} ></MiInput>

                        <MiInput  Id="email" Type="email" Label="Correo" onChange={handleChange}
                        classNameI="md:col-span-2" maxLength ="100" data ={data.email} required={true}  
                        OnChange = {handleChange} ></MiInput>                        

                        <MiListaU Id="role"  Label="Priviledio"  data ={data.role} 
                        options = {privilegioOptions} OnChange={handleChange} required={true}></MiListaU>

                        <MiInput  Id="password" Type="password" Label="Contraseña" onChange={handleChange}
                        classNameI="md:col-span-2" maxLength ="100" data ={data.password} required={true}  
                        OnChange = {handleChange} ></MiInput>

                        <MiInput  Id="password2" Type="password" Label="Repite Contraseña" onChange={handleChange}
                        classNameI="md:col-span-2" maxLength ="100" data ={data.password2} required={true}  
                        OnChange = {handleChange} ></MiInput>

                        <div className="flex justify-end">
                            <button type="button"
                                className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded'
                                onClick={() => setModal(false)}
                            >
                                Cancelar
                            </button>
                            <button processing={processing} 
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold mx-3 py-1 px-1 rounded'>
                                Guardar
                            </button>
                        </div>
                    </div>                      
                    </form>
                </div>
            </Modal>       
        </div>
       </AuthenticatedLayout>             
    )
}