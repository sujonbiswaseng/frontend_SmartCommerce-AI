import Navbar from '@/components/shared/Navbar'
import React from 'react'

const CommonLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='max-w-[1480px] mx-auto'>
      <Navbar />
      {children}
    </div>
  )
}

export default CommonLayout