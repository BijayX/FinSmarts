"use client"

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { desc, eq, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import BudgetExpenseLineChart from "../_components/BudgetExpenseLineChart";

function Analytics() {
  const { user } = useUser();
  const [chartData, setChartData] = useState([]);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const result = await db
      .select({
        name: Budgets.name,
        budget: Budgets.amount,
        expense: sql`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id))
      .limit(6);  // Limit to last 6 budgets for readability

    setChartData(result.reverse());  // Reverse to show oldest to newest
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl mb-6">Analytics</h2>
      <div className="w-full h-[400px]">
        <BudgetExpenseLineChart data={chartData} />
      </div>
    </div>
  );
}

export default Analytics;