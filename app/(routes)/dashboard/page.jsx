"use client";
import React, { useEffect, useState, useCallback } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes, Investments } from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";

function Dashboard() {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [investmentList, setInvestmentList] = useState([]);

  const getBudgetList = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    setBudgetList(result);
  }, [user?.primaryEmailAddress?.emailAddress]);

  const getIncomeList = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const result = await db
        .select({
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(Number),
        })
        .from(Incomes)
        .where(eq(Incomes.createdBy, user.primaryEmailAddress.emailAddress));
      setIncomeList(result);
    } catch (error) {
      console.error("Error fetching income list:", error);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  const getAllExpenses = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  }, [user?.primaryEmailAddress?.emailAddress]);

  const getAllInvestment = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const result = await db
      .select({
        id: Investments.id,
        name: Investments.name,
        totalvalue: Investments.totalvalue,
      })
      .from(Investments)
      .where(eq(Investments.createdBy, user.primaryEmailAddress.emailAddress));
    setInvestmentList(result);
  }, [user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    if (user) {
      getBudgetList();
      getIncomeList();
      getAllExpenses();
      getAllInvestment();
    }
  }, [user, getBudgetList, getIncomeList, getAllExpenses, getAllInvestment]);

  return (
    <div className="p-8 bg-">
      <h2 className="font-bold text-4xl">Hi, {user?.fullName} 👋</h2>
      <p className="text-gray-500">
        Here's what's happening with your money. Let's manage your expenses!
      </p>

      <CardInfo budgetList={budgetList} incomeList={incomeList} investmentList={investmentList} />
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2">
          <BarChartDashboard budgetList={budgetList} />

          <ExpenseListTable
            expensesList={expensesList}
            refreshData={getBudgetList}
          />
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgetList?.length > 0
            ? budgetList.map((budget) => (
                <BudgetItem budget={budget} key={budget.id} />
              ))
            : [1, 2, 3, 4].map((item) => (
                <div
                  key={`placeholder-${item}`}
                  className="h-[180px] w-full bg-slate-200 rounded-lg animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;