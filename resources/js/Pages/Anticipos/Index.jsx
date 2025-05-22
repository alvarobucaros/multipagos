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

export default function anticipo(props) {
    const user = usePage().props.auth.user;
    const [modal,setModal] = useState(false);
    const [title,setTitle] = useState('');
    const [operation,setOperation] = useState(1);

    const [socios, setSocios] = useState(props.socios);

    const { data,setData,delete:destroy,post,put,
    processing,reset,errors} = useForm({        
        id:'',
        ant_sociedad_id:user.sociedad_id,
        ant_socio_id: '',
        ant_fecha: '',
        ant_detalle: '',
        ant_valor: '',
        ant_saldo: '', 
        ant_estado:'I'  
    });
 
    const [isVisible, setIsVisible] = useState(false);

    const [role, setRole] = useState(user.role) 

    const openModal = (op) =>{
        setModal(true);
        setOperation(op);
        if(op === 1){
            setTitle('Añadir Anticipo');   
            setData({ant_sociedad_id:user.sociedad_id, 
                ant_socio_id:'', 
                ant_fecha:'',
                ant_detalle:'',
                ant_valor:'',    
                ant_saldo:'', 
                ant_estado:'I'  
            });
        }
        else{

            setTitle('Modificar Anticipo');
        }
    }

    const closeModal = () =>{
        setModal(false);
    }

  const save = (e) =>{
        e.preventDefault();
        if(validate()){
        data.ant_saldo = data.ant_valor;
        if(operation === 1){  
            try {
                const response = Inertia.post(`/anticipo`, data);
                alert('Datos actualizados exitosamente');
                console.log('Respuesta:', response);
            } catch (error) {
                console.error('Error al crear anticipo:', error);
            }
        }
        else{     
            try {
                const response = Inertia.put(`/anticipo/${data.id}`, data);
                alert('Datos actualizados exitosamente');
                console.log('Respuesta:', response);
            } catch (error) {
                console.error('Error al actualizar anticipo:', error);
            }
            setModal(false);
        }
    }else{
        alert('Error en la validación de datos');
    }
    }
           
    const eliminar = (id, socio, ant_fecha, estado) =>{
        if (estado === 'I'){
            const alerta = Swal.mixin({ buttonsStyling:true});
            alerta.fire({
            title:'Seguro de eliminar el anticipo ' + id + ' de : ' +socio + ' del ' + ant_fecha,
            text:'Se perderá el anticipo',
            icon:'question', showCancelButton:true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
            cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                Inertia.delete(`/anticipo/${id}`, {
                    onSuccess: () => {
                        alert('Anticipo eliminado exitosamente.');
                    },
                    onError: (errors) => {
                        console.error('Error al eliminar el anticipo:', errors);
                    },
                });
            }
        });
        }else{
            alert('No lo puede borrar, el anticipo ya está aplicado');
        }
    }
    

    
    const aplicar = (id, soc_nombre, ant_fecha, estado) =>{
        if (estado === 'I'){
        const alerta = Swal.mixin({ buttonsStyling:true});
            alerta.fire({
            title:'Aplica este anticipo : '+id + ' de ' + soc_nombre  + ' del '+ant_fecha,
            text:'Queda en firme como ingreso',
            icon:'question', showCancelButton:true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, aplicar',
            cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Regresar'
        }).then((result) => {
            if(result.isConfirmed){
                Inertia.put(`/anticipoAnt/${id}`, {
                    onSuccess: () => {
                        alert('anticipo aplicado exitosamente.');
                    },
                    onError: (errors) => {
                        console.error('Error al aplicar el anticipo:', errors);
                    },
                });
            }
        });
        }else{
            alert('El anticipo ya está aplicado');
        }
    }


    const estadoOptions = [
        { value: '', label: '-- Selecciona un estado --' }, // O pción por defecto/placeholder
        { value: 'A', label: 'Aplicado' },
        { value: 'I', label: 'Iniciado' },
    ];

    const estados = {
        A: 'Aplicado',
        I: 'Iniciado'
    };

  //  Método para el formulario

    function validate(){
        return(true)
    }


    const handleChange = (event) => {
        const { name, value } = event.target;
        setData(Data => {
            const newData = {
                ...Data,
                [name]: value
            };
            
            // Si el campo es "con_aplica" y su valor es "G", muestra el select
            if (name === 'ant_valor'){
                setData.ant_saldo = data.ant_valor
            }

            return newData;
        });
    };

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
                          > Crear anticipo 
                      </button>
                  </>
              )}
              <Link
                  href="/mimenu"
                  className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                  > Regreso
              </Link>
              <span className='bg-blue-100'> ANTICIPOS </span> 
              <div className="bg-white grid v-screen place-items-center py-1">
                  <table className="w-full border-collapse border border-gray-300">
                      <thead>
                          <tr className='bg-gray-100'>
                              <th className='px-2 py-1'>#</th>
                              <th className='px-2 py-1'>SOCIO</th>
                              <th className='px-2 py-1'>FECHA</th>
                              <th className='px-2 py-1'>DETALLE</th>
                              <th className='px-2 py-1'>VALOR</th>
                              <th className='px-2 py-1'>SALDO</th>
                              <th className='px-2 py-1'>ESTADO</th>
                              <th className='px-2 py-1' colSpan={2}></th>
                          </tr>
                      </thead>

                      <tbody>
                    
                        {props.anticipos.data.map((anticipo) => (
                        <tr key={anticipo.id} className='text-sm'>
                            <td className='border border-gray-400 px-2 py-1'>{anticipo.id}</td>                           
                            <td className='border border-gray-400 px-2 py-1'>{anticipo.soc_nombre}</td>
                            <td className='border border-gray-400 px-2 py-1'>{anticipo.ant_fecha}</td>
                            <td className='border border-gray-400 px-2 py-1'>{anticipo.ant_detalle}</td>
                            <td className='border border-gray-400 px-2 py-1'>{anticipo.ant_valor}</td>
                            <td className='border border-gray-400 px-2 py-1'>{anticipo.ant_saldo}</td>  
                            <td className='border border-gray-400 px-2 py-1'>
                                {estados[anticipo.ant_estado] || 'Desconocido'}
                            </td> 
                            {role !== 'User' && (
                                <> 
                                    <td className='border border-gray-400 px-2 py-1'>
                                    <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                    onClick={() => {
                                        setData(anticipo); // Precarga los datos en el formulario
                                        openModal(0);                                          
                                    }}
                                >
                                Editar 
                                </button>
                            </td>
                            <td className='border border-gray-400 px-2 py-1'>
                                <button
                                className="bg-green-500 text-white px-2 py-1 rounded"
                                onClick={() => aplicar(anticipo.id,anticipo.soc_nombre, anticipo.ant_fecha, anticipo.ant_estado)}>
                                
                                Aplicar
                                </button>
                            </td>
                            <td className='border border-gray-400 px-2 py-1'>
                                <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded'
                                onClick={() => eliminar(anticipo.id,anticipo.soc_nombre,
                                 anticipo.ant_fecha, anticipo.ant_estado)}>
                                Eliminar
                                </button>
                            </td>
                            </>
                        )}
                        </tr>
                          ))} 
                      </tbody>
                  </table>
                   <Pagination class="mt-6" links={props.anticipos.links} />
              </div>    

              <Modal show={modal} onClose={closeModal}>
                  <h2 className="p-3 text-lg font-medium text-gray-900">
                      {title} 
                  </h2>
                  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                      <form onSubmit={save}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <MiSelectDinamico 
                                    Id="ant_socio_id"  Label="Socio"  data ={data.ant_socio_id}
                                    listas = {socios} OnChange={handleChange} required={false}>
                                </MiSelectDinamico>
                                <br />
                                <MiInput  Id="ant_fecha" Type="date" Label="Fecha" onChange={handleChange}
                                classNameI="" maxLength ="50" data ={data.ant_fecha} required={true}  
                                OnChange = {handleChange} ></MiInput>

                                <MiInput  Id="ant_detalle" Type="text" Label="Detalle" onChange={handleChange}
                                classNameI="md:col-span-2" maxLength ="100" data ={data.ant_detalle} required={true}  
                                OnChange = {handleChange} ></MiInput>

                                <MiInput  Id="ant_valor" Type="text" Label="Valor" onChange={handleChange}
                                classNameI="" maxLength ="50" data ={data.ant_valor} required={true}  
                                OnChange = {handleChange} ></MiInput>

                                <MiLista Id="ant_estado"  Label="Estado"  data ={data.ant_estado} 
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
  