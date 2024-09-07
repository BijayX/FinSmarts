import formatNumber from "@/utils";
import React from "react";

function InvestmentItem({ investment }) {

  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
              {investment.icon || '💼'}
            </span>
            <div>
              <h2 className="font-bold text-lg">{investment.name}</h2>
              <p className="text-sm text-gray-500">{investment.category}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-primary text-lg">{formatNumber(investment.stockprice)}</h3>
            <p className="text-sm text-gray-500">per unit</p>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Units</p>
            <p className="font-semibold">{investment.units}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="font-semibold">{formatNumber(investment.totalvalue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bought Date</p>
            <p className="font-semibold">{investment.boughtdate}</p>
          </div>
        
        </div>
      </div>
    </div>
  );
}

export default InvestmentItem;