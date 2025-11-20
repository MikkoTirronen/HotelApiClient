import React, { useState } from 'react'
import Header from '~/components/HeaderComponent'
import NavTabs from '~/components/NavTabsComponent'

function InvoicesPage() {
    const [activeTab, setActiveTab] = useState("All")
  return (
    <div className="w-full max-w-3xl space-y-4">
          <Header />
          <NavTabs activeTab={activeTab} onChange={setActiveTab} tabs={["All", "Payment"]} />
          InvoicesPage
      </div>
  )
}

export default InvoicesPage