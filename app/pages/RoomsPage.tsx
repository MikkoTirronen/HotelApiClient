import { useState, useEffect } from "react";
import CreateRoomForm from "~/components/CreateRoomForm";
import Header from "~/components/HeaderComponent";
import MainNav from "~/components/MainNavComponent";
import MainNavVertical from "~/components/MainNavVertical";
import NavTabs from "~/components/NavTabsComponent";
import RoomsListComponent from "~/components/RoomListComponent";
import { useToast } from "~/context/ToastContext";
import type { Room } from "~/types/room";

export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [rooms, setRooms] = useState<any[]>([]);
  const tabs = ["All", "Create"];
  const { addToast } = useToast();
  const loadRooms = async () => {
    const res = await fetch("http://localhost:5051/rooms");
    const data = await res.json();
    setRooms(data);
  };
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  useEffect(() => {
    loadRooms();
  }, []);
  const BASE_URL = "http://localhost:5051";

  const handleDeleteRoom = async (roomId: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        addToast("Failed to delete room.", "error");
        return;
      }

      await loadRooms(); // refresh list
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const handleSubmit = async (data: any) => {
    try {
      if (selectedRoom) {
        await fetch(`${BASE_URL}/rooms/${selectedRoom?.roomId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch(`${BASE_URL}/rooms/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      await loadRooms();
      setSelectedRoom(null);
      addToast("Created room success!", "success");
    } catch (err) {
      addToast("Submit failed!", "error");
    }
  };
  return (
    <div className="w-full max-w-3xl space-y-4">
      <Header />
      <NavTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />
      <div className="mt-6">
        {activeTab === "All" && !selectedRoom && (
          <RoomsListComponent
            rooms={rooms}
            onEdit={(room) => setSelectedRoom(room)}
            onDelete={handleDeleteRoom}
          />
        )}
        {activeTab === "All" && selectedRoom && (
          <CreateRoomForm
            mode="edit"
            initialRoom={selectedRoom}
            onCancel={() => setSelectedRoom(null)}
            onSubmit={handleSubmit}
          />
        )}
        {activeTab === "Create" && !selectedRoom && (
          <CreateRoomForm mode="create" onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
