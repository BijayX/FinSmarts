import {
  integer,
  numeric,
  pgTable,
  serial,
  varchar,
  date,
  decimal
} from "drizzle-orm/pg-core";


export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

export const Incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  reciveddate:date("reciveddate"),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});
export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdAt: varchar("createdAt").notNull(),
});

export const Investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  stockprice: numeric("stockprice").notNull().default(0),
  units: numeric("units").notNull().default(0),
  totalvalue:decimal("totalvalue"),
  boughtdate: date("boughtdate").notNull(),
  category: varchar("category").notNull(),
  createdBy: varchar("createdBy").notNull(),
});
