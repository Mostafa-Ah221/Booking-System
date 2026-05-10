import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { FaCheck } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import { PiDotsSixVerticalLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { workspaceAction } from "../../redux/slices/workspaceSlice";
import { reorderWorkspaces } from "../../redux/apiCalls/workspaceCallApi";

export default function WorkspaceList({
  filteredWorkspaces,
  searchQuery,
  activeMenuId,
  setActiveMenuId,
  menuRef,
  onEditClick,
  onDeleteClick,
  onSelectWorkspace,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspace } = useSelector((state) => state.workspace);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const toggleMenu = (workspaceId, e) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === workspaceId ? null : workspaceId);
  };

  const handleDragStart = (e, index, id) => {
    dragItem.current = index;
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, index, id) => {
    dragOverItem.current = index;
    setDragOverId(id);
  };

  const handleDragEnd = () => {
    if (
      dragItem.current === null ||
      dragOverItem.current === null ||
      dragItem.current === dragOverItem.current
    ) {
      setDraggingId(null);
      setDragOverId(null);
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const reordered = [...filteredWorkspaces];
    const draggedItem = reordered.splice(dragItem.current, 1)[0];
    reordered.splice(dragOverItem.current, 0, draggedItem);

    const orderPayload = reordered.map((ws, index) => ({
      id: ws.id,
      position: index + 1,
    }));

    dispatch(workspaceAction.reorderWorkspacesInList(orderPayload));
    dispatch(reorderWorkspaces(orderPayload));

    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingId(null);
    setDragOverId(null);
  };

  if (filteredWorkspaces.length === 0) {
    return (
      <div className="text-center py-4">
        {searchQuery ? (
          <p className="text-gray-500 text-sm">
            No workspaces found for "{searchQuery}"
          </p>
        ) : (
          <p className="text-gray-500 text-sm">No workspaces found.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {filteredWorkspaces.map((workspaceItem, index) => (
        <div
          key={workspaceItem.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index, workspaceItem.id)}
          onDragEnter={(e) => handleDragEnter(e, index, workspaceItem.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          className={`cursor-pointer p-2 my-1 rounded-md border-b border-gray-100 flex items-center justify-between transition-all duration-150
            ${workspace && workspace.id === workspaceItem.id ? "bg-purple-100" : "bg-transparent"}
            ${draggingId === workspaceItem.id ? "opacity-40 scale-[0.98]" : "opacity-100"}
            ${dragOverId === workspaceItem.id && draggingId !== workspaceItem.id ? "border-t-2 border-t-purple-400" : ""}
            hover:bg-purple-50`}
          onClick={() => onSelectWorkspace(workspaceItem)}
          dir="ltr"
        >
          {/* Drag handle + name */}
          <div className="flex items-center gap-2">
            <PiDotsSixVerticalLight
              className="text-black cursor-grab active:cursor-grabbing text-lg flex-shrink-0"
              onMouseDown={(e) => e.stopPropagation()}
            />
            <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold flex-shrink-0">
              {workspaceItem.name?.slice(0, 1).toUpperCase()}
            </div>
            <div
              className="max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis text-sm"
              dir="auto"
            >
              {searchQuery ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: workspaceItem.name.replace(
                      new RegExp(`(${searchQuery})`, "gi"),
                      '<mark class="bg-yellow-200">$1</mark>'
                    ),
                  }}
                />
              ) : (
                workspaceItem.name
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 items-center relative" dir="ltr">
            <div
              onClick={(e) => toggleMenu(workspaceItem.id, e)}
              className="w-5 h-5 rounded-full flex justify-center items-center border border-transparent hover:border-purple-500 duration-300"
            >
              <BsThreeDots className="text-[13px] cursor-pointer text-purple-500" />
            </div>

            {activeMenuId === workspaceItem.id && (
              <div
                ref={menuRef}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute bottom-6 right-2 bg-white shadow-lg rounded-lg z-10 py-2 w-40"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick(workspaceItem);
                    setActiveMenuId(null);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiEdit2 size={16} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={(e) => onDeleteClick(workspaceItem, e)}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              </div>
            )}

            <div
              className={`flex justify-center items-center w-5 h-5 rounded-full ${
                workspace && workspace.id === workspaceItem.id
                  ? "bg-purple-500"
                  : "bg-transparent"
              }`}
            >
              {workspace && workspace.id === workspaceItem.id && (
                <FaCheck className="text-white text-sm" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}