import React, { useEffect } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  FileText,
  TrendingDownIcon,
  Landmark,
  BarChart2,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Incomes",
      icon: Landmark,
      path: "/dashboard/incomes",
    },
    {
      id: 2,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 3,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
      id: 4,
      name: "Investments",
      icon: TrendingUp,
      path: "/dashboard/investments",
    },
    {
      id: 5,
      name: "Analytics",
      icon: BarChart2,
      path: "/dashboard/analytics",
    },
    {
      id: 6,
      name: "Reports",
      icon: FileText,
      path: "/dashboard/reports",
    },
    {
      id: 7,
      name: "Upgrade",
      icon: ShieldCheck,
      path: "/dashboard/upgrade",
    },
  ];
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-row items-center">
          <Image src={"/chart-donut.svg"} alt="logo" width={40} height={25} />
          <span className="text-blue-800 font-bold text-xl">FinSmart</span>
        </div>
        <nav className="mt-5 overflow-y-auto flex-grow">
          {menuList.map((menu, index) => (
            <Link href={menu.path} key={index}>
              <h2
                className={`flex gap-2 items-center
                      text-gray-500 font-medium
                      mb-2
                      p-4 cursor-pointer rounded-full
                      hover:text-primary hover:bg-blue-100
                      ${path == menu.path && "text-primary bg-blue-100"}
                      `}
              >
                <menu.icon />
                <span className="hidden sm:inline">{menu.name}</span>
              </h2>
            </Link>
          ))}
        </nav>
      </div>
      <div
        className="p-5 flex gap-2
              items-center"
      >
        <UserButton />
        <span className="hidden sm:inline">Profile</span>
      </div>
    </div>
  );
}

export default SideNav;
