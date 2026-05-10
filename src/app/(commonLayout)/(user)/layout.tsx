'use client'

import { Divider, Step } from '@/components/step'
import { usePathname } from 'next/navigation'
import React from 'react'

const CustomerLayout = ({
   children,
  cart,
  checkout,
}: {
  children:React.ReactNode,
  cart: React.ReactNode,
  checkout: React.ReactNode,
}) => {

  const pathname = usePathname()

  let page
  if (pathname === '/cart') page = cart
  else if (pathname === '/checkout') page = checkout

  return (
    <div className='mt-14 md:mt-20 lg:mt-24 xl:mt-26'>

      {page?(<>
      <div className="flex items-center justify-between max-w-xl mx-auto text-sm md:text-base font-medium">

        <Step
          number="1"
          title="Meals Cart"
          isActive={pathname === '/cart'}
        />

        <Divider isActive={pathname !== '/cart'} />

        <Step
          number="2"
          title="Checkout"
          isActive={pathname === '/checkout'}
        />
      </div>
      </>):(<>
      </>)}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="mt-8">
          {page?page:children}
        </div>
      </div>
      {/* {children} */}
    </div>
  )
}

export default CustomerLayout