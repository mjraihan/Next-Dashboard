"use client";

import { useUser } from "@/contexts/UserContext";
import React, { useEffect, useState } from "react";
import ProfileSkeleton from "@/components/Loaders/ProfileSkeleton";
import {
  MdCalendarMonth,
  MdCreditCard,
  MdOutlineMail,
  MdOutlinePhoneAndroid,
} from "react-icons/md";
import {
  BiBuildings,
  BiLogoBitcoin,
  BiSolidBriefcaseAlt2,
} from "react-icons/bi";
import {
  FaFacebook,
  FaFacebookSquare,
  FaHouseUser,
  FaLinkedin,
  FaTwitterSquare,
  FaUniversity,
} from "react-icons/fa";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tabsActive, setTabsActive] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useUser();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          fetch(`/api/tunnel/user/${user.id}`),
          fetch(`/api/tunnel/posts/user/${user.id}`), // contoh endpoint kedua
        ]);

        if (!profileRes.ok || !postsRes.ok) {
          throw new Error("Gagal fetch data");
        }

        const [profileData, postsData] = await Promise.all([
          profileRes.json(),
          postsRes.json(),
        ]);

        setProfile(profileData);
        setPosts(postsData.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      getUserData();
    }
  }, [user?.id]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!profile) return null;

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const birthDate = new Date(profile.birthDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    const mm = month.padStart(2, "0");
    const dd = day.padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/tunnel/users/" + user.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal update profil");
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="md:p-6 bg-base-200 min-h-screen">
      {/* Header Profile */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body flex flex-col md:flex-row items-center gap-4">
          <div className="relative">
            <img
              src={profile.image || "https://via.placeholder.com/100"}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="text-sm text-gray-500">
              {profile.company?.title}, {profile.address?.country}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center border-[1px] border-primary py-2 px-6 rounded-md">
              <p className="font-bold">31</p>
              <p className="text-sm">Post</p>
            </div>
            <div className="text-center border-[1px] border-primary py-2 px-6 rounded-md">
              <p className="font-bold">2</p>
              <p className="text-sm">Recipe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
        {/* Sidebar */}
        <div className="card bg-base-100 shadow-lg p-4 mb-6 md:mb-0">
          <h3 className="font-bold mb-2">Personal Information</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <MdCalendarMonth className="mr-2 text-lg" /> {birthDate}
            </li>
            <li className="flex items-start">
              <BiSolidBriefcaseAlt2 className="mr-2 text-lg" />
              {profile.company?.title}
            </li>
            <li className="flex items-start">
              <BiBuildings className="mr-2 text-lg" />
              {profile.company?.name}
            </li>
            <li className="flex items-start">
              <FaUniversity className="mr-2 text-lg" /> {profile.university}
            </li>
            <li className="flex items-start">
              <FaHouseUser className="mr-2 text-lg" />{" "}
              {profile.address?.address}, {profile.address?.city},{" "}
              {profile.address?.state}, {profile.address?.country}
            </li>
            <li className="flex items-start">
              <MdOutlinePhoneAndroid className="mr-2 text-lg" /> {profile.phone}
            </li>
            <li className="flex items-start">
              <MdOutlineMail className="mr-2 text-lg" /> {profile.email}
            </li>
            <li className="flex items-start">
              <MdCreditCard className="mr-2 text-lg" /> {profile.bank?.cardType}{" "}
              {profile.bank?.cardNumber}
            </li>
            <li className="flex items-start">
              <BiLogoBitcoin className="mr-2 text-lg" /> {profile.crypto?.coin}{" "}
              ({profile.crypto?.network})
            </li>
          </ul>
          <div className="divider"></div>
          <div className="flex gap-4">
            <div className="text-center">
              <button className="btn btn-circle btn-primary">
                <FaFacebookSquare className="text-lg" />
              </button>
            </div>
            <div className="text-center">
              <button className="btn btn-circle btn-primary">
                <FaTwitterSquare className="text-lg" />
              </button>
            </div>
            <div className="text-center">
              <button className="btn btn-circle btn-primary">
                <FaLinkedin className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="col-span-2 space-y-6">
          {/* Tabs */}
          <div className="tabs tabs-bordered">
            <button
              className={`tab ${tabsActive === "posts" ? " tab-active" : ""}`}
              onClick={() => setTabsActive("posts")}
            >
              Post
            </button>
            <button
              className={`tab ${
                tabsActive === "settings" ? " tab-active" : ""
              }`}
              onClick={() => setTabsActive("settings")}
            >
              Settings
            </button>
          </div>

          {tabsActive === "posts" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card bg-base-100 shadow p-4">
                  <h4 className="text-lg font-bold">Views</h4>
                  <p className="text-2xl">24k</p>
                  <p className="text-sm text-primary">+1500 this week</p>
                </div>
                <div className="card bg-base-100 shadow p-4">
                  <h4 className="text-lg font-bold">Comments</h4>
                  <p className="text-2xl">24k</p>
                  <p className="text-sm text-primary">+854 likes</p>
                </div>
              </div>

              {/* New Post */}
              <div className="card bg-base-100 shadow-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={profile.image || "https://via.placeholder.com/40"}
                    alt="user"
                    className="rounded-full w-12 h-12 object-cover"
                  />
                  <div>
                    <p className="font-bold">{fullName}</p>
                    <span className="badge badge-success badge-xs text-xs rounded-md text-white">
                      <div className="mb-[2px]">online</div>
                    </span>
                  </div>
                </div>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Write here..."
                ></textarea>
                <button className="btn btn-primary mt-2">Post</button>
              </div>

              {/* Example Post */}
              {posts.map((post) => (
                <div key={post.id} className="card bg-base-100 shadow-lg p-4">
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={user.image || "https://via.placeholder.com/40"}
                      alt={fullName}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                    <div>
                      <p className="font-bold">{fullName}</p>
                      <p className="text-xs text-gray-500">
                        August 14, 2025 • 10:32 AM
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <h1 className="font-bold mb-2 text-lg">{post.title}</h1>
                  <p className="mb-5">{post.body}</p>

                  {/* Post Actions */}
                  <div className="flex gap-4 mb-4 text-sm text-gray-500">
                    <button className="hover:text-primary">
                      👍 {post.reactions.likes} Likes
                    </button>
                    <button className="hover:text-primary">
                      💬 {post.reactions.dislikes} Comments
                    </button>
                  </div>

                  {/* Comments */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="Emily Smith"
                        className="rounded-full w-8 h-8 object-cover"
                      />
                      <div className="bg-base-200 rounded-lg p-2 flex-1">
                        <p className="text-sm">
                          <span className="font-bold">Emily Smith</span> Looks
                          amazing! 🔥
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <img
                        src="https://randomuser.me/api/portraits/men/54.jpg"
                        alt="Mark Lee"
                        className="rounded-full w-8 h-8 object-cover"
                      />
                      <div className="bg-base-200 rounded-lg p-2 flex-1">
                        <p className="text-sm">
                          <span className="font-bold">Mark Lee</span> Great job
                          man, can’t wait to see more!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Add Comment */}
                  <div className="flex items-stretch gap-3 mt-4">
                    <img
                      src={profile.image || "https://via.placeholder.com/40"}
                      alt="current-user"
                      className="rounded-full w-10 h-10 object-cover"
                    />
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Write a comment..."
                    />
                    <button className="btn btn-primary btn-sm min-h-full">
                      Send
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
          {tabsActive === "settings" && (
            <form
              onSubmit={handleSubmit}
              className="card bg-base-100 shadow-lg p-6 space-y-4"
            >
              <h2 className="text-xl font-bold mb-4 text-primary">
                Edit Profile
              </h2>

              {/* Personal Info */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  👤 Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">First Name</div>
                    <input
                      type="text"
                      name="firstName"
                      defaultValue={profile.firstName}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">Last Name</div>
                    <input
                      type="text"
                      name="lastName"
                      defaultValue={profile.lastName}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">Birth Date</div>
                    <input
                      type="date"
                      name="birthDate"
                      defaultValue={formatDate(profile.birthDate)}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">Job Title</div>
                    <input
                      type="text"
                      name="jobTitle"
                      defaultValue={profile.company?.title}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                </div>
              </div>

              <hr className="my-4" />

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  📞 Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">Email</div>
                    <input
                      type="email"
                      name="email"
                      defaultValue={profile.email}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">Phone</div>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={profile.phone}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                </div>
              </div>

              <hr className="my-4" />

              {/* Address */}
              <div>
                <h3 className="font-semibold text-lg mb-2">🏠 Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">
                      Street Address
                    </div>
                    <input
                      type="text"
                      name="streetAddress"
                      defaultValue={profile.address?.address}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">City</div>
                    <input
                      type="text"
                      name="city"
                      defaultValue={profile.address?.city}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">State</div>
                    <input
                      type="text"
                      name="state"
                      defaultValue={profile.address?.state}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">Country</div>
                    <input
                      type="text"
                      name="country"
                      defaultValue={profile.address?.country}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                </div>
              </div>

              <hr className="my-4" />

              {/* Education */}
              <div>
                <h3 className="font-semibold text-lg mb-2">🎓 Education</h3>
                <label className="form-control">
                  <div className="label-text text-sm mb-1">University</div>
                  <input
                    type="text"
                    name="university"
                    defaultValue={profile.university}
                    className="input input-bordered w-full"
                    required
                  />
                </label>
              </div>

              <hr className="my-4" />

              {/* Bank */}
              <div>
                <h3 className="font-semibold text-lg mb-2">🏦 Bank & Crypto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">Card Type</div>
                    <input
                      type="text"
                      name="cardType"
                      defaultValue={profile.bank?.cardType}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">Card Number</div>
                    <input
                      type="text"
                      name="cardNumber"
                      defaultValue={profile.bank?.cardNumber}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">Crypto Coin</div>
                    <input
                      type="text"
                      name="cryptoCoin"
                      defaultValue={profile.crypto?.coin}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <div className="label-text text-sm mb-1">Network</div>
                    <input
                      type="text"
                      name="cryptoNetwork"
                      defaultValue={profile.crypto?.network}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button className="btn btn-primary w-full" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
