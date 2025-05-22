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
 
 export default function cuentahead(props) {
     const user = usePage().props.auth.user;
     const [modal,setModal] = useState(false);
     const [title,setTitle] = useState('');
     const [operation,setOperation] = useState(1);

    const [conceptos, setConceptos] = useState(props.conceptos);

   // const [grupos, setGrupos] = useState(props.grupos);

    const { data,setData,delete:destroy,post,put,
    processing,reset,errors} = useForm({        
        id:'',         
        cxh_sociedad_id:user.sociedad_id,
        cxh_concepto_id:'',
        cxh_detalle:'',
        cxh_valor:'',
        cxh_cuotas:'',
        cxh_fchinicio:'',
        cxh_nrocxc:'',
        cxh_total:'',
        cxh_saldo:'',
    });

   const [isVisible, setIsVisible] = useState(false);

    const [role, setRole] = useState(user.role) 

    const openModal = (op) =>{
        setModal(true);
        setOperation(op);
        if(op === 1){
            setTitle('Añadir Cuenta por cobrar');   
            setData({cxh_sociedad_id:user.sociedad_id,
                cxh_concepto_id:'',
                cxh_detalle:'',
                cxh_valor:'0',
                cxh_cuotas:'0',
                cxh_fchinicio:'',
                cxh_nrocxc:'0',
                cxh_total:'0',
                cxh_saldo:'0',  
            });
        }
        else{

            setTitle('Modificar Cuenta por cobrar');
        }
    }

    const closeModal = () =>{
        setModal(false);
    }

    const save = (e) =>{
        e.preventDefault();
        if(validate()){
        
        if(operation === 1){  
            try {
                const response = Inertia.post(`/cuentahead`, data);
                alert('Datos actualizados exitosamente');
                console.log('Respuesta:', response);
            } catch (error) {
                console.error('Error al crear cuenta por cobrar:', error);
            }
        }
        else{     
            try {
                const response = Inertia.put(`/cuentahead/${data.id}`, data);
                alert('Datos actualizados exitosamente');
                console.log('Respuesta:', response);
            } catch (error) {
                console.error('Error al actualizar cuenta por cobrar:', error);
            }
            setModal(false);
        }
        }else{
            alert('Error en la validación de datos');
        }
    }
       
    const eliminar = (id, fecha, detalle) =>{
        const alerta = Swal.mixin({ buttonsStyling:true});
        alerta.fire({
        title:'Seguro de eliminar la cuenta por cobrar ' + id + ' del : ' +fecha + ' sobre ' + detalle,
        text:'Se perderá el cuentahead',
        icon:'question', showCancelButton:true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
        cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                Inertia.delete(`/cuentahead/${id}`, {
                    onSuccess: () => {
                        alert('Cuenta eliminada exitosamente.');
                    },
                    onError: (errors) => {
                        console.error('Error al eliminar la cuenta por cobrar:', errors);
                    },
                });
            }
        });

    }

    const distribuir = (id, fecha, detalle, valor) =>{
        if (valor > 0){
        const alerta = Swal.mixin({ buttonsStyling:true});
            alerta.fire({
            title:'Distribuye entre lo socios la CXC '+id + ' de ' + fecha  + ' sobre  '+ detalle,
            text:'Genera los cobros a los socios',
            icon:'question', showCancelButton:true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, aplicar',
            cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Regresar'
        }).then((result) => {
            if(result.isConfirmed){
                Inertia.put(`/cuentaheadDis/${id}`, {
                    onSuccess: () => {
                        alert('distribuido  exitosamente.');
                    },
                    onError: (errors) => {
                        console.error('Error al aplicar distribución:', errors);
                    },
                });
            }
        });
        }else{
            alert('El valor es cero, no se puede distribuir');
        }
    }

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
            <Head title="Cuentas por cobrar" />
            <div className="p-6">
                {role !== 'User' && (
                    <> 
                        <button
                            className="bg-blue-500 text-white px-4 py-1 rounded mb-4"
                            onClick={() => openModal(1)}
                            > Crear CXC 
                        </button>
                    </>
                )}
                <Link
                    href="/mimenu"
                    className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                    > Regreso
                </Link>
                <span className='bg-blue-100'> CUENTAS POR COBRAR </span>        
            </div>
             <div className="bg-white grid v-screen place-items-center py-1">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='px-2 py-1'>#</th>
                            <th className='px-2 py-1'>CONCEPTO</th>                          
                            <th className='px-2 py-1'>DETALLE</th>
                            <th className='px-2 py-1'>FCH INICIO</th>
                            <th className='px-2 py-1'>GRUPO</th>
                            <th className='px-2 py-1'>VALOR</th>
                            <th className='px-2 py-1'>CUOTAS</th>
                            <th className='px-2 py-1'>NRO CTAS</th>
                            <th className='px-2 py-1'>TOTAL</th>
                            <th className='px-2 py-1'>SALDO</th>
                            <th className='px-2 py-1' colSpan={3}>COMANDOS</th>
                        </tr>
                    </thead>

                    <tbody>
                    {props.cuentashead.data.map((cuentahead) => (
                    <tr key={cuentahead.id} className='text-sm'>
                        <td className='border border-gray-400 px-2 py-1'>{cuentahead.id}</td>                           
                        <td className='border border-gray-400 px-2 py-1'>{cuentahead.con_descripcion}</td>
                        <td className='border border-gray-400 px-2 py-1'>{cuentahead.cxh_detalle}</td>
                        <td className='border border-gray-400 px-2 py-1'>{cuentahead.cxh_fchinicio}</td>
                        <td className='border border-gray-400 px-2 py-1'>{cuentahead.grp_titulo}</td>
                        <td className='border border-gray-400 px-2 py-1'>{cuentahead.cxh_valor}</td>
                        <td className='border border-gray-400 px-2 py-1'>{cuentahead.cxh_cuotas}</td>  
                        <td className='border border-gray-400 px-2 py-1'>{cuentahead.cxh_nrocxc}</td>
                        <td className='border border-gray-400 px-2 py-1'>{cuentahead.cxh_total}</td> 
                        <td className='border border-gray-400 px-2 py-1'>{cuentahead.cxh_saldo}</td>
                           
                        {role !== 'User' && (
                            <> 
                                <td className='border border-gray-400 px-2 py-1'>
                                <button
                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                                onClick={() => {
                                    setData(cuentahead); // Precarga los datos en el formulario
                                    openModal(0);                                          
                                }}
                            >
                            Editar 
                            </button>
                        </td>
                        <td className='border border-gray-400 px-2 py-1'>
                            <button
                            className="bg-green-500 text-white px-2 py-1 rounded"
                            onClick={() => distribuir(cuentahead.id,cuentahead.cxh_fchinicio, 
                            cuentahead.con_descripcion, cuentahead.cxh_valor)}>
                            Distribuir
                            </button>
                        </td>
                        <td className='border border-gray-400 px-2 py-1'>
                            <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded'
                            onClick={() => eliminar(cuentahead.id,cuentahead.cxh_fchinicio, cuentahead.con_descripcion)}>
                            Eliminar
                            </button>
                        </td>
                        </>
                    )}
                    </tr>
                        ))} 
                    </tbody>
                </table>
                 <Pagination class="mt-6" links={props.cuentashead.links} />
            </div>
              <Modal show={modal} onClose={closeModal}>
                  <h2 className="p-3 text-lg font-medium text-gray-900">
                      {title} 
                  </h2>
                  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                      <form onSubmit={save}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <MiSelectDinamico 
                                    Id="cxh_concepto_id"  Label="Concepto"  data ={data.cxh_concepto_id}
                                    listas = {conceptos} OnChange={handleChange} required={true}>
                                </MiSelectDinamico>
                                <br />

                                {/* <MiSelectDinamico 
                                    Id="cxh_grupo"  Label="Grupo "  data ={data.cxh_grupo}
                                    listas = {grupos} OnChange={handleChange} required={true}>
                                </MiSelectDinamico> */}

                                <br />

                                <MiInput  Id="cxh_fchinicio" Type="date" Label="Fecha inicio" onChange={handleChange}
                                classNameI="" maxLength ="50" data ={data.cxh_fchinicio} required={true}  
                                OnChange = {handleChange} ></MiInput>

                                <MiInput  Id="cxh_detalle" Type="text" Label="Detalle" onChange={handleChange}
                                classNameI="md:col-span-2" maxLength ="100" data ={data.cxh_detalle} required={true}  
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
        </AuthenticatedLayout>

     )
 }