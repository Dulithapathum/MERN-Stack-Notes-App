import moment from "moment";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  content,
  date,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-md transition-all ease-in-out relative">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
        <MdOutlinePushPin
          title={isPinned ? "Unpin Note" : "Pin Note"} // Tooltip
          className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">
        {content?.length > 60 ? content.slice(0, 60) + "..." : content}
      </p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">
          {tags.slice(0, 3).map((item, index) => (
            <span key={index}>{`#${item} `}</span>
          ))}
          {tags.length > 3 && <span>+{tags.length - 3}</span>}
        </div>
        <div className="flex items-center gap-2">
          <MdCreate
            title="Edit Note" // Tooltip
            className="icon-btn hover:text-green-500"
            onClick={onEdit}
          />
          <MdDelete
            title="Delete Note" // Tooltip
            className="icon-btn hover:text-red-600"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
