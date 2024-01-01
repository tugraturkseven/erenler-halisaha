import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, createCostumer } from '../firebase'
import PhoneNumberInput from '../components/PhoneNumberInput'
import { isValidPhoneNumber } from 'react-phone-number-input'

function SignUp() {
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isValidPhoneNumber(phone)) {
            alert('Lütfen geçerli bir telefon numarası giriniz.')
            return;
        }
        const email = phone + '@efelerpark.com';

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                createCostumer(user.uid, name, phone, 'customer');
                alert('Kayit Basarili')
                navigate("/")

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorCode, errorMessage);
            });


    }

    return (
        <div className='flex h-full shadow-2xl  items-center justify-center flex-col rounded-lg px-16 md:flex-row'>
            <article className='prose lg:prose-lg md:prose-md sm:prose-sm'>
                <p className='text-2xl font-bold text-center md:text-4xl'>✨ Yeni Üye ✨</p>
                <p className='text-sm text-center'>Telefon numaranızı başında 0 olmadan giriniz.</p>
            </article>
            <div className='mt-10 md:mx-10 w-52 space-y-5'>
                <input type="text" placeholder="🏷️ İsim Soyisim" className="input input-bordered w-full max-w-xs" onChange={(e) => setName(e.target.value)} />
                <PhoneNumberInput phoneNumber={phone} setPhoneNumber={setPhone} />
                <input type="password" placeholder="🔑 Sifre" className="input input-bordered w-full max-w-xs" onChange={(e) => setPassword(e.target.value)} />
                <a className='btn btn-success btn-block' onClick={onSubmit}>🚀 KAYIT OL</a>
                <a href="/" className='btn btn-neutral btn-block'>🚪 GERI DON</a>
            </div>
        </div>
    )
}

export default SignUp