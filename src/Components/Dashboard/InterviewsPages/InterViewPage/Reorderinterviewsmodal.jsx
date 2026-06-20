import { useState, useRef, useEffect } from 'react';
import { GripVertical, X, Save, ArrowUpDown, Pin } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { reorderInterviews } from '../../../../redux/apiCalls/interviewCallApi';
import { interviewAction } from '../../../../redux/slices/interviewsSlice';

const ReorderInterviewsModal = ({ isOpen, onClose, interviews = [] }) => {
  const dispatch = useDispatch();

const [orderedPinned, setOrderedPinned] = useState([]);
const [orderedUnpinned, setOrderedUnpinned] = useState([]);

useEffect(() => {
  setOrderedPinned(interviews.filter(i => i.is_pinned == 1));
  setOrderedUnpinned(interviews.filter(i => i.is_pinned != 1));
}, [interviews, isOpen]);
  const [saving, setSaving] = useState(false);

  // ─── Drag state ───────────────────────────────────────────
  const dragIndex = useRef(null);
  const dragGroup = useRef(null); 

  const handleDragStart = (index, group) => {
    dragIndex.current = index;
    dragGroup.current = group;
  };

  const handleDragEnter = (index, group) => {
    if (dragGroup.current !== group) return;
    if (dragIndex.current === index) return;

    const setter = group === 'pinned' ? setOrderedPinned : setOrderedUnpinned;
    const list = group === 'pinned' ? [...orderedPinned] : [...orderedUnpinned];

    const dragged = list.splice(dragIndex.current, 1)[0];
    list.splice(index, 0, dragged);
    dragIndex.current = index;
    setter(list);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    dragGroup.current = null;
  };

  // ─── Touch drag ───────────────────────────────────────────
  const touchStartY = useRef(null);
  const touchDragIndex = useRef(null);
  const touchDragGroup = useRef(null);

 const touchItemHeight = useRef(64);

const handleTouchStart = (e, index, group) => {
  touchStartY.current = e.touches[0].clientY;
  touchDragIndex.current = index;
  touchDragGroup.current = group;
  
  const el = e.currentTarget;
  if (el) touchItemHeight.current = el.getBoundingClientRect().height + 8; // 8 = gap
};

const lastMoveTime = useRef(0);

const handleTouchMove = (e) => {
  e.preventDefault();
  const touchY = e.touches[0].clientY;
  const diff = touchY - touchStartY.current;
  const threshold = touchItemHeight.current * 1.7;
  const now = Date.now();

  // cooldown 150ms بين كل خطوة
  if (Math.abs(diff) >= threshold && touchDragIndex.current !== null && now - lastMoveTime.current > 150) {
    lastMoveTime.current = now;
    
    const group = touchDragGroup.current;
    const list = group === 'pinned' ? [...orderedPinned] : [...orderedUnpinned];
    const setter = group === 'pinned' ? setOrderedPinned : setOrderedUnpinned;

    const steps = diff < 0 ? -1 : 1;
    const newIndex = Math.max(0, Math.min(list.length - 1, touchDragIndex.current + steps));

    if (newIndex !== touchDragIndex.current) {
      const dragged = list.splice(touchDragIndex.current, 1)[0];
      list.splice(newIndex, 0, dragged);
      touchDragIndex.current = newIndex;
      touchStartY.current = touchY;
      setter(list);
    }
  }
};
  const handleTouchEnd = () => {
    touchDragIndex.current = null;
    touchStartY.current = null;
    touchDragGroup.current = null;
  };

  // ─── Save ─────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);

    const payload = [
      ...orderedPinned.map((item, index) => ({ id: item.id, position: index + 1 })),
      ...orderedUnpinned.map((item, index) => ({ id: item.id, position: orderedPinned.length + index + 1 })),
    ];

    const result = await dispatch(reorderInterviews(payload));

    if (result?.success) {
      dispatch(interviewAction.reorderInterviews(payload));
      onClose();
    }
    setSaving(false);
  };

 const handleClose = () => {
  setOrderedPinned(interviews.filter(i => i.is_pinned == 1));
  setOrderedUnpinned(interviews.filter(i => i.is_pinned != 1));
  onClose();
};

  if (!isOpen) return null;

  const renderItem = (interview, index, group) => (
    <div
      key={interview.id}
      draggable
      onDragStart={() => handleDragStart(index, group)}
      onDragEnter={() => handleDragEnter(index, group)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onTouchStart={(e) => handleTouchStart(e, index, group)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex items-center gap-3 bg-gray-50 hover:bg-purple-50 border border-transparent hover:border-purple-200 rounded-xl px-3 py-2.5 cursor-grab active:cursor-grabbing transition-all select-none group"
    >
      {/* Drag handle */}
      <GripVertical size={18} className="text-gray-300 group-hover:text-purple-400 shrink-0 transition-colors" />

      {/* Avatar */}
      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shrink-0 overflow-hidden">
        {interview.photo ? (
          <img src={interview.photo} alt={interview.name} className="w-full h-full object-cover" />
        ) : (
          <span>{interview.name?.charAt(0).toUpperCase()}</span>
        )}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{interview.name}</p>
        <p className="text-xs text-gray-400 truncate">
          {interview.type} · {interview.duration_cycle} {interview.duration_period}
        </p>
      </div>

      {/* Pin badge */}
      {group === 'pinned' && (
        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
          <Pin size={11} className="text-purple-600" />
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <ArrowUpDown size={16} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Reorder Interviews</h2>
              <p className="text-xs text-gray-400">Drag to rearrange the order</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">

          {/* Pinned group */}
          {orderedPinned.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-1 mb-1">
                <Pin size={12} className="text-purple-500" />
                <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Pinned</span>
              </div>
              {orderedPinned.map((interview, index) => renderItem(interview, index, 'pinned'))}
            </>
          )}

          {/* Divider */}
          {orderedPinned.length > 0 && orderedUnpinned.length > 0 && (
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">Other interviews</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          )}

          {/* Unpinned group */}
          {orderedUnpinned.map((interview, index) => renderItem(interview, index, 'unpinned'))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} />
                Save Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReorderInterviewsModal;