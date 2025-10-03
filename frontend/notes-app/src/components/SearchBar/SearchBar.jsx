import {FaMagnifyingGlass} from 'react-icons/fa6'
import {IoMdClose} from 'react-icons/io'

const SearchBar = ({value, onChange, handleSearch, onClearSearch}) => {
  return (
    <div className='w-80 px-2 flex items-center gap-2 rounded-2xl border border-gray-300 bg-slate-100'>
      <input type='text' placeholder='Search Notes..' 
      className='w-full text-s bg-transparent py-[11px] outline-none' 
      value={value} 
      onChange={onChange} />

        {value &&
        (<IoMdClose className="text-xl text-slate-400 cursor-pointer hover:text-black " 
        onClick={onClearSearch} />)
        }
        <FaMagnifyingGlass 
        className="text-slate-400 cursor-pointer hover:text-black hover:scale-105 duration-200" 
        onClick={handleSearch} />
      
    </div>
  )
}

export default SearchBar
