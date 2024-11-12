import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import NavBar from "../../components/NavBar/NavBar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/ToastMessage/Toast";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("An error occurred while fetching user info", error);
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      } else {
        console.error("No notes found:", response.data.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching notes", error);
    }
  };


  const deleteNote = async (data)=>{
const noteId=data._id
try {
  const response = await axiosInstance.delete(`/delete-note/${noteId}`);
  if (response.data && !response.data.error) {
    showToastMessage("Note Delete Successfully",'delete')
    getAllNotes();

  }
} catch (error) {
  if (error.response && error.response.data && error.response.data.message) {
   console.log("An error occurred");
   
  }
}

  }


  const togglePin = async (noteId, isPinned) => {
    try {
      const response = await axiosInstance.put(`/update-note-pinned/${noteId}`, {
        isPinned: !isPinned,
      });
      if (response.data && response.data.success) {
        showToastMessage(`Note ${!isPinned ? "Pinned" : "Unpinned"} Successfully`);
        setAllNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId ? { ...note, isPinned: !isPinned } : note
          )
        );
      }
    } catch (error) {
      console.error("An error occurred while pinning/unpinning the note", error);
    }
  };

  
  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <NavBar userInfo={userInfo} />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((note, index) => (
            <NoteCard
              key={index}
              title={note.title}
              content={note.content}
              date={note.createdOn}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => handleEdit(note)}
              onDelete={() => {deleteNote(note)}}
              onPinNote={() => { togglePin(note._id, note.isPinned)}}
            />
          ))}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
