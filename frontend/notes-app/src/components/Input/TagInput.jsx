import { MdAdd, MdClose } from 'react-icons/md'
import { useState } from 'react'

const TagInput = ({tags, setTags}) => {
    const [inputValue, setInputValue] = useState("")
    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    };

    const addNewTag = () => {
        if(inputValue.trim() !== ""){
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleKeyDown = (e) => {
        if(e.key==="Enter"){
            addNewTag();
        }
    };

    const handleRemoveTag = (tagToRemove)=> {
        setTags(tags.filter((tag)=> tag!==tagToRemove));
    };

  return (
    <div>
        {tags?.length > 0 && (
            <div className='flex items-center gap-2 flex-wrap mt-2'>
            {tags.map((tag, index)=>(
                <span key={index} className='flex items-center text-sm text-slate-700
                bg-slate-200 px-2 py-1 rounded'>
                    # {tag}
                    <button className='cursor-pointer' onClick={()=>{handleRemoveTag(tag)}}>
                        <MdClose />
                    </button>
                </span>
            ))}
        </div>
        )}
        <div className='flex items-center gap-4 mt-3'>
            <input type='text' 
            className='text-sm w-40 bg-transparent border px-3 py-2 rounded outline-none'
            placeholder='Add tags'
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            />
            <button type='button' className='w-8 h-8 flex items-center justify-center 
            cursor-pointer rounded border border-blue-700 hover:bg-blue-700 relative z-10 pointer-events-auto' onClick={addNewTag}>
                <MdAdd className='text-2xl text-blue-700 hover:text-white' />
            </button>
        </div>
    </div>
  )
}

export default TagInput
