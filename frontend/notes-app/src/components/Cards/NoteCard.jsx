import React from 'react'
import { MdOutlinePushPin} from 'react-icons/md'
import { MdCreate, MdDelete } from 'react-icons/md'
import moment from 'moment'

const NoteCard = ({ 
    title, 
    date,
    content, 
    tags, 
    isPinned, 
    onEdit, 
    onDelete, 
    onPinNote}
) => {
  return (
    <div className='flex flex-col border border-slate-300 p-4 rounded-md gap-2 bg-white 
    hover:shadow-xl transition-all ease-in-out duration-400'>
      <div className='flex items-center justify-between'>
        <div>
            <h6 className='text-sm font-medium'>{title}</h6>
            <span className='text-xs text-slate-500'>{moment(date).format("MMMM Do YYYY, h:mm:ss a")}</span>
        </div>

        <MdOutlinePushPin 
            className={`cursor-pointer icon-btn 
            ${isPinned ? 'text-primary' : 'text-slate-400'}`}
            onClick={onPinNote} 
        />
      </div>
      <p className='text-xs text-slate-600 mt-2'>{content?.slice(0,60)}</p>

      <div className='flex items-center justify-between mt-2'>
        <div className='text-xs text-slate-500'>{
        tags.map((tag, index)=>
        <span key={index} 
        className='bg-gray-200 text-gray-700 py-1 px-2 rounded-md text-xs'>
          # {tag}
          </span>
        )}
        </div>
        <div className='flex items-center gap-2'>
            <MdCreate
            className='cursor-pointer hover:text-blue-500 transition-all duration-300'
            onClick={onEdit}
            />
            <MdDelete
            className='cursor-pointer hover:text-red-500 transition-all duration-300'
            onClick={onDelete}
            />
        </div>
      </div>
    </div>
  )
}

export default NoteCard
