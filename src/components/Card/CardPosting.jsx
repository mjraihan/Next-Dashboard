import React from "react";

export default function CardPosting({ post, session }) {
  return (
    <div className="card bg-base-100 shadow-lg p-4">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.user.avatar}
          alt={post.user.name}
          className="rounded-full w-10 h-10 object-cover"
        />
        <div>
          <p className="font-bold">{post.user.name}</p>
          <p className="text-xs text-gray-500">{post.date}</p>
        </div>
      </div>
      {/* Post Content */}
      <p className="mb-5">{post.content}</p>
      {/* Post Actions */}
      <div className="flex gap-4 mb-4 text-sm text-gray-500">
        <button className="hover:text-primary">👍 Like</button>
        <button className="hover:text-primary">💬 Comment</button>
      </div>
      {/* Comments */}
      <div className="space-y-3">
        {post.comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="rounded-full w-8 h-8 object-cover"
            />
            <div className="bg-base-200 rounded-lg p-2 flex-1">
              <p className="text-sm">
                <span className="font-bold">{comment.user.name}</span>{" "}
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Add Comment */}
      <div className="flex items-stretch gap-3 mt-4">
        <img
          src={session.image}
          alt={session.name}
          className="rounded-full w-10 h-10 object-cover"
        />
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Write a comment..."
        />
        <button className="btn btn-primary btn-sm min-h-full">Send</button>
      </div>
    </div>
  );
}
