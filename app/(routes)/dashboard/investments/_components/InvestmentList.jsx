"use client"
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/dbConfig'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses, Investments } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import CreateInvestment from './CreateInvestment'
import InvestmentItem from './InvestmentItem'

function InvestmentList() {

  const [InvestmentList,setInvestmentList]=useState([]);
  const { user } = useUser();
  useEffect(() => {
    user && getInvestmentList();
  }, [user]);

  const getInvestmentList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Investments),
      })
      .from(Investments)
      .where(eq(Investments.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Investments.id));
      setInvestmentList(result);
  };


  return (
    <div className='mt-7'>
        <div className='grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateInvestment
        refreshData={()=>getInvestmentList()}/>
        {InvestmentList?.length>0? InvestmentList.map((investment,index)=>(
          <InvestmentItem investment={investment} key={index} />
        ))
      :[1,2,3,4,5].map((item,index)=>(
        <div key={index} className='w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse'>

        </div>
      ))
      }
        </div>
       
    </div>
  )
}

export default InvestmentList