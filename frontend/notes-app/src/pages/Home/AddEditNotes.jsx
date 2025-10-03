import TagInput from '../../components/Input/TagInput'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../../utils/axiosInstance'

const AddEditNotes = ({noteData, type, getAllNotes, onClose}) => {

  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState("");

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/create-note", {
        title, content, tags
      });
      if(response.data && response.data.note){
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  }

  const editNote =async () => {
    console.log(noteData);
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title, content, tags
      });
      if(response.data && response.data.note){
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.error("Error editing note:", error);
    }
  }

  const handleAddNote = ()=> {
    console.log({title, content, tags});
    if(!title || !content) {
      setError("Title and content are required");
      return;
    }
    setError("");
    if(type==="add"){
      addNewNote();
    }
    else {
      console.log(noteData);
      editNote();
    }
  }

  return (
    <div className='relative'>
      <button className='w-10 h-10 rounded-full flex items-center
      justify-center absolute -right-3 -top-5 hover:bg-slate-200'
      onClick={onClose}
      >
        <MdClose className='text-xl text-slate-400' />
      </button>

      <div className='flex flex-col gap-2'>
      <label className='input-label'>Title</label>
      <input 
      type="text" 
      className='text-xl text-slate-950 outline-none border border-slate-200' 
      placeholder='Go To Gym At 5 PM'
      onChange={({target})=> setTitle(target.value)}
      />
      </div>
      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>Content</label>
        <textarea
        type="text"
        className='text-md text-slate-900 outline-none
        p-2 rounded border border-slate-200' 
        placeholder='Content'
        rows={10}
        onChange={({target})=> setContent(target.value)}
        />
      </div>
      <div className='mt-3'>
        <label className='input-label'>Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
      <button className='btn-primary cursor-pointer font-medium mt-5 p-3 
      bg-blue-500 hover:bg-blue-600 transition-colors duration-300 hover:scale-103'
      onClick={handleAddNote}
      >
        {type==="add" ? "Add" : "Update"}
      </button>
    </div>
  )
}

export default AddEditNotes
