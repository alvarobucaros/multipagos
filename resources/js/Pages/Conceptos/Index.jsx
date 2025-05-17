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

export default function Concepto(props) {
    const user = usePage().props.auth.user;
    const [modal,setModal] = useState(false);
    const [title,setTitle] = useState('');
    const [operation,setOperation] = useState(1);

    const [grupos, setGrupos] = useState(props.grupos);

    const { data,setData,delete:destroy,post,put,
    processing,reset,errors} = useForm({
        id:'',
        con_sociedad_id:user.sociedad_id,
        con_tipo: '',
        con_titulo: '',
        con_descripcion: '',
        con_fechaDesde: '',
        con_fechaHasta: '',
        con_valorCobro: '',
        con_cuotas: '',
        con_valorCuota: '',
        con_concepto: '',
        con_aplica: '',
        con_estado: '',    
    });
 
    const [role, setRole] = useState(user.role) 
    
    const [isVisible, setIsVisible] = useState(false);

    const [isDeuda, setIsDeuda] = useState(false);

    const openModal = (op) =>{
        setModal(true);
        setOperation(op);
        if(op === 1){
            setTitle('Añadir concepto');
            setData({con_sociedad_id:user.sociedad_id, con_tipo:'', con_titulo:'', con_descripcion:'',
            con_fechaDesde:null, con_fechaHasta:null, con_valorCobro:'0', con_cuotas:'0', con_valorCuota:'0',
            con_grupo:'1',con_aplica:'T', con_estado:'A'});       // 2020-01-01       
        }
        else{
            if(data.con_tipo === 'D'){
                setIsDeuda(true);
            }else{
                setIsDeuda(false);
            }
            setTitle('Modificar concepto');
        }
    }

    const closeModal = () =>{
        setModal(false);
    }

    const tipoOptions = [
        { value: '', label: '-- Selecciona un tipo --' }, // O pción por defecto/placeholder
        { value: 'I', label: 'Ingreso' },
        { value: 'G', label: 'Gasto' },
        { value: 'A', label: 'Ajuste' },
        { value: 'D', label: 'Deudas' },
        { value: 'S', label: 'Saldo Inicial' },
    ];

    const tipos = {
        I: 'Iniciada',
        G: 'Gasto',
        A: 'Ajuste',
        D: 'Deuda',
        S: 'SaldoIni'
    };  

    const aplicaOptions = [
        { value: '', label: '-- Selecciona aplica a: --' }, // O pción por defecto/placeholder
        { value: 'T', label: 'Todos' },
        { value: 'G', label: 'Un Grupo' },
    ];

    const aplica ={
        T: 'Todos',
        G: 'Grupo'
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
                const response = Inertia.post(`/concepto`, data);
                alert('Datos actualizados exitosamente');
                console.log('Respuesta:', response);
            } catch (error) {
                console.error('Error al crear el concepto:', error);
            }
        }
        else{      
            try {
                const response = Inertia.put(`/concepto/${data.id}`, data);
                alert('Datos actualizados exitosamente');
                console.log('Respuesta:', response);
            } catch (error) {
                console.error('Error al actualizar el concepto:', error);
            }
            setModal(false);
        }
    }else{
        alert('Error en la validación de datos');
    }
    }
 
    const eliminar = (id, con_titulo) =>{
        const alerta = Swal.mixin({ buttonsStyling:true});
            alerta.fire({
            title:'Seguro de eliminar el concepto '+id + ' '+con_titulo,
            text:'Se perderá el concepto',
            icon:'question', showCancelButton:true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
            cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                Inertia.delete(`/concepto/${id}`, {
                    onSuccess: () => {
                        alert('concepto eliminado exitosamente.');
                    },
                    onError: (errors) => {
                        console.error('Error al eliminar el concepto:', errors);
                    },
                });
            }
        });
    }


    //  Médotos usados en la pagina


    function calcularCuota() {
    if (data.con_valorCobro > 0 && data.con_cuotas > 0) {
        setData(prevData => ({
            ...prevData,
            con_valorCuota: prevData.con_valorCobro / prevData.con_cuotas
        }));
    } else {
        setData(prevData => ({
            ...prevData,
            con_valorCuota: ''
        }));
    }
}

    
    function calcularCuotaXX() {
        if (data.con_valorCobro > 0 && data.con_cuotas > 0) {
                setData(data.con_valorCuota = 8888);
            } else {
                setData(data.con_valorCuota = '');
            }
    }

    function validate(){

        return(true)
    }

    function handleChange2(e) {
        const { name, value } = e.target;
        setData((Data) => ({
            ...Data,
            [name]: value,
        }
    ));
    }
  
      const handleChange = (event) => {
        const { name, value } = event.target;
        setData(Data => {
            const newData = {
                ...Data,
                [name]: value
            };
            
            if(name === 'con_tipo'){
                if (value === 'D') {
                    setIsDeuda(true);
                }else {
                    setIsDeuda(false);
                }
            }
            // Si el campo es "con_aplica" y su valor es "G", muestra el select
            if (name === 'con_aplica'){
                if (value === 'G') {
                    setIsVisible(true);
                }else {
                    setIsVisible(false);
                }
            }
            // cálculo del valor de la cuota
            if (data.con_valorCobro > 0 && data.con_cuotas > 0) {
                calcularCuota();
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
                        > Crear Concepto 
                    </button>
                </>
            )}
            <Link
                href="/mimenu"
                className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                > Regreso
            </Link>
            <span className='bg-blue-100'> CONCEPTOS </span> 
            <div className="bg-white grid v-screen place-items-center py-1">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='px-2 py-1'>#</th>
                            <th className='px-2 py-1'>TIPO</th>
                            <th className='px-2 py-1'>TITULO</th>
                            <th className='px-2 py-1'>DESCRIPCION</th>
                            <th className='px-2 py-1'>DESDE</th>
                            <th className='px-2 py-1'>HASTA</th>
                            <th className='px-2 py-1'>VALOR DEUDA</th>
                            <th className='px-2 py-1'>CUOTAS</th>
                            <th className='px-2 py-1'>VLR CUOTA</th>
                            <th className='px-2 py-1'>GRUPO</th>
                            <th className='px-2 py-1'>APLICA</th>
                            <th className='px-2 py-1'>ESTADO</th>
                            <th className='px-2 py-1' colSpan={2}></th>
                        </tr>
                    </thead>

                    <tbody>
                        {props.conceptos.data.map((concepto) => (
                            <tr key={concepto.id} className='text-sm'>
                                <td className='border border-gray-400 px-2 py-1'>{concepto.id}</td>
                                <td className="border border-gray-400 px-2 py-1">
                                    {tipos[concepto.con_tipo] || 'Desconocido'}
                                </td>                                
                                <td className='border border-gray-400 px-2 py-1'>{concepto.con_titulo}</td>
                                <td className='border border-gray-400 px-2 py-1'>{concepto.con_descripcion}</td>
                                <td className='border border-gray-400 px-2 py-1'>{concepto.con_fechaDesde}</td>
                                <td className='border border-gray-400 px-2 py-1'>{concepto.con_fechaHasta}</td>
                                <td className='border border-gray-400 px-2 py-1'>{concepto.con_valorCobro}</td>
                                <td className='border border-gray-400 px-2 py-1'>{concepto.con_cuotas}</td>
                                <td className='border border-gray-400 px-2 py-1'>{concepto.con_valorCuota}</td>
                                <td className='border border-gray-400 px-2 py-1'>{concepto.con_grupo}</td>
                                <td className='border border-gray-400 px-2 py-1'>
                                    {aplica[concepto.con_aplica] || 'Desconocido'}
                                </td>
                                <td className='border border-gray-400 px-2 py-1'>
                                    {estados[concepto.con_estado] || 'Desconocido'}
                                </td>
 
                            {role !== 'User' && (
                                      <> {/* <-- Fragmento  para agrupar los td */}
                                <td className='border border-gray-400 px-2 py-1'>
                                    <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                    onClick={() => {
                                        setData(concepto); // Precarga los datos en el formulario
                                        openModal(0);                                          
                                    }}
                                    >
                                    Editar
                                    </button>
                                </td>
                                <td className='border border-gray-400 px-2 py-1'>
                                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded'
                                    onClick={() => eliminar(concepto.id,concepto.con_titulo)}>
                                    Eliminar
                                    </button>
                                </td>
                                </>
                            )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <Pagination class="mt-6" links={props.conceptos.links} />
            </div>    
            <Modal show={modal} onClose={closeModal}>
                <h2 className="p-3 text-lg font-medium text-gray-900">
                    {title} 
                </h2>
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                    <form onSubmit={save}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <MiLista Id="con_tipo"  Label="Tipo"  data ={data.con_tipo} 
                            options = {tipoOptions} OnChange={handleChange} required={true}></MiLista>
                            
                            <MiInput  Id="con_titulo" Type="text" Label="Titulo concepto" onChange={handleChange}
                            classNameI="" maxLength ="50" data ={data.con_titulo} required={true}  
                            OnChange = {handleChange} ></MiInput>
        
                            <MiInput  Id="con_descripcion" Type="text" Label="Descripción" onChange={handleChange}
                            classNameI="md:col-span-2" maxLength ="150" data ={data.con_descripcion} required={true}
                            OnChange = {handleChange} ></MiInput>
                            {isDeuda ? (
                            <>
                                <MiInput  Id="con_fechaDesde" Type="date" Label="Fecha desde" onChange={handleChange}
                                classNameI="" maxLength ="50" data ={data.con_fechaDesde} required={false}  
                                OnChange = {handleChange} ></MiInput>

                                <MiInput  Id="con_fechaHasta" Type="date" Label="Fecha Hasta" onChange={handleChange}
                                classNameI="" maxLength ="50" data ={data.con_fechaHasta} required={false}  
                                OnChange = {handleChange} ></MiInput>

                                <MiInput  Id="con_valorCobro" Type="text" Label="Valor concepto" onChange={handleChange}
                                classNameI="" maxLength ="20" data ={data.con_valorCobro} required={false}  
                                OnChange = {handleChange} ></MiInput>

                                <MiInput  Id="con_cuotas" Type="text" Label="Nro de Cuotas" onChange={handleChange}
                                classNameI="" maxLength ="20" data ={data.con_cuotas} required={false}  
                                OnChange = {handleChange} onBlur={calcularCuota}></MiInput>

                                <input type="text" name="con_valorCuota" id="con_valorCuota" onBlur={calcularCuota}
                                value={data.con_valorCuota} readonly='yes'/>

                                {/* <MiInput  Id="con_valorCuota" Type="text" Label="Valor de la Cuotas" onChange={handleChange}
                                classNameI="" maxLength ="100" data ={data.con_valorCuota} required={false}  
                                OnChange = {handleChange} ></MiInput> */}
                            
                                <MiLista Id="con_aplica"  Label="Aplica A:"  data ={data.con_aplica} 
                                options = {aplicaOptions} OnChange={handleChange} required={false}></MiLista>
                            </>
                            ) : null}
                            {isVisible ? (
                                <MiSelectDinamico 
                                    Id="con_grupo"  Label="Grupo"  data ={data.con_grupo}
                                    listas = {grupos} OnChange={handleChange} required={false}>
                                </MiSelectDinamico>
                            ) : null}
                         

                            <MiLista Id="con_estado"  Label="Estado"  data ={data.con_estado} 
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
