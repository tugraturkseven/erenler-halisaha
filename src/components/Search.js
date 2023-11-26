import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'



function Search({ handleChange }) {

    return (
        <div className="border rounded-lg p-2 w-50 border-slate-500 hover:border-slate-300 second:bg-red-600  md:visible">
            <a href='#' className='w-5 h-5 float-left m-auto'>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#ffffff" }} className='w-4 h-4 pb-1 pt-0.5 pl-0.5 opacity-70' />
            </a>
            <input type="text"
                className="flex  bg-transparent target:border-cyan-50  text-slate-300 placeholder-slate-400 placeholder:italic focus:outline-none
            px-1 text-sm" placeholder='Kimi ariyorsunuz?' onChange={(e) => handleChange(e.target.value)} />

        </div>
    )
}

export default Search