import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Search = () => {
  const { axiosInstance } = useContext(AuthContext)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    const value = e.target.value
    setQuery(value)
    if (value.trim() === '') {
      setResults([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get(`/user/search?username=${encodeURIComponent(value)}`)
      if (response.data && response.data.success) {
        setResults(response.data.users)
      } else {
        setError('No users found')
        setResults([])
      }
    } catch {
      setError('Error searching users')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg min-h-screen text-black dark:text-yellow-400">
      <input
        type="text"
        placeholder="Search users by username..."
        value={query}
        onChange={handleSearch}
        className="w-full p-3 rounded-lg border border-yellow-400 bg-transparent text-yellow-400 placeholder-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {results.map((user) => (
          <li
            key={user._id}
            onClick={() => handleUserClick(user._id)}
            className="cursor-pointer p-3 hover:bg-yellow-500 hover:text-black rounded mb-2"
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Search
