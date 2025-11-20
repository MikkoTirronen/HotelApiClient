import { useEffect, useState } from "react";

import CustomerForm from "~/components/CustomerForm";
import CustomersListComponent from "~/components/CustomerList";
import Header from "~/components/HeaderComponent";
import MainNavVertical from "~/components/MainNavVertical";
import NavTabs from "~/components/NavTabsComponent";
import type { Customer } from "~/types/customer";

const BASE_URL = "http://localhost:5051";

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const loadCustomers = async () => {
    const res = await fetch(`${BASE_URL}/customers`);
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id: number) => {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: "DELETE",
    });
    if (res.ok) loadCustomers();
  };

  return (

        <div className="w-full max-w-3xl space-y-4">
          <Header />
          <NavTabs
            tabs={["All", "Create"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {selectedCustomer && (
            <CustomerForm
              mode="edit"
              initialCustomer={selectedCustomer}
              onCancel={() => setSelectedCustomer(null)}
              onSubmit={async (form) => {
                await fetch(
                  `${BASE_URL}/customers/${selectedCustomer.customerId}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                  }
                );
                await loadCustomers();
                setSelectedCustomer(null);
              }}
            />
          )}

          {!selectedCustomer && activeTab === "All" && (
            <CustomersListComponent
              customers={customers}
              onEdit={(c) => setSelectedCustomer(c)}
              onDelete={handleDelete}
            />
          )}

          {!selectedCustomer && activeTab === "Create" && (
            <CustomerForm
              mode="create"
              onSubmit={async (form) => {
                await fetch(`${BASE_URL}/customers`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(form),
                });
                await loadCustomers();
                setActiveTab("All");
              }}
            />
          )}
        </div>

  );
}
