import React from 'react'

function RadioGroup() {
    return (
        <div className='flex flex-row gap-3'>
            <div className="form-control">
                <label className="label">
                    <input type="radio" name="radio-10" className="radio checked:bg-red-500" checked />
                    <span className="label-text ml-3">Abone</span>

                </label>
            </div>
            <div className="form-control">
                <label className="label ">
                    <input type="radio" name="radio-10" className="radio checked:bg-blue-500" />
                    <span className="label-text ml-3">Duzenli</span>
                </label>
            </div>
            <div className="form-control">
                <label className="label ">
                    <input type="radio" name="radio-10" className="radio checked:bg-green-500" />
                    <span className="label-text ml-3">Tek</span>
                </label>
            </div>
        </div>
    )
}

export default RadioGroup