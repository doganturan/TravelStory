import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({ userInfo, onLogout }) => {
    return (
        userInfo && (
            <div className='flex items-center gap-3'>
                <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
                    {getInitials(userInfo ? userInfo.fullName : "")}
                </div>

                <div className="flex flex-col items-center justify-center gap-1">
                    <p className='text-sm font-medium'>{userInfo.fullName || ""}</p>
                    <button className='btn-primary w-16 p-1 rounded text-white text-sm text-slate-700' onClick={onLogout}>Logout</button>
                </div>
            </div>
        )
    )
}

export default ProfileInfo