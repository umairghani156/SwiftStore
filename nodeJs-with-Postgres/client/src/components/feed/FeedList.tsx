"use client"
import React from 'react'

const FeedList = () => {
  return (
    <main className="flex-1 p-6">
      <button
        className="mb-6 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
        onClick={() => alert('Create Post')}
      >
        Create Post
      </button>

      <div className="space-y-6">
        {/* Post 1 */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">John Doe</h3>
          <p className="mt-2 text-gray-700">This is a sample post content...</p>
          <div className="mt-4 flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-600">
              <span>👍</span>
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-600">
              <span>💬</span>
              <span>Comment</span>
            </button>
          </div>
        </div>

        {/* Another Post */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Jane Smith</h3>
          <p className="mt-2 text-gray-700">Here’s another example of a post...</p>
          <div className="mt-4 flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-600">
              <span>👍</span>
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-600">
              <span>💬</span>
              <span>Comment</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default FeedList