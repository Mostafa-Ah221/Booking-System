import React from 'react'

export default function Navbar() {
  return (
    <div className='flex justify-between items-center py-1 px-5 '>
        <div className='flex justify-center items-center'>
         <img className='w-12 h-12 object-contain' src="https://i.ibb.co/MkYMd9TH/snapedit-1742302291750.png" alt="" />
         <h2 className='text-3xl'>Accounts</h2>
        </div>
        <div className='w-10 h-10 rounded-full shadow-sm bg-slate-500 flex justify-center items-center'>
            <h2 className='text-white'>م</h2>
        </div>
    </div>
  )
}
