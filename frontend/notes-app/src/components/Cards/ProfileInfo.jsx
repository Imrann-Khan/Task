import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({userInfo, handleLogOut}) => {
  return (
    <div className='flex items-center gap-4'>
        <div className='w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-medium'>
            {getInitials(userInfo?.fullName)}
        </div>
      <div className='flex flex-col'>
        <h4 className='font-bold text-black'>{userInfo?.fullName}</h4>
        <button className='text-sm font-medium cursor-pointer' onClick={handleLogOut}>Log Out</button>
      </div>
    </div>
  )
}

export default ProfileInfo
