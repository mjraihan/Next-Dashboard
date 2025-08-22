"use client";

export default function ProfileSkeleton() {
  return (
    <div className="p-6 bg-base-200 min-h-screen">
      {/* Header Skeleton */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body flex flex-col md:flex-row items-center gap-4">
          <div className="skeleton w-24 h-24 rounded-full"></div>
          <div className="flex-1 text-center md:text-left">
            <div className="skeleton h-6 w-48 mb-2"></div>
            <div className="skeleton h-4 w-32"></div>
          </div>
          <div className="flex gap-4">
            <div className="text-center border-[1px] border-primary py-2 px-6 rounded-md">
              <div className="skeleton h-5 w-8 mx-auto mb-1"></div>
              <div className="skeleton h-3 w-10 mx-auto"></div>
            </div>
            <div className="text-center border-[1px] border-primary py-2 px-6 rounded-md">
              <div className="skeleton h-5 w-8 mx-auto mb-1"></div>
              <div className="skeleton h-3 w-10 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="card bg-base-100 shadow-lg p-4">
          <div className="skeleton h-5 w-40 mb-4"></div>
          <ul className="space-y-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <li key={i} className="flex items-center">
                <div className="skeleton h-4 w-4 rounded-full mr-2"></div>
                <div className="skeleton h-4 w-40"></div>
              </li>
            ))}
          </ul>
          <div className="divider"></div>
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton w-10 h-10 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Posts / Settings Skeleton */}
        <div className="col-span-2 space-y-6">
          {/* Tabs */}
          <div className="tabs tabs-bordered">
            <div className="tab tab-active">
              <div className="skeleton h-4 w-10"></div>
            </div>
            <div className="tab">
              <div className="skeleton h-4 w-14"></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="card bg-base-100 shadow p-4">
                <div className="skeleton h-4 w-20 mb-2"></div>
                <div className="skeleton h-6 w-16 mb-1"></div>
                <div className="skeleton h-3 w-24"></div>
              </div>
            ))}
          </div>

          {/* New Post */}
          <div className="card bg-base-100 shadow-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="skeleton w-12 h-12 rounded-full"></div>
              <div>
                <div className="skeleton h-4 w-32 mb-1"></div>
                <div className="skeleton h-3 w-16"></div>
              </div>
            </div>
            <div className="skeleton h-20 w-full mb-2"></div>
            <div className="skeleton h-8 w-24"></div>
          </div>

          {/* Post List */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="skeleton w-10 h-10 rounded-full"></div>
                <div>
                  <div className="skeleton h-4 w-32 mb-1"></div>
                  <div className="skeleton h-3 w-24"></div>
                </div>
              </div>
              <div className="skeleton h-4 w-48"></div>
              <div className="skeleton h-3 w-full"></div>
              <div className="flex gap-4">
                <div className="skeleton h-3 w-20"></div>
                <div className="skeleton h-3 w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
