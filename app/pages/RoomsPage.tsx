// routes/rooms.tsx
import { useState, useEffect } from "react";
import Header from "~/components/HeaderComponent";

//import RoomsList from "~/components/RoomsList"; // We’ll create this
//import RoomForm from "~/components/RoomForm"; // For create/update
import NavTabs from "~/components/NavTabsComponent";

export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState<string>("All Rooms");
  const [rooms, setRooms] = useState<any[]>([]);
const tabs = ["All Rooms"]
  const loadRooms = async () => {
    const res = await fetch("http://localhost:5051/rooms");
    const data = await res.json();
    setRooms(data);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Header />
          <NavTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />

      {activeTab === "All Rooms" && <p>AllRooms</p>}
      
    </div>
  );
}
