import React, { useState } from 'react';

function DropDown({ options, onSelect, selectedOption, placeHolder }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={toggleDropdown}
                className={`m-1 btn  w-52`}
                id="dropdown-button"
                aria-haspopup="listbox"
                aria-expanded={isOpen ? "true" : "false"}
            >
                {`${placeHolder}: ${selectedOption}`}
            </button>
            <ul
                className={`${isOpen ? 'block' : 'hidden'
                    } p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 mt-2`}
                role="listbox"
                aria-labelledby="dropdown-button"
            >
                {options.map((option, index) => (
                    <li key={index} role="option">
                        <button
                            type="button"
                            onClick={() => handleSelect(option)}
                            className="hover:bg-primary-500 justify-center text-lg font-bold border border-base-200 mb-4"
                        >
                            {option}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DropDown;
