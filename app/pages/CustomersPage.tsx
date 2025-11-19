// routes/customers.tsx
import { useState, useEffect } from "react";
import Header from "~/components/HeaderComponent";
import MainNav from "~/components/MainNavComponent";
import MainNavVertical from "~/components/MainNavVertical";

//import CustomersList from "~/components/CustomersList"; // We'll create this
import NavTabs from "~/components/NavTabsComponent";

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<string>("All Customers");
  const [customers, setCustomers] = useState<any[]>([]);

  const loadCustomers = async () => {
    const res = await fetch("http://localhost:5051/customers");
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);
  const tabs = ["All Customers"];
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-48 bg-gray-100 p-6 space-y-4  shrink-0 pt-40">
        <MainNavVertical />
      </aside>

      <main className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-3xl space-y-4">
          <Header />
          <NavTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />

          {activeTab === "Customers" && <p>All Customers</p>}
        </div>
      </main>
    </div>
  );
}
