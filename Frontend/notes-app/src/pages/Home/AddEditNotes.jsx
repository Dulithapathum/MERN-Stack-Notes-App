import TagInput from "../../components/Input/tagInput";

const AddEditNotes = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="input_lable">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go To Gym At 9"
        />
      </div>
      <div className=" flex flex-col gap-2 mt-4">
      <label className="input_lable">CONTENT</label>
      <textarea type="text" placeholder="Content" rows={10} className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"></textarea>
      </div>
      <div className="mt-3"><label className="input_lable">TAGS</label> 
      <TagInput/>
      </div>
      <button className="btn-primary font-medium mt-5 p-3" onClick={()=>{}}>ADD</button>
    </>
  );
};

export default AddEditNotes;
