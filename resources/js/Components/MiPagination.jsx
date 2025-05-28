// Placeholder para Paginación si la usas
import React from 'react';
import { Link } from '@inertiajs/inertia-react';  

const Pagination = ({ links }) => (
    <div className="mt-4 flex justify-center">
        {links.map((link, key) => (
            link.url === null ?
            <div key={`${key}-disabled`}
                 className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                 dangerouslySetInnerHTML={{ __html: link.label }} /> :
            <Link key={key}
                  className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${link.active ? 'bg-blue-700 text-white' : ''}`}
                  href={link.url}
                  dangerouslySetInnerHTML={{ __html: link.label }} />
        ))}
    </div>
);