import { useState, useEffect } from 'react'
import Navbar from "../components/Navbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { saveSMSTemplate, getSMSTemplates, setAlertTime, getAlertTime } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';

const SmsSettings = () => {
  const [smsTemplates, setSMSTemplates] = useState([]); // Table data
  const [alertIndex, setAlertIndex] = useState(0); // Alert time
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const options = ["15 Dakika önce", "30 Dakika önce", "45 Dakika önce", "60 Dakika önce"];
  const navigate = useNavigate();

  useEffect(() => {
    getSMSTemplates()
      .then((data) => {
        // Convert the object into an array if necessary
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const templatesArray = Object.keys(data).map(key => ({
            ...data[key]
          }));
          setSMSTemplates(templatesArray);
        } else {
          setSMSTemplates(data); // assuming data is already an array
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

    getAlertTime()
      .then((data) => {
        setAlertIndex(data);
      })
      .catch((error) => {
        setError(error);
      });

    return () => {
      // Cleanup
      setSMSTemplates([]);
      setAlertIndex(0);
      setLoading(true);
      setError(null);
    }
  }, []);

  const handleDelete = (id) => {
    // Delete item from the table
    const updatedItems = smsTemplates.filter((item) => item.id !== id);
    setSMSTemplates(updatedItems);
  }

  const handleEdit = (template) => {
    // Handle edit here
    navigate('/smsTemplateDetails', { state: { template } });
  }

  const handleSave = () => {
    // Save the data
    setAlertTime(alertIndex).then((data) => {
      alert('Ayarlar başarıyla kaydedildi.')
    }).catch((error) => {
      alert('Ayarlar kaydedilirken bir hata oluştu.')
      setError(error);
    });
  }

  const handleSelectedAlertTime = (e) => {
    setAlertIndex(e.target.selectedIndex);
  }

  const saveButton = <button className='btn btn-ghost normal-case text-xl xl:text-3xl' onClick={handleSave}>💾</button>

  return (
    <div>
      <Navbar endButton={saveButton} />
      <div className='flex flex-col justify-center items-center gap-7'>
        <h1 className='text-lg font-semibold'>📱 SMS Ayarları</h1>
        <div className='flex flex-col justify-center items-center'>
          <p className='text-md font-semibold'>⏰ Hatırlatıcı zamanlaması</p>
          <select className="select select-bordered w-full max-w-xs mt-3" onChange={(e) => handleSelectedAlertTime(e)} value={options[alertIndex]} >
            <option disabled>Kaç dakika önce?</option>
            {options.map((option, index) => {
              return <option key={index}>{option}</option>
            })}
          </select>
        </div>
        {/* Sms Sablonlari Tablosu */}
        <h1 className='text-lg font-semibold'>📜 SMS Sablonları</h1>
        <div className="overflow-x-auto max-w-2xl w-full">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Rol</th> {/* Name - set to take half of the remaining space */}
                <th>Mesaj</th> {/* Role - set to take half of the remaining space */}
                <th>Aksiyonlar</th>
              </tr>
            </thead>

            <tbody>
              {!loading && smsTemplates.map((template, index) => {
                return (
                  <tr key={template.id}>
                    <th className="text-center">{index}</th>
                    <td className="text-center font-semibold">{template.description}</td>
                    <td className="text-center font-semibold">{template.message}</td>
                    <td>
                      <button
                        className="btn btn-info mr-5"
                        onClick={() => handleEdit(template)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SmsSettings