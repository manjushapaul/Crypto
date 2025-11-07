import BalanceHeader from "@/components/dashboard/BalanceHeader";
import GradientCard from "@/components/dashboard/GradientCard";
import CurrentMarket from "@/components/dashboard/CurrentMarket";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import TabbedCards from "@/components/dashboard/TabbedCards";

export default function Home() {
  return (
    <div className="p-0 sm:p-0 lg:p-0 ">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        {/* Greeting / Balance Header */}
      

        {/* Tabs + three-card row section */}
     

        {/* Main Layout - 2 Column Design: Current Market (left) + Sidebar (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left Column - Current Market */}
          <div className="lg:col-span-2 p-8">
          <BalanceHeader />
          <div className="my-6 shadow-card-inwards rounded-3xl">
          <TabbedCards />
          </div>
        
            <CurrentMarket />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6 bg-[#dbdcee] p-8">
            {/* Gradient Card */}
            <GradientCard />

            {/* Recent Transactions */}
            <RecentTransactions />
          </div>
        </div>
      </div>
    </div>
  );
}
