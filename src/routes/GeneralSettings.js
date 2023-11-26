import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getDeposit, setPrices, getPrice, getTomorrowNightVisibility, setTomorrowNightVisibility } from '../firebase'

function GeneralSettings() {

    const [fees, setFees] = useState({
        deposit: 0,
        price: 0
    })
    const [visibility, setVisibility] = useState(false)

    useEffect(() => {
        getDeposit().then((data) => {
            setFees({ ...data })
        })
        getPrice().then((data) => {
            setFees({ ...data })
        })
        getTomorrowNightVisibility().then((data) => {
            setVisibility(data)
        })
    }, [])

    const handleSave = () => {
        setPrices(fees)
        setTomorrowNightVisibility(visibility);
        alert('Kaydedildi')
    }

    const saveButton = <button className='btn btn-ghost normal-case text-xl xl:text-3xl' onClick={handleSave} >💾</button>

    const handleDeposit = (e) => {
        setFees({ ...fees, deposit: e.target.value })
    }

    const handlePrice = (e) => {
        setFees({ ...fees, price: e.target.value })
    }

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
                        <input type="number" placeholder="Kapora Ucreti" className="input input-bordered w-full max-w-sm" value={fees.deposit} onChange={handleDeposit} />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text"></span>
                            <span className="label-text">Rezervasyon</span>
                            <span className="label-text"></span>
                        </label>
                        <input type="number" placeholder="Rezervasyon Ucreti" className="input input-bordered w-full max-w-sm" value={fees.price} onChange={handlePrice} />
                    </div>
                </div>

                <div className='text-center items-center justify-center mt-10'>
                    <h1 className='text-lg font-semibold'>📅 Rezervasyon Ayarları</h1>
                    <div className="form-control mt-5">
                        <label className="label cursor-pointer text-center">
                            <input type="checkbox" className="checkbox" onChange={() => setVisibility(!visibility)} checked={visibility} />
                            <span className="text-md font-semibold">Ertesi geceyi listele</span>
                        </label>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default GeneralSettings