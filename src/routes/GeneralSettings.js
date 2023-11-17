import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getDeposit, setDeposit, getPrice, setPrice } from '../firebase'

function GeneralSettings() {


    const [deposit, setDeposit] = useState(0)
    const [price, setPrice] = useState(0)


    const saveButton = <button className='btn btn-ghost normal-case text-xl xl:text-3xl' >💾</button>
    return (
        <div>
            <Navbar endButton={saveButton} />
            <div className='flex flex-col justify-between items-center md:flex-row lg:justify-around'>

                <div className='text-center items-center justify-center mt-10'>
                    <h1 className='text-lg font-semibold'>💰 Ücret Ayarları</h1>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text"></span>
                            <span className="label-text">Kapora</span>
                            <span className="label-text"></span>
                        </label>
                        <input type="number" placeholder="Kapora Ucreti" className="input input-bordered w-full max-w-sm" />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text"></span>
                            <span className="label-text">Rezervasyon</span>
                            <span className="label-text"></span>
                        </label>
                        <input type="number" placeholder="Rezervasyon Ucreti" className="input input-bordered w-full max-w-sm" />
                    </div>
                </div>

                <div className='text-center items-center justify-center mt-10'>
                    <h1 className='text-lg font-semibold'>📅 Rezervasyon Ayarları</h1>
                    <div className="form-control mt-5">
                        <label className="label cursor-pointer text-center">
                            <input type="checkbox" className="checkbox" />
                            <span className="text-md font-semibold">Ertesi geceyi listele</span>
                        </label>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default GeneralSettings