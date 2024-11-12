import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import NavBar from "../../components/NavBar/NavBar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
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

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  if (!userInfo) return <div>Loading...</div>;

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
              date={new Date(note.date).toLocaleDateString()}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => handleEdit(note)}
              onDelete={() => {}}
              onPinNote={() => {}}
            />
          ))}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
