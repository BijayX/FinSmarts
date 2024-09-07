"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Investments } from "@/utils/schema";

function CreateInvestment({ refreshData }) {
  const [name, setName] = useState("");
  const [stockprice, setStockprice] = useState("");
  const [units, setUnits] = useState("");
  const [boughtdate, setBoughtdate] = useState("");
  const [category, setCategory] = useState("");

  const { user } = useUser();
  const onCreateInvestment = async () => {
    const totalvalue = stockprice * units; 
    const result = await db
      .insert(Investments)
      .values({
        name: name,
        stockprice: stockprice,
        units: units,
        totalvalue:totalvalue,
        boughtdate: new Date(boughtdate),
        category: category,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ insertedId: Investments.id });

    if (result) {
      refreshData();
      toast("New Investment Created!");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 p-10 rounded-2xl
            items-center flex flex-col border-2 border-dashed
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl">+</h2>
            <h2>Add Investments</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Investment</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Name</h2>
                  <Input
                    placeholder="e.g. AAPL Stock"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">
                    Single Stock Price
                  </h2>
                  <Input
                    type="number"
                    placeholder="e.g. 150.50"
                    onChange={(e) => setStockprice(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">
                    Number of Units
                  </h2>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    onChange={(e) => setUnits(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Bought Date</h2>
                  <Input
                    type="date"
                    onChange={(e) => setBoughtdate(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Category</h2>
                  <select
                    className="flex h-10 w-full rounded-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Nepese">Nepese</option>
                    <option value="Mutual Fund">Mutual Fund</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={
                  !(name && stockprice && units && boughtdate && category)
                }
                onClick={() => onCreateInvestment()}
                className="mt-5 w-full rounded-full"
              >
                Create Investment
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateInvestment;
