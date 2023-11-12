import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('tugraturkseven@hotmail.com')
    const [password, setPassword] = useState('jackass1*')

    const onSubmit = async (e) => {
        e.preventDefault()

        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                navigate("/reservation")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
    };




    return (
        <div className='flex h-full shadow-2xl  items-center justify-center flex-col rounded-lg px-16 md:flex-row'>
            <article className='prose lg:prose-lg md:prose-md sm:prose-sm'>
                <p className='text-2xl font-bold text-center md:text-4xl'>Hoşgeldiniz! 👋</p>
                <p className='text-sm text-center md:text-xl'>Efeler Park Halısaha</p>
            </article>
            <div className='mt-10 md:mx-10 lg: w-52 space-y-5'>
                <input type="email" placeholder="📬 E Posta" className="input input-bordered w-full max-w-xs" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="🔑 Sifre" className="input input-bordered w-full max-w-xs" onChange={(e) => setPassword(e.target.value)} />
                <a onClick={onSubmit} className='btn btn-success btn-block'>🚪 Giriş Yap</a>
                <a href="/signin" className='btn btn-info btn-block'>✨ Kayıt Ol</a>
            </div>
        </div>
    )
}

export default Login