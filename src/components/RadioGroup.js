import React from 'react';

function RadioGroup({ type, setType }) {
    const handleRadioChange = (e) => {
        setType(e.target.value);
    };





    return (
        <div className="flex flex-row gap-10">
            <div className="form-control">
                <label className="label">
                    <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-red-500"
                        value="customer" // Use a value attribute for the radio input
                        checked={type === 'customer'}
                        onChange={handleRadioChange} // Use onChange event handler
                    />
                    <span className="label-text ml-3">Müşteri</span>
                </label>
            </div>

            <div className="form-control">
                <label className="label">
                    <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-green-500"
                        value="admin" // Use a value attribute for the radio input
                        checked={type === 'admin'}
                        onChange={handleRadioChange} // Use onChange event handler
                    />
                    <span className="label-text ml-3">Yönetici</span>
                </label>
            </div>
        </div>
    );
}

export default RadioGroup;
