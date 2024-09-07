import React from 'react'
import InvestmentList from './_components/InvestmentList'


function Investments() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Investment</h2>
      <InvestmentList/>
      
    </div>
  )
}

export default Investments