import React from 'react';
import { useUser } from "@clerk/nextjs";
import formatNumber from '@/utils';

const MonthlyFinancialReport = ({ reportData }) => {
  const { user } = useUser();
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        <span className="text-blue-800">Monthly</span> Financial <span className="text-blue-800">Report</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p><span className="font-semibold">Date:</span> {currentDate}</p>
          <p><span className="font-semibold">Prepared by:</span> {user?.fullName || 'N/A'}</p>
        </div>
        <div className="text-right">
          <p><span className="font-semibold">Operation Title:</span> Monthly Overview</p>
          <p><span className="font-semibold">Prepared for:</span> Financial Review</p>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Item</th>
            <th className="border p-2 text-right">Budgeted</th>
            <th className="border p-2 text-right">Actual</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 font-semibold">Revenue</td>
            <td className="border p-2 text-right">{reportData.totalIncome.toFixed(2)}</td>
            <td className="border p-2 text-right">{reportData.totalIncome.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="border p-2 pl-6">Income</td>
            <td className="border p-2 text-right">{reportData.totalIncome.toFixed(2)}</td>
            <td className="border p-2 text-right">{reportData.totalIncome.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">Expenses</td>
            <td className="border p-2 text-right">{reportData.totalBudget.toFixed(2)}</td>
            <td className="border p-2 text-right">{reportData.totalSpend.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="border p-2 pl-6">Investments</td>
            <td className="border p-2 text-right">{reportData.totalInvestment.toFixed(2)}</td>
            <td className="border p-2 text-right">{reportData.totalInvestment.toFixed(2)}</td>
          </tr>
          <tr className="bg-gray-100 font-bold">
            <td className="border p-2">Total</td>
            <td className="border p-2 text-right">
              {(reportData.totalIncome - reportData.totalBudget - reportData.totalInvestment).toFixed(2)}
            </td>
            <td className="border p-2 text-right">{reportData.availableBalance.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 text-right">
        <p className="font-bold">Balance:{formatNumber(reportData.availableBalance.toFixed(2))}</p>
      </div>
    </div>
  );
};

export default MonthlyFinancialReport;