import React, { useState, useContext, useEffect, useRef } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { Heart, MessageCircle, Bookmark, X, MoreHorizontal } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const Post = ({ post, showMenu = false, onPostDeleted }) => {
  const { axiosInstance } = useContext(AuthContext)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(Array.isArray(post.likes) ? post.likes.length : (post.likes || 0))
  const [showComments, setShowComments] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [comments, setComments] = useState(post.comments?.filter(c => c.text && c.text.trim() !== '') || [])
  const [loadingComments, setLoadingComments] = useState(false)
  const [errorComments, setErrorComments] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const postId = post._id || post.id

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const toggleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1)
    } else {
      setLikesCount(likesCount + 1)
    }
    setLiked(!liked)
  }

  const toggleBookmark = () => {
    setBookmarked(!bookmarked)
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

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/post/${postId}`)
      if (response.data && response.data.success) {
        alert('Post deleted successfully')
        setMenuOpen(false)
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
    alert('Share post functionality to be implemented')
    setMenuOpen(false)
  }

  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const authorAvatar = post.author?.profilePicture || post.authorAvatar || ''
  const authorName = post.author?.username || post.authorName || 'User'

  const displayLikesCount = Number.isInteger(likesCount) && likesCount >= 0 ? likesCount : 0

  return (
    <>
      <div className="my-12 w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 border border-yellow-500 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={authorAvatar} alt="author avatar" className="ring-2 ring-yellow-400 w-12 h-12 rounded-full" />
              <AvatarFallback className="bg-yellow-400 text-black text-lg">{authorName[0]}</AvatarFallback>
            </Avatar>
            <h1 className="text-yellow-400 font-semibold text-xl">{authorName}</h1>
          </div>
          {showMenu && (
            <div className="relative">
              <button
                aria-label="Post options"
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-yellow-400 hover:text-yellow-300 focus:outline-none"
              >
                <MoreHorizontal size={24} />
              </button>
              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-32 bg-gray-900 border border-yellow-500 rounded-md shadow-lg z-50"
                >
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-yellow-400 hover:bg-yellow-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleShare}
                    className="block w-full text-left px-4 py-2 text-yellow-400 hover:bg-yellow-600"
                  >
                    Share
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mb-8">
          <p className="text-yellow-200 font-semibold text-lg">{post.title}</p>
          {post.image && (
            <img
              src={post.image}
              alt={post.title || 'post content'}
              title={post.title || 'post content'}
              className="mt-6 rounded-lg max-h-[28rem] w-full object-cover shadow-lg border border-yellow-500"
            />
          )}
        </div>
        <div className="flex items-center justify-between mb-6 text-yellow-400">
          <div className="flex items-center gap-10">
            <button onClick={toggleLike} aria-label="Like post" className="flex items-center gap-2">
              <Heart className={`cursor-pointer ${liked ? 'text-red-500' : 'text-yellow-400'}`} size={24} />
              <span className="text-yellow-300 text-lg">{displayLikesCount}</span>
            </button>
            <button onClick={toggleComments} aria-label="View comments" className="flex items-center gap-2">
              <MessageCircle className="cursor-pointer text-yellow-400 hover:text-yellow-300 transition" size={24} />
              <span className="text-yellow-300 text-lg">{comments.length}</span>
            </button>
            <form onSubmit={addComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="p-2 rounded-lg bg-black bg-opacity-50 text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-yellow-500 text-black px-4 py-1 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Post
              </button>
            </form>
          </div>
          <button onClick={toggleBookmark} aria-label="Bookmark post">
            <Bookmark className={`cursor-pointer ${bookmarked ? 'text-yellow-400' : 'text-yellow-600'}`} size={24} />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-yellow-400 rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={toggleComments}
              className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
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
                <div key={comment._id || comment.id} className="mb-3 border-b border-yellow-700 pb-2 flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={comment.author?.profilePicture || comment.authorAvatar} alt="comment author avatar" className="ring-2 ring-yellow-400" />
                    <AvatarFallback className="bg-yellow-400 text-black">{comment.author?.username?.[0] || comment.authorName?.[0]}</AvatarFallback>
                  </Avatar>
                  <p>{comment.text}</p>
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
    image: '',
    likes: 0,
    comments: [],
  },
}

export default Post
