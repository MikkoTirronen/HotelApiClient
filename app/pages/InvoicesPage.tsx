import { useState } from "react";
import Header from "~/components/HeaderComponent";
import InvoicesList from "~/components/InvoicesList";
import InvoiceUpdateForm from "~/components/InvoiceUpdateComponent";
import NavTabs from "~/components/NavTabsComponent";
import PaymentsList from "~/components/PaymentList";

export interface Invoice {
  invoiceId: number;
  customerName: string;
  amount: number;
  status: "paid" | "unpaid" | "void" | "partial";
  issueDate: string;
  dueDate: string;
}

function InvoicesPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="w-full max-w-3xl space-y-4">
      <Header />

      <NavTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={["All", "Payments"]}
      />

      {activeTab === "All" && <InvoicesList />}
      {activeTab === "Payments" && <PaymentsList />}
    </div>
  );
}

export default InvoicesPage;
