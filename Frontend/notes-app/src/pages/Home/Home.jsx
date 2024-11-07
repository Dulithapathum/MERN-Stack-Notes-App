import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import NavBar from "../../components/NavBar/NavBar";

const Home = () => {
  return (
    <>
      <NavBar />
      <div className=" container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          <NoteCard
            title="meeting 7th of november"
            content=" I will not publish this remix on streaming platforms like Spotify, Apple Music without the permission of the respected owner. It's just a Remix"
            date="3rd november 2024"
            tags="meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>
      <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10" onClick={()=>{}}>
        <MdAdd className="text-[32px] text-white"/>
      </button>
    </>

  );
};

export default Home;
