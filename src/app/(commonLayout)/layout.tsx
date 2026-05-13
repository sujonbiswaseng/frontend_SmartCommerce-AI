import Navbar from '@/components/shared/Navbar'
import { getSession } from '@/services/auth.service'
import { TUser } from '@/types/user.type'
import React from 'react'

const CommonLayout =async ({children}:{children:React.ReactNode}) => {
  const userinfo=await getSession()
  return (
    <div className='max-w-[1480px] mx-auto'>
      <Navbar user={userinfo?.data as TUser} />
      {children}
    </div>
  )
}

export default CommonLayout