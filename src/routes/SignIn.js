import React from 'react'

function SignIn() {
    return (
        <div className='flex h-full shadow-2xl  items-center justify-center flex-col rounded-lg px-16 md:flex-row'>
            <article className='prose lg:prose-lg md:prose-md sm:prose-sm'>
                <p className='text-2xl font-bold text-center md:text-4xl'>Yeni Üye</p>
            </article>
            <div className='mt-10 md:mx-10 lg: w-52 space-y-5'>
                <input type="text" placeholder="İsim Soyisim" className="input input-bordered w-full max-w-xs" />
                <input type="text" placeholder="Telefon" className="input input-bordered w-full max-w-xs" />
                <input type="password" placeholder="Sifre" className="input input-bordered w-full max-w-xs" />
                <a href='/' className='btn btn-warning btn-block'>KAYIT OL</a>
                <a href="/" className='btn btn-accent btn-block'>GERI DON</a>
            </div>
        </div>
    )
}

export default SignIn