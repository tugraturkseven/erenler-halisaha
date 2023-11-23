import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getPitchList, setPitches } from '../firebase'
import Table from '../components/Table'
import DropDown from '../components/DropDown'
import { useNavigate } from 'react-router-dom'


function PitchSettings() {
    const navigate = useNavigate();
    const [pitchList, setPitchList] = useState([{ id: 1, name: 'Saha 1', minute: '00' }])
    const [selectedMinute, setSelectedMinute] = useState('00');

    useEffect(() => {
        getPitchList()
            .then((data) => {
                if (data) {
                    const validData = data.filter(item => item);
                    setPitchList(validData);
                } else {
                    setPitches(pitchList);
                }
            })
    }, []);



    const saveButton = <button className='btn btn-ghost normal-case text-xl xl:text-3xl' >💾</button>

    const handleAddPitch = () => {
        const newPitch = {
            id: pitchList.length + 1,
            name: `Saha ${pitchList.length + 1}`,
            minute: selectedMinute
        }
        setPitchList([...pitchList, newPitch]);
        setPitches([...pitchList, newPitch]);
    }

    const handleDeletePitch = (pitch) => {
        if (pitchList.length > 1) {
            const newPitchList = pitchList.filter(item => item.id !== pitch.id);
            // Here we need to reorder the ids and pitch names
            newPitchList.forEach((item, index) => {
                item.id = index + 1;
                item.name = `Saha ${index + 1}`;
            })
            setPitchList(newPitchList);
            setPitches(newPitchList);
            alert('Saha silindi.')
        } else {
            alert('Saha silinemez.')
        }

    }

    const handleEditPitch = (pitch) => {
        navigate(`/pitchDetails`, { state: { pitch } });
    }


    return (
        <div className='text-center flex flex-col h-screen'>
            <Navbar endButton={saveButton} />
            <h1 className='text-lg font-semibold'>🏟️ Saha Ayarları</h1>

            <div className='text-center flex flex-col items-center justify-between min-h-min gap-5 mt-8 '>
                <h2 className='text-md font-semibold'>✨ Saha Ekle</h2>
                <div className='flex flex-row gap-5 items-baseline'>
                    <DropDown options={['00', '15', '30', '45']} onSelect={setSelectedMinute} selectedOption={selectedMinute} placeHolder={'⏱️ Dakika'} />
                    <button className='btn btn-neutral normal-case text-md xl:text-3xl' onClick={handleAddPitch}>🎉 Oluştur</button>
                </div>


            </div>
            <div className='flex flex-col gap-5 mt-8'>
                <h2 className='text-md font-semibold'>📋 Sahalar</h2>
                <Table data={pitchList} type={'pitches'} headings={{ first: '🏷️ Saha Adı', second: '⏱️ Dakika' }} handleDelete={handleDeletePitch} handleEdit={handleEditPitch} />
            </div>
        </div>
    )
}

export default PitchSettings