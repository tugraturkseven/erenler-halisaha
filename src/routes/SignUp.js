import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

function SignUp() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigate("/")

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);

            });


    }

    return (
        <div className='flex h-full shadow-2xl  items-center justify-center flex-col rounded-lg px-16 md:flex-row'>
            <article className='prose lg:prose-lg md:prose-md sm:prose-sm'>
                <p className='text-2xl font-bold text-center md:text-4xl'>Yeni Üye</p>
            </article>
            <div className='mt-10 md:mx-10 lg: w-52 space-y-5'>
                <input type="text" placeholder="İsim Soyisim" className="input input-bordered w-full max-w-xs" />
                <input type="email" placeholder="E Posta" className="input input-bordered w-full max-w-xs" onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="Telefon" className="input input-bordered w-full max-w-xs" />
                <input type="password" placeholder="Sifre" className="input input-bordered w-full max-w-xs" onChange={(e) => setPassword(e.target.value)} />
                <a className='btn btn-warning btn-block' onClick={onSubmit}>KAYIT OL</a>
                <a href="/" className='btn btn-accent btn-block'>GERI DON</a>
            </div>
        </div>
    )
}

export default SignUp