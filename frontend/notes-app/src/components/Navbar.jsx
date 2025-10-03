import React from 'react'
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate} from 'react-router-dom'
import SearchBar from './SearchBar/SearchBar';

const Navbar = ({userInfo}) => {

  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  const onClearSearch = () => {
    setSearchQuery('');
  }

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className='flex flex-row justify-between bg-gray-100 items-center px-6 py-2 drop-shadow'>
        <h1 className='text-2xl font-bold text-black py-2'>Notes</h1>

        {/* Search Bar Component */}
        <SearchBar 
        value={searchQuery}
        onChange={(e)=>setSearchQuery(e.target.value)}
        onClearSearch={onClearSearch}
        />

        {/* Profile Info Component */}
        {userInfo && (<ProfileInfo userInfo={userInfo} handleLogOut={handleLogOut}/>)}
    </div>
  )
}

export default Navbar
