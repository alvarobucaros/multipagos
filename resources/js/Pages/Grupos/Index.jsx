import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import Modal from '@/Components/Modal';
import { useRef, useState, React } from 'react';
import { Head ,useForm, usePage, Link} from '@inertiajs/react';
import Swal from 'sweetalert2';
import Pagination from '@/Components//Pagination';
import MiInput from '@/Components/MiInput';
import MiLista from '@/Components/MiLista';

export default function Grupo(props) {
    const user = usePage().props.auth.user;
    const [modal,setModal] = useState(false);
    const [title,setTitle] = useState('');
    const [operation,setOperation] = useState(1);

    const { data,setData,delete:destroy,post,put,
    processing,reset,errors} = useForm({
        id:'',       
        grp_empresa_id:user.empresa_id,
        grp_titulo: '',
        grp_detalle: '',
        grp_estado: 'A',
    });

    const [role, setRole] = useState(user.role) 
    
    const openModal = (op) =>{
        setModal(true);
        setOperation(op);
        if(op === 1){
            setTitle('Añadir grupo');
            setData({grp_empresa_id:user.empresa_id, grp_titulo:'', grp_detalle:'', grp_estado:'A'});   
        }
        else{
            setTitle('Modificar grupo');
        }
    }

    const closeModal = () =>{
        setModal(false);
    }
    
    const estadoOptions = [
        { value: '', label: '-- Selecciona un estado --' }, // O pción por defecto/placeholder
        { value: 'A', label: 'Activo' },
        { value: 'I', label: 'Inactivo' },
    ];

      const save = (e) =>{
          e.preventDefault();
          if(operation === 1){  
              try {
                  const response = Inertia.post(`/grupo`, data);
                  alert('Datos actualizados exitosamente');
                  console.log('Respuesta:', response);
              } catch (error) {
                  console.error('Error al crear el grupo:', error);
              }
          }
          else{      
              try {
                  const response = Inertia.put(`/grupo/${data.id}`, data);
                  alert('Datos actualizados exitosamente');
                  console.log('Respuesta:', response);
              } catch (error) {
                  console.error('Error al actualizar el grupo:', error);
              }
              setModal(false);
          }
      }
 
    const eliminar = (id, grp_titulo) =>{
        const alerta = Swal.mixin({ buttonsStyling:true});
            alerta.fire({
            title:'Seguro de eliminar el grupo '+id + ' '+grp_titulo,
            text:'Se perderá el grupo',
            icon:'question', showCancelButton:true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
            cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                Inertia.delete(`/grupo/${id}`, {
                    onSuccess: () => {
                        alert('grupo eliminado exitosamente.');
                    },
                    onError: (errors) => {
                        console.error('Error al eliminar el grupo:', errors);
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
    
    return (
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
                        > Crear Grupo 
                    </button>
                </>
            )}
            <Link
                href="/mimenu"
                className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                > Regreso
            </Link>
            <span className='bg-blue-100'> GRUPOS DE POSTS</span> 
            <div className="bg-white grid v-screen place-items-center py-1">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='px-2 py-1'>#</th>
                            <th className='px-2 py-1'>TITULO</th>
                            <th className='px-2 py-1'>DETALLE</th>
                            <th className='px-2 py-1'>ESTADO</th>
                            <th className='px-2 py-1' colSpan={2}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.grupos.data.map((grupo) => (
                            <tr key={grupo.id}>
                                <td className='border border-gray-400 px-2 py-1'>{grupo.id}</td>
                                <td className='border border-gray-400 px-2 py-1'>{grupo.grp_titulo}</td>
                                <td className='border border-gray-400 px-2 py-1'>{grupo.grp_detalle}</td>
                                <td className='border border-gray-400 px-2 py-1'>{grupo.grp_estado}</td>
                                {role !== 'User' && (
                                      <> {/* <-- Fragmento  para agrupar los td */}
                                <td className='border border-gray-400 px-2 py-1'>
                                    <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                    onClick={() => {
                                        setData(grupo); // Precarga los datos en el formulario
                                        openModal(0);                                          
                                    }}
                                    >
                                    Editar
                                    </button>
                                </td>
                                <td className='border border-gray-400 px-2 py-1'>
                                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded'
                                    onClick={() => eliminar(grupo.id,grupo.grp_titulo)}>
                                    Eliminar
                                    </button>
                                </td>
                                </>
                            )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <Pagination class="mt-6" links={props.grupos.links} />
            </div>    
            <Modal show={modal} onClose={closeModal}>
                <h2 className="p-3 text-lg font-medium text-gray-900">
                    {title} 
                </h2>
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                    <form onSubmit={save}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <MiInput  Id="grp_titulo" Type="text" Label="Titulo Grupo" onChange={handleChange}
                        classNameI="md:col-span-2" maxLength ="100" data ={data.grp_titulo} required={true}  
                        OnChange = {handleChange} ></MiInput>

                        <MiInput  Id="grp_detalle" Type="text" Label="Detalles" onChange={handleChange}
                        classNameI="md:col-span-2" maxLength ="150" data ={data.grp_detalle} required={true}
                        OnChange = {handleChange} ></MiInput>
                    
                        <MiLista Id="grp_estado"  Label="Estado"  data ={data.grp_estado} 
                        options = {estadoOptions} OnChange={handleChange} required={true}></MiLista>

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
    );
}
