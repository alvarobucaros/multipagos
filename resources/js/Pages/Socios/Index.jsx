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

export default function Socio(props) {
    const user = usePage().props.auth.user;
    const [modal,setModal] = useState(false);
    const [title,setTitle] = useState('');
    const [operation,setOperation] = useState(1);

    const { data,setData,delete:destroy,post,put,
    processing,reset,errors} = useForm({        
        id:'',
        soc_sociedad_id:user.sociedad_id,
        soc_tiposocio: '',
        soc_nombre: '',
        soc_direccion: '',
        soc_ciudad: '',
        soc_telefono: '',
        soc_email: '',
        soc_tipodoc: '',
        soc_nrodoc: '',
        soc_estado: '',    
    });
     
    const [role, setRole] = useState(user.role) 

//  SELECT id,soc_sociedad_id,soc_tiposocio,soc_nombre,soc_direccion,soc_ciudad,
//  soc_telefono,soc_email,soc_tipodoc,soc_nrodoc,soc_estado,

    const openModal = (op) =>{
        setModal(true);
        setOperation(op);
        if(op === 1){
            setTitle('Añadir socio');
            setData({soc_sociedad_id:user.sociedad_id, 
                soc_tiposocio:'', 
                soc_nombre:'',
                soc_direccion:'',
                soc_ciudad:'',
                soc_telefono:'',
                soc_email:'',
                soc_tipodoc:'',
                soc_nrodoc:'',
                soc_estado:'A',
            });
        }
        else{
            setTitle('Modificar socio');
        }
    }

    const closeModal = () =>{
        setModal(false);
    }

    const tipoDocOptions = [
        { value: '', label: '-- Seleccione una opción --' }, 
        { value: 'N', label: 'Nit' },
        { value: 'C', label: 'Cédula Ciudadanía' },
        { value: 'E', label: 'Cédula Extranjería' },
    ];

    const tipoDoc = {
        N: 'Nit',
        C: 'CCiudadanía',
        E: 'CExtranjería'
    };

    const tipoSocOptions = [
        { value: '', label: '-- Selecciona tipo: --' }, // O pción por defecto/placeholder
        { value: 'T', label: 'Tercero' },
        { value: 'S', label: 'Socio' },
    ];

    const tiposSoc ={
        T: 'Tercero',
        S: 'Socio'
    }
    
    const estadoOptions = [
        { value: '', label: '-- Selecciona un estado --' }, // O pción por defecto/placeholder
        { value: 'A', label: 'Activo' },
        { value: 'I', label: 'Inactivo' },
    ];

    const estados = {
        A: 'Activo',
        I: 'Inactivo'
    };

    const save = (e) =>{
        e.preventDefault();
        if(validate()){
        if(operation === 1){  
            try {
                const response = Inertia.post(`/socio`, data);
                alert('Datos actualizados exitosamente');
                console.log('Respuesta:', response);
            } catch (error) {
                console.error('Error al crear el socio:', error);
            }
        }
        else{      
            try {
                const response = Inertia.put(`/socio/${data.id}`, data);
                alert('Datos actualizados exitosamente');
                console.log('Respuesta:', response);
            } catch (error) {
                console.error('Error al actualizar el socio:', error);
            }
            setModal(false);
        }
    }else{
        alert('Error en la validación de datos');
    }
    }
    
    const eliminar = (id, soc_tiposocio, soc_nombre) =>{
        let tipo = 'Socio';
        if (soc_tiposocio === 'T'){ 
            tipo = 'Tercero';
        }
        const alerta = Swal.mixin({ buttonsStyling:true});
            alerta.fire({
            title:'Seguro de eliminar el  '+tipo + ': ' +id + ' ' +soc_nombre,
            text:'Se perderá el socio',
            icon:'question', showCancelButton:true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
            cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                Inertia.delete(`/socio/${id}`, {
                    onSuccess: () => {
                        alert('socio eliminado exitosamente.');
                    },
                    onError: (errors) => {
                        console.error('Error al eliminar el socio:', errors);
                    },
                });
            }
        });
    }
    
  //  Método para el formulario
        function validate(){

        return(true)
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setData((Data) => ({
            ...Data,
            [name]: value,
        }
    ));
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
                          > Crear Socio 
                      </button>
                  </>
              )}
              <Link
                  href="/mimenu"
                  className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                  > Regreso
              </Link>
              <span className='bg-blue-100'> SOCIOS Y TERCEROS </span> 
              <div className="bg-white grid v-screen place-items-center py-1">
                  <table className="w-full border-collapse border border-gray-300">
                      <thead>
                          <tr className='bg-gray-100'>
                              <th className='px-2 py-1'>#</th>
                              <th className='px-2 py-1'>TIPO</th>
                              <th className='px-2 py-1'>NOMBRE</th>
                              <th className='px-2 py-1'>DIRECCION</th>
                              <th className='px-2 py-1'>CIUDAD</th>
                              <th className='px-2 py-1'>TELEFONO</th>
                              <th className='px-2 py-1'>EMAIL</th>
                              <th className='px-2 py-1'>TIPO_DOC</th>
                              <th className='px-2 py-1'>NUMERO_DOC</th>
                              <th className='px-2 py-1'>ESTADO</th>
                              <th className='px-2 py-1' colSpan={2}></th>
                          </tr>
                      </thead>
                      <tbody>
                          {props.socios.data.map((socio) => (
                              <tr key={socio.id} className='text-sm'>
                                  <td className='border border-gray-400 px-2 py-1'>{socio.id}</td>
                                  <td className="border border-gray-400 px-2 py-1">
                                      {tiposSoc[socio.soc_tiposocio] || 'Desconocido'}
                                  </td>                                
                                  <td className='border border-gray-400 px-2 py-1'>{socio.soc_nombre}</td>
                                  <td className='border border-gray-400 px-2 py-1'>{socio.soc_direccion}</td>
                                  <td className='border border-gray-400 px-2 py-1'>{socio.soc_ciudad}</td>
                                  <td className='border border-gray-400 px-2 py-1'>{socio.soc_telefono}</td>
                                  <td className='border border-gray-400 px-2 py-1'>{socio.soc_email}</td>
                                  <td className="border border-gray-400 px-2 py-1">
                                      {tipoDoc[socio.soc_tipodoc] || 'Desconocido'}
                                  </td>  
                                  <td className='border border-gray-400 px-2 py-1'>{socio.soc_nrodoc}</td>
                     
                                  <td className='border border-gray-400 px-2 py-1'>
                                      {estados[socio.soc_estado] || 'Desconocido'}
                                  </td>
   
                              {role !== 'User' && (
                                        <> {/* <-- Fragmento  para agrupar los td */}
                                  <td className='border border-gray-400 px-2 py-1'>
                                      <button
                                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                                      onClick={() => {
                                          setData(socio); // Precarga los datos en el formulario
                                          openModal(0);                                          
                                      }}
                                      >
                                      Editar
                                      </button>
                                  </td>
                                  <td className='border border-gray-400 px-2 py-1'>
                                      <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded'
                                      onClick={() => eliminar(socio.id,socio.soc_tiposocio,socio.soc_nombre)}>
                                        
                                      Eliminar
                                      </button>
                                  </td>
                                  </>
                              )}
                              </tr>
                          ))}
                      </tbody>
                  </table>
                   <Pagination class="mt-6" links={props.socios.links} />
              </div>    
              <Modal show={modal} onClose={closeModal}>
                  <h2 className="p-3 text-lg font-medium text-gray-900">
                      {title} 
                  </h2>
                  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                      <form onSubmit={save}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <MiLista Id="soc_tiposocio"  Label="Tipo socio"  data ={data.soc_tiposocio} 
                                options = {tipoSocOptions} OnChange={handleChange} required={true}></MiLista>
                              
                                <MiInput  Id="soc_nombre" Type="text" Label="Nombre" onChange={handleChange}
                                classNameI="md:col-span-2" maxLength ="100" data ={data.soc_nombre} required={true}  
                                OnChange = {handleChange} ></MiInput>
            
                                <MiInput  Id="soc_direccion" Type="text" Label="Dirección" onChange={handleChange}
                                classNameI="md:col-span-2" maxLength ="100" data ={data.soc_direccion} required={true}
                                OnChange = {handleChange} ></MiInput>

                                <MiInput  Id="soc_ciudad" Type="text" Label="Ciudad" onChange={handleChange}
                                classNameI="" maxLength ="50" data ={data.soc_ciudad} required={true}  
                                OnChange = {handleChange} ></MiInput>

                                <MiInput  Id="soc_telefono" Type="text" Label="Teléfono" onChange={handleChange}
                                classNameI="" maxLength ="50" data ={data.soc_telefono} required={true}  
                                OnChange = {handleChange} ></MiInput>
                                
                                <MiInput  Id="soc_email" Type="mail" Label="Email" onChange={handleChange}
                                classNameI="md:col-span-2" maxLength ="100" data ={data.soc_email} required={true}
                                OnChange = {handleChange} ></MiInput>

                                <MiLista Id="soc_tipodoc"  Label="Tipo Doc"  data ={data.soc_tipodoc} 
                                options = {tipoDocOptions} OnChange={handleChange} required={true}></MiLista>
 
                                 <MiInput  Id="soc_nrodoc" Type="text" Label="Nro Documento" onChange={handleChange}
                                classNameI="" maxLength ="50" data ={data.soc_nrodoc} required={true}  
                                OnChange = {handleChange} ></MiInput>

                              <MiLista Id="soc_estado"  Label="Estado"  data ={data.soc_estado} 
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
  