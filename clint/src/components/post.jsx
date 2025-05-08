import React, { useState, useContext, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { Heart, MessageCircle, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

const Post = ({ post, showMenu = false, onPostDeleted }) => {
  const { axiosInstance, user: loggedInUser } = useContext(AuthContext)
  const { darkMode } = useContext(ThemeContext)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0)
  const [showComments, setShowComments] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [comments, setComments] = useState(post.comments?.filter(c => c.text && c.text.trim() !== '') || [])
  const [loadingComments, setLoadingComments] = useState(false)
  const [errorComments, setErrorComments] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const postId = post._id || post.id
  const navigate = useNavigate()

  useEffect(() => {
    if (loggedInUser && post.likes) {
      setLiked(post.likes.some(userId => userId === loggedInUser._id || userId === loggedInUser.id))
    }
  }, [loggedInUser, post.likes])

  const toggleLike = async () => {
    try {
      const response = await axiosInstance.get(`/post/${postId}/like`)
      if (response.data && response.data.success) {
        setLiked(!liked)
        setLikesCount(response.data.likes)
      } else {
        alert('Failed to update like')
      }
    } catch (error) {
      console.error('Error liking post:', error)
      alert('Error liking post')
    }
  }

  const toggleComments = async () => {
    if (!showComments) {
      setLoadingComments(true)
      setErrorComments(null)
      try {
        const response = await axiosInstance.get(`/post/${postId}/comment/all/`)
        if (response.data && response.data.success) {
          setComments(response.data.comments)
        } else {
          setErrorComments('Failed to load comments')
          console.error('Failed to load comments:', response)
        }
      } catch (error) {
        setErrorComments('Error loading comments')
        console.error('Error loading comments:', error)
      } finally {
        setLoadingComments(false)
      }
    }
    setShowComments(!showComments)
  }

  const addComment = async (e) => {
    e.preventDefault()
    if (commentInput.trim() === '') return
    try {
      const response = await axiosInstance.post(`/post/${postId}/comment`, {
        postId,
        text: commentInput,
      })
      if (response.data && response.data.success) {
        setComments([response.data.comment, ...comments])
        setCommentInput('')
      } else {
        alert('Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Error adding comment')
    }
  }

  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const handleAuthorClick = () => {
    if (post.author?._id) {
      if (loggedInUser && post.author._id === loggedInUser._id) {
        navigate('/profile')
      } else {
        navigate(`/profile/${post.author._id}`)
      }
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      const response = await axiosInstance.post(`/post/delete/${postId}`)
      if (response.data && response.data.success) {
        alert('Post deleted successfully')
        if (onPostDeleted) {
          onPostDeleted(postId)
        }
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${postId}`
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: postUrl,
      }).catch((error) => {
        console.error('Error sharing:', error)
      })
    } else {
      navigator.clipboard.writeText(postUrl)
      alert('Post URL copied to clipboard')
    }
  }

  return (
    <>
      <div className={`my-12 w-full max-w-3xl mx-auto rounded-xl shadow-2xl p-8 border ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-yellow-500 text-yellow-400' : 'bg-white border-gray-300 text-gray-900'}`}>
        <div className="flex items-center gap-4 mb-8 relative">
          <div className="cursor-pointer flex items-center" onClick={handleAuthorClick}>
            <Avatar>
              <AvatarImage src={post.author?.profilePicture} alt="author avatar" className={darkMode ? "ring-2 ring-yellow-400 rounded-full" : "ring-2 ring-gray-400 rounded-full"} style={{ width: 40, height: 40 }} />
              <AvatarFallback className={darkMode ? "bg-yellow-400 text-black rounded-full" : "bg-gray-400 text-white rounded-full"}>{post.author?.username?.[0]}</AvatarFallback>
            </Avatar>
            <h1 className={darkMode ? "text-yellow-400 font-semibold text-xl ml-2" : "text-gray-900 font-semibold text-xl ml-2"}>{post.author?.username}</h1>
          </div>
          {showMenu && (
            <div className="relative ml-auto">
              <button
                onClick={toggleMenu}
                aria-label="Post options"
                className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-yellow-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
              {menuOpen && (
                <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
                  >
                    Delete Post
                  </button>
                  <button
                    onClick={handleShare}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Share Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={darkMode ? "mb-2 text-yellow-200" : "mb-2 text-gray-900"}>
          <p>{post.title}</p>
          {post.image && (
            <img
              src={post.image}
              alt="post content"
              className={`mt-6 rounded-lg max-h-[28rem] w-full object-cover shadow-lg border ${darkMode ? 'border-yellow-500' : 'border-gray-300'}`}
            />
          )}
        </div>
        <div className={`flex items-center justify-between my-4 ${darkMode ? 'text-yellow-400' : 'text-gray-700'}`}>
          <div className="flex items-center gap-10">
            <button onClick={toggleLike} aria-label="Like post" className="flex items-center gap-2">
              <Heart className={`cursor-pointer ${liked ? 'text-red-500' : (darkMode ? 'text-yellow-400' : 'text-gray-600')}`} size={24} />
              <span className={darkMode ? "text-yellow-300 text-lg" : "text-gray-600 text-lg"}>{likesCount}</span>
            </button>
            <button onClick={toggleComments} aria-label="View comments" className="flex items-center gap-2">
              <MessageCircle className={`cursor-pointer ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-gray-500'} transition`} size={24} />
              <span className={darkMode ? "text-yellow-300 text-lg" : "text-gray-600 text-lg"}>{comments.length}</span>
            </button>
            <form onSubmit={addComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className={`p-2 rounded-lg ${darkMode ? 'bg-black bg-opacity-50 text-yellow-300 placeholder-yellow-500 focus:ring-yellow-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-gray-400'} focus:outline-none focus:ring-2 transition`}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button
                type="submit"
                className={`px-4 py-1 rounded-lg font-semibold transition ${darkMode ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-yellow-400 text-black hover:bg-yellow-300'}`}
              >
                Post
              </button>
            </form>
          </div>
        </div>
        {post.caption && (
          <div className={darkMode ? "text-yellow-300 italic mb-4" : "text-gray-700 italic mb-4"}>
            {post.caption}
          </div>
        )}
      </div>

      {showComments && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${darkMode ? 'bg-black bg-opacity-70' : 'bg-gray-200 bg-opacity-70'}`}>
          <div className={`${darkMode ? 'bg-gray-900 text-yellow-400' : 'bg-white text-gray-900'} rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto relative`}>
            <button
              onClick={toggleComments}
              className={`${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-gray-500'} absolute top-4 right-4`}
              aria-label="Close comments"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            {loadingComments ? (
              <p>Loading comments...</p>
            ) : errorComments ? (
              <p>{errorComments}</p>
            ) : sortedComments.length > 0 ? (
              sortedComments.map((comment) => (
                <div key={comment._id || comment.id} className={`mb-3 border-b pb-2 flex items-center gap-3 ${darkMode ? 'border-yellow-700' : 'border-gray-300'}`}>
                  <Avatar>
                    <AvatarImage src={comment.author?.profilePicture || comment.authorAvatar} alt="comment author avatar" className={darkMode ? "ring-2 ring-yellow-400" : "ring-2 ring-gray-400"} style={{ width: 30, height: 30 }} />
                    <AvatarFallback className={darkMode ? "bg-yellow-400 text-black" : "bg-gray-400 text-white"}>{comment.author?.username?.[0] || comment.authorName?.[0]}</AvatarFallback>
                  </Avatar>
                  <p className={darkMode ? "text-yellow-300" : "text-gray-900"}>{comment.text}</p>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

Post.defaultProps = {
  post: {
    authorName: 'User',
    authorAvatar: '',
    title: 'This is a sample post title.',
    caption: '',
    image: '',
    likes: 0,
    comments: [],
  },
}

export default Post
