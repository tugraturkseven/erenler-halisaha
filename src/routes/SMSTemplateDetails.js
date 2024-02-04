import { useState, useEffect } from 'react'
import Navbar from "../components/Navbar"
import { useLocation, useNavigate } from 'react-router-dom'
import { getSMSTemplate, saveSMSTemplate, deleteSMSTemplate } from '../firebase'

const SMSTemplateDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { template } = location.state || {};

    const [smsTemplate, setSMSTemplate] = useState(template)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!smsTemplate) {
            navigate('/smsSettings');
        }

        getSMSTemplate(smsTemplate.id)
            .then((data) => {
                setSMSTemplate(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
        return () => {
            setSMSTemplate({});
        }
    }, []);

    const handleTemplateChange = (e) => {
        setSMSTemplate({ ...smsTemplate, message: e.target.value });
    }

    const handleSave = () => {
        saveSMSTemplate(smsTemplate).then(() => {
            alert('Kaydedildi');
            navigate('/smsSettings');
        }).catch((error) => {
            setError(error);
        });
    }

    const handleGoBack = () => {
        navigate('/smsSettings');
    }

    const WhatsAppMessage = () => {
        const phoneNumber = '+905433860349'; // The phone number you want to send a message to (include country code)
        const message = encodeURIComponent(template.message); // Your message
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div>
            <Navbar />
            <div className='flex flex-col items-center gap-5'>
                <h1 className='text-lg font-semibold'>SMS Sablon Detayları</h1>
                <div className='text-center flex flex-col items-center justify-between min-h-min  '>
                    <div className='text-center items-center justify-center'>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text"></span>
                                <span className="label-text">📝 Sablon Adı</span>
                                <span className="label-text"></span>
                            </label>
                            <p className='text-xl font-semibold underline underline-offset-4 text-green-600'>{smsTemplate.description}</p>
                        </div>
                        <div className="form-control w-full max-w-md mt-5 h-fit">
                            <label className="label">
                                <span className="label-text"></span>
                                <span className="label-text">📄 Sablon Metni</span>
                                <span className="label-text"></span>
                            </label>
                            <textarea placeholder="Sablon Metni" value={smsTemplate.message} className="textarea textarea-bordered textarea-lg w-full max-w-md text-center " onChange={(e) => handleTemplateChange(e)} style={{ minHeight: '40vh' }} />
                            <div className='flex flex-row justify-center items-center gap-5 mt-5'>
                                <button className='btn btn-outline btn-square text-xl' onClick={() => handleGoBack()}>🚪</button>
                                <button className='btn btn-outline btn-square text-xl' onClick={() => handleSave()}>💾</button>
                                <button className='btn btn-outline btn-square text-xl' onClick={() => WhatsAppMessage()}>Test</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SMSTemplateDetails