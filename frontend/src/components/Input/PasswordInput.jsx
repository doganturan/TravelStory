import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

function PasswordInput({ value, onChange, placeholder }) {

    const [isShowPassword, setIsShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    }

    return (
        <div className='flex items-center bg-cyan-600/5 px-5 rounded mb-3'>
            <input className='w-full text-sm bg-transparent py-3 rounded outline-none' value={value} onChange={onChange} placeholder={placeholder || "Password"} type={isShowPassword ? "text" : "password"} />

            {
                isShowPassword ? <FaRegEye className='text-primary cursor-pointer' onClick={() => toggleShowPassword()} size={22} /> : <FaRegEyeSlash className='text-slate-400 cursor-pointer' onClick={() => toggleShowPassword()} size={22} />
            }
        </div>
    )
}

export default PasswordInput