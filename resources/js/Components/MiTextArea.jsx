import React, { useState } from 'react';

export default function MiTextArea({ Id, Rows, Cols, Label, className, data, required, OnChange }) {
    const [inputValue, setInputValue] = useState(data || ''); // Inicializa con el valor de "data"

    const handleChange = (event) => {
        setInputValue(event.target.value); // Actualiza el estado cuando cambia el input
    };

    return (
        <div className={className}>
        <label htmlFor={Id} className="block text-sm font-medium text-gray-700">{Label} </label>

        <textarea   
        id={Id}
        name={Id}
        rows={Rows} 
        cols={Cols}
        value={data}         
        className={`w-full px-1 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 border-gray-300`}
        required={required}
        onChange={OnChange}
        >
         </textarea>               
    </div>
    );
}

