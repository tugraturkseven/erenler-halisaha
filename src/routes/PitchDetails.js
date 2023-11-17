import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import { getPitchList, setPitches } from '../firebase';


function PitchDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { pitch } = location.state;

    const [pitchMinute, setPitchMinute] = useState(pitch.minute);
    const [pitchList, setPitchList] = useState([{ id: 1, name: 'Saha 1', minute: '00' }])

    useEffect(() => {
        getPitchList()
            .then((data) => {
                if (data) {
                    const validData = data.filter(item => item);
                    setPitchList(validData);
                }
            })
    }, []);

    const handleSave = () => {
        const index = pitchList.findIndex((item) => item.id === pitch.id);
        pitchList[index].minute = pitchMinute;
        pitch.minute = pitchMinute;
        setPitches(pitchList);
        alert('Saha kaydedildi.')
        navigate('/pitchSettings')
    }

    const saveButton = <button className='btn btn-ghost normal-case text-xl xl:text-3xl' onClick={handleSave} >💾</button>
    return (
        <div className='flex flex-col items-center gap-5'>
            <Navbar endButton={saveButton} />
            <h1 className='text-lg font-semibold'>Saha Detayları</h1>
            <div className='text-center flex flex-col items-center justify-between min-h-min  '>
                <div className='text-center items-center justify-center'>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text"></span>
                            <span className="label-text">🏟️ Saha Adı</span>
                            <span className="label-text"></span>
                        </label>
                        <p className='text-xl font-semibold underline underline-offset-4 text-green-600'>{pitch.name}</p>
                    </div>
                    <div className="form-control w-full max-w-xs mt-5">
                        <label className="label">
                            <span className="label-text"></span>
                            <span className="label-text">🕓 Dakika</span>
                            <span className="label-text"></span>
                        </label>
                        <input type="number" placeholder="Dakika" value={pitchMinute} className="input input-bordered w-full max-w-sm text-center" onChange={(e) => setPitchMinute(e.target.value)} />
                        <button className='btn btn-accent w-full max-w-sm mt-8' onClick={() => navigate('/pitchSettings')}>🚪 Geri Dön</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PitchDetails