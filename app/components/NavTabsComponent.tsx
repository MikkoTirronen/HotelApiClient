interface NavTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function NavTabs({ activeTab, onChange }: NavTabsProps) {
  const tabs = ["Bookings", "Create Booking", "Search Bookings"];
  return (
    <div className="flex space-x-4 border-b pb-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded-t-lg text-base font-medium transition-all duration-200 cursor-pointer ${
            activeTab === tab
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
