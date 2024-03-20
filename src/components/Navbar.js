import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CountIndicator from './CountIndicator'

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

    const showToast = () => {
        toast(<CountIndicator />, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        })
    }
        ;

    if (user && user.type === 'admin') {
        return (
            <div className="navbar bg-base-100 shadow-sm min-h-0 h-14">
                <div className='navbar-start'>
                    <button onClick={() => navigate('/reservation')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>⚽</button>
                </div>
                <div className='navbar-center'>

                    {/*<button onClick={() => navigate('/message')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>✉️</button> */}
                    <button onClick={showToast} className='lg:hidden btn btn-ghost normal-case text-xl xl:text-3xl'>⭐</button>
                    <button onClick={() => navigate('/customers')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>👱</button>
                    <button onClick={() => navigate('/settings')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>⚙️</button>
                    <ToastContainer />

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
        return (
            <div className="flex flex-col items-center mt-52 gap-10">
                <p>Lütfen giriş yapınız.</p>
                <button onClick={() => navigate("/")} className="btn btn-square w-52">
                    Giriş Yap
                </button>
            </div>
        )
    }

}

export default Navbar