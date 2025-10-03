import Navbar from '../../components/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import AddEditNotes from './AddEditNotes'
import { useEffect, useState } from 'react'
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });

  const [userInfo, setUserInfo] = useState(null);
  const [notes, setNotes] = useState([]);

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes");
      if(response.data && response.data.notes){
        setNotes(response.data.notes);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }

  const handleEdit = (note) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: note
    })
  }

  const handleDelete = async (noteId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if(!confirmDelete) return;
    try {
      await axiosInstance.delete(`/delete/${noteId}`);
      getAllNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  const handlePinNote = async (noteId, isPinned) => {
    try {
      await axiosInstance.put(`/pin-note/${noteId}`, { isPinned: !isPinned });
      getAllNotes();
    } catch (error) {
      console.error("Error pinning/unpinning note:", error);
    }
  }

  const navigate = useNavigate();

  const getUserInfo = async() => {
    try {
      const token = localStorage.getItem("token");
      if(!token){
        navigate("/login");
        return;
      }
      const response = await axiosInstance.get("/user");
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    } catch (err) {
      if(err.response && err.response.status === 401){
        navigate("/login");
      }
      console.error("Error fetching user info:", err);
    }
  };

  useEffect(()=> {
    getAllNotes();
    getUserInfo();
    return ()=> {};
  },[])

  return (
    <div>
      <Navbar userInfo={userInfo}/>

      <div className='container mx-auto'>
        <div className='grid grid-cols-4 gap-3 mt-8'>
          {notes.map((note, index)=> (
            <NoteCard key={index}
            title={note.title}
            date={note.createdOn}
            content={note.content}
            tags={note.tags}
            isPinned={note.isPinned}
            onEdit={()=>{handleEdit(note)}}
            onDelete={()=>{handleDelete(note._id)}}
            onPinNote={()=>{handlePinNote(note._id, note.isPinned)}}
          /> 
          ))}  
        </div>
      </div>
      <button className='w-16 h-16 flex items-center justify-center rounded-2xl font-bold
      bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10 text-white text-2xl'
      onClick={()=>{
        setOpenAddEditModal({
          isShown:true,
          type: "add",
          data:null
        })
      }}>
        +
      </button>

      <Modal
         isOpen={openAddEditModal.isShown}
         onRequestClose={()=>{}}
         style={{
          overlay:{
            backgroundColor: "rgba(0,0,0,0.2)"
          },
         }}
         contentLabel="Add/Edit Note"
         className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto
         mt-14 p-5 overflow-y-auto"
      > 
        <AddEditNotes 
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={()=>{
            setOpenAddEditModal({
              isShown:false,
              type: "add",
              data:null
            })
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </div>
  )
}

export default Home
