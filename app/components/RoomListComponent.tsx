import type { Room } from "~/types/room";

interface Props {
  rooms: Room[];
  onDelete: (roomId: number) => void;
  onEdit: (room: Room) => void;
}

export default function RoomsListComponent({ rooms, onDelete, onEdit }: Props) {
  if (!rooms.length) return <p className="text-gray-500">No rooms found.</p>;

  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <div
          key={room.roomId}
          className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-start"
        >
          {/* Room Info */}
          <div>
            <h3 className="font-semibold text-lg">Room {room.roomNumber}</h3>
            <p className="text-sm text-gray-700">Price per night: €{room.pricePerNight}</p>
            <p className="text-sm text-gray-700">Base capacity: {room.baseCapacity}</p>
            <p className="text-sm text-gray-700">Max extra beds: {room.maxExtraBeds}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onEdit(room)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Update
            </button>

            <button
              onClick={() => onDelete(room.roomId)}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
