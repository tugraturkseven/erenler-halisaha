import React from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

function PhoneNumberInput({ phoneNumber, setPhoneNumber, width }) {
    return (
        <PhoneInput
            placeholder="Telefon Numarasi"
            defaultCountry='TR'
            addInternationalOption={false}
            initialValueFormat='national'
            countries={['TR']}
            value={phoneNumber}
            onChange={setPhoneNumber}
            className={`input input-bordered ${width ? width : 'w-full'} max-w-xs`}
            numberInputProps={{ className: 'bg-transparent', }}
            disabled={setPhoneNumber ? false : true}
        />
    )
}

export default PhoneNumberInput