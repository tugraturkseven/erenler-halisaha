import React from 'react';

function RadioGroup({ options, selected, setSelected }) {
    // This component is desinged to display two radio buttons of which only one can be selected at a time.
    // 
    const handleRadioChange = (e) => {
        setSelected(e.target.value);
    };

    return (
        <div className="flex flex-row gap-10">
            <div className="form-control">
                <label className="label">
                    <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-red-500"
                        value={options[0]} // Use a value attribute for the radio input
                        checked={selected === options[0]}
                        onChange={handleRadioChange} // Use onChange event handler
                    />
                    <span className="label-text ml-3">{options[0]}</span>
                </label>
            </div>

            <div className="form-control">
                <label className="label">
                    <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-green-500"
                        value={options[1]}// Use a value attribute for the radio input
                        checked={selected === options[1]}
                        onChange={handleRadioChange} // Use onChange event handler
                    />
                    <span className="label-text ml-3">{options[1]}</span>
                </label>
            </div>
        </div>
    );
}

export default RadioGroup;
