import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, Lock } from "lucide-react";
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

  // ── Portal menu state ──────────────────────────────────────────────────────
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRefs = useRef({}); // ref لكل زرار ⋯ بـ id الـ workspace
  // ──────────────────────────────────────────────────────────────────────────

  const toggleMenu = (workspaceId, e) => {
    e.stopPropagation();

    if (activeMenuId === workspaceId) {
      setActiveMenuId(null);
      return;
    }

    // احسب position الزرار عشان تحط الـ popup فوقيه بالظبط
    const trigger = triggerRefs.current[workspaceId];
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      setMenuPos({
        top: rect.top + window.scrollY - 10,   // شوية فوق الزرار
        left: rect.left + window.scrollX - 130, // عرض الـ popup ~160px
      });
    }

    setActiveMenuId(workspaceId);
  };

  // إغلاق الـ menu لو ضغط برّاه
  useEffect(() => {
    if (!activeMenuId) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId, menuRef, setActiveMenuId]);

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragStart = (e, index, id, isLocked) => {
    if (isLocked) { e.preventDefault(); return; }
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
  // ──────────────────────────────────────────────────────────────────────────

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
      {filteredWorkspaces.map((workspaceItem, index) => {
        const isLocked = workspaceItem.is_locked === true;

        return (
          <div
            key={workspaceItem.id}
            draggable={!isLocked}
            onDragStart={(e) => handleDragStart(e, index, workspaceItem.id, isLocked)}
            onDragEnter={(e) => handleDragEnter(e, index, workspaceItem.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`p-2 my-1 rounded-md border-b border-gray-100 flex items-center justify-between transition-all duration-150 relative
              ${isLocked
                ? "opacity-60 cursor-not-allowed bg-gray-50"
                : "cursor-pointer hover:bg-purple-50"}
              ${workspace && workspace.id === workspaceItem.id && !isLocked ? "bg-purple-100" : ""}
              ${draggingId === workspaceItem.id ? "opacity-40 scale-[0.98]" : "opacity-100"}
              ${dragOverId === workspaceItem.id && draggingId !== workspaceItem.id ? "border-t-2 border-t-purple-400" : ""}
            `}
            onClick={() => !isLocked && onSelectWorkspace(workspaceItem)}
            dir="ltr"
          >
            {/* Locked overlay */}
            {isLocked && (
              <div className="absolute inset-0 rounded-md bg-gray-100 bg-opacity-40 flex items-center justify-end pr-2 pointer-events-none z-10">
                <Lock size={13} className="text-gray-400" />
              </div>
            )}

            {/* Drag handle + name */}
            <div className="flex items-center gap-2">
              <PiDotsSixVerticalLight
                className={`text-lg flex-shrink-0 ${isLocked ? "text-gray-300 cursor-not-allowed" : "text-black cursor-grab active:cursor-grabbing"}`}
                onMouseDown={(e) => e.stopPropagation()}
              />
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${isLocked ? "bg-gray-200 text-gray-400" : "bg-pink-200 text-pink-600"}`}>
                {workspaceItem.name?.slice(0, 1).toUpperCase()}
              </div>
              <div
                className={`max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis text-sm ${isLocked ? "text-gray-400" : "text-gray-800"}`}
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
            <div className="flex gap-2 items-center" dir="ltr">
              {!isLocked && (
                <>
                  {/* زرار ⋯ — بنحفظ ref ليه عشان نحسب position الـ portal */}
                  <div
                    ref={(el) => { triggerRefs.current[workspaceItem.id] = el; }}
                    onClick={(e) => toggleMenu(workspaceItem.id, e)}
                    className="w-5 h-5 rounded-full flex justify-center items-center border border-transparent hover:border-purple-500 duration-300"
                  >
                    <BsThreeDots className="text-[13px] cursor-pointer text-purple-500" />
                  </div>

                  {/* ── Portal Menu ── */}
                  {activeMenuId === workspaceItem.id &&
                    createPortal(
                      <div
                        ref={menuRef}
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          top: menuPos.top,
                          left: menuPos.left,
                          zIndex: 99999,
                        }}
                        className="bg-white shadow-lg rounded-lg py-2 w-40 border border-gray-100"
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
                      </div>,
                      document.body
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
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}