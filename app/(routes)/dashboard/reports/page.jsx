"use client";
import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes, Investments } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import MonthlyFinancialReport from "@/components/ui/monthlyReport";
import formatNumber from "@/utils";

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    paddingVertical: 5,
  },
  column: {
    width: "33%",
    textAlign: "left",
  },
  boldText: {
    fontWeight: "bold",
  },
  rightAlign: {
    textAlign: "right",
  },
});

// PDF Document component
const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Financial Report</Text>
        <View style={styles.row}>
          <Text style={[styles.column, styles.boldText]}>Item</Text>
          <Text style={[styles.column, styles.boldText, styles.rightAlign]}>
            Budgeted
          </Text>
          <Text style={[styles.column, styles.boldText, styles.rightAlign]}>
            Actual
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.column}>Revenue</Text>
          <Text style={[styles.column, styles.rightAlign]}>
            {data.totalIncome.toFixed(2)}
          </Text>
          <Text style={[styles.column, styles.rightAlign]}>
            {data.totalIncome.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.column}>Income</Text>
          <Text style={[styles.column, styles.rightAlign]}>
            {data.totalIncome.toFixed(2)}
          </Text>
          <Text style={[styles.column, styles.rightAlign]}>
            {data.totalIncome.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.column}>Expenses</Text>
          <Text style={[styles.column, styles.rightAlign]}>
            {data.totalBudget.toFixed(2)}
          </Text>
          <Text style={[styles.column, styles.rightAlign]}>
            {data.totalSpend.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.column}>Investments</Text>
          <Text style={[styles.column, styles.rightAlign]}>
            {data.totalInvestment.toFixed(2)}
          </Text>
          <Text style={[styles.column, styles.rightAlign]}>
            {data.totalInvestment.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.boldText}>Total</Text>
          <Text style={[styles.column, styles.rightAlign]}>
            {(
              data.totalIncome -
              data.totalBudget -
              data.totalInvestment
            ).toFixed(2)}
          </Text>
          <Text style={[styles.column, styles.rightAlign]}>
            {data.availableBalance.toFixed(2)}
          </Text>
        </View>
        <View style={{ marginTop: 20, textAlign: "right" }}>
          <Text style={styles.boldText}>
            Balance: {formatNumber(data.availableBalance.toFixed(2))}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

function Report() {
  const { user } = useUser();
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const userEmail = user.primaryEmailAddress?.emailAddress;

      // Fetch budgets and expenses
      const budgetResult = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, userEmail))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      // Fetch incomes
      const incomeResult = await db
        .select({
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(
            Number
          ),
        })
        .from(Incomes)
        .where(eq(Incomes.createdBy, userEmail));

      // Fetch investments
      const investmentResult = await db
        .select({
          id: Investments.id,
          name: Investments.name,
          totalvalue: Investments.totalvalue,
        })
        .from(Investments)
        .where(eq(Investments.createdBy, userEmail));

      // Calculate totals
      const totalBudget = budgetResult.reduce(
        (sum, budget) => sum + Number(budget.amount),
        0
      );
      const totalSpend = budgetResult.reduce(
        (sum, budget) => sum + budget.totalSpend,
        0
      );
      const totalIncome = incomeResult[0]?.totalAmount || 0;
      const totalInvestment = investmentResult.reduce(
        (sum, investment) => sum + Number(investment.totalvalue),
        0
      );
      const availableBalance = totalIncome - totalInvestment - totalBudget;

      setReportData({
        totalBudget,
        totalSpend,
        totalIncome,
        totalInvestment,
        availableBalance,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="font-bold text-4xl mb-6">Financial Report</h2>
      {reportData ? (
        <div>
          <MonthlyFinancialReport reportData={reportData} />
          <div className="mt-6 flex justify-center">
            <PDFDownloadLink
              document={<MyDocument data={reportData} />}
              fileName="financial_report.pdf"
            >
              {({ blob, url, loading, error }) => (
                <Button disabled={loading}>
                  {loading ? "Generating report..." : "Download PDF Report"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      ) : (
        <p>Loading report data...</p>
      )}
    </div>
  );
}

export default Report;
