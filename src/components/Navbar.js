import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

function Navbar(props) {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    const logOutHandler = async () => {
        await signOut(auth).then(() => {
            navigate("/")
        }).catch((error) => {
            console.log(error);
        });
    }

    if (user && user.type === 'admin') {
        return (
            <div className="navbar bg-base-100 shadow-sm min-h-0 h-14">
                <div className='navbar-start'>
                    <button onClick={() => navigate('/reservation')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>⚽</button>
                </div>
                <div className='navbar-center'>

                    <button onClick={() => navigate('/message')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>✉️</button>
                    <button onClick={() => navigate('/customers')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>👱</button>
                    <button onClick={() => navigate('/settings')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>⚙️</button>
                </div>
                <div className='navbar-end'>
                    {props.endButton ? props.endButton : null}
                </div>
            </div >
        )
    } else if (user && user.type === 'customer') {
        return (
            <div className="navbar bg-base-100 shadow-sm">
                <div className='navbar-start'>
                    <button onClick={logOutHandler} className='btn btn-ghost normal-case text-xl xl:text-3xl'>🚪</button>
                </div>
                <div className='navbar-center'>
                    <button onClick={() => navigate('/reservation')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>⚽ Rezervasyon ⚽</button>
                </div>
                <div className='navbar-end'>
                    {props.endButton ? props.endButton : null}
                </div>
            </div >
        )
    } else if (!user) {
        navigate('/')
    }

}

export default Navbar