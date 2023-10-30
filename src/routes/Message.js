import React from 'react'
import Navbar from '../components/Navbar'

function Message() {
    return (
        <div className='flex flex-col gap-5 items-center'>
            <Navbar />
            <input type="text" placeholder="Kime göndereceksiniz?" className="input input-bordered w-full max-w-xs" />
            <textarea className="textarea textarea-bordered w-full max-w-xs" placeholder="Mesajınız"></textarea>
            <button className="btn btn-primary w-full max-w-xs">Gönder</button>
        </div>
    )
}

export default Message