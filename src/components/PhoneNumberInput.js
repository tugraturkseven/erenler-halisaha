import React from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

function PhoneNumberInput({ phoneNumber, setPhoneNumber }) {
    return (
        <PhoneInput
            placeholder="Telefon Numarasi"
            defaultCountry='TR'
            addInternationalOption={false}
            initialValueFormat='national'
            countries={['TR']}
            value={phoneNumber}
            onChange={setPhoneNumber}
            className='input input-bordered w-full max-w-xs'
            numberInputProps={{ className: 'bg-transparent' }}
        />
    )
}

export default PhoneNumberInput