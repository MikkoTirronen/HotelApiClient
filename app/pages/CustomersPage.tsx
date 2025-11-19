// routes/customers.tsx
import { useState, useEffect } from "react";
import Header from "~/components/HeaderComponent";

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
    <div className="max-w-3xl mx-auto p-6">
      <Header />
      <NavTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />

      {activeTab === "Customers" && <p>All Customers</p>}
    </div>
  );
}
