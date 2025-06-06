import React, { useState } from 'react';

// Props esperados:
// - label: El texto de la etiqueta <label>
// - Id: El atributo 'name' del select (importante para useForm y HTML) y 'htmlFor' de la etiqueta
// - data: El valor actualmente seleccionado (viene del estado del formulario padre, ej: data.prv_estado)
// - options: Un array de objetos, cada uno con { value: '...', label: '...' }
// - onChange: La función para manejar el cambio (generalmente para actualizar el estado del formulario padre, ej: e => setData('prv_estado', e.target.value))
// - required: Booleano para marcar el campo como requerido (opcional)


export default function MiLista({Id, Label, data, options = [],  OnChange, required}) 
{
    const [inputValue, setInputValue] = useState(data || ''); // Inicializa con el valor de "data"

    const handleChange = (event) => {
        setInputValue(event.target.value); // Actualiza el estado cuando cambia el input
    };
    return (
        <div>  
            <label htmlFor={Id} className="block text-sm font-medium text-gray-700">{Label} </label>

            <select
                id={Id}
                name={Id}
                value={data} 
                onChange={OnChange} 
                required={required}
                className={`w-full px-1 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 'border-gray-300'}`}
            >
                {/* Renderiza las opciones pasadas */}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
           
        </div>
    );
}
