import { useState, type ChangeEvent } from "react";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [user, setUser] = useState({
    username: "Chanon Lien",
    email: "chanon@example.com",
    phone: "+66 1234 5678",
    avatar: "https://i.pravatar.cc/150?img=12",
    is_verified: 'true',
    firstName: '',
    lastName: '',
    bio: '',
  });

  const [formData, setFormData] = useState({ ...user });

 const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const handleSave = () => {
    setUser(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="max-h-screen bg-gray-100 dark:bg-zinc-900 transition-colors flex flex-col items-center p-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 w-full max-w-sm transition-colors">
        <div className="flex flex-col items-center">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold mb-1 text-zinc-800 dark:text-zinc-100">{user.username}</h2>
            {user.is_verified === 'true' && (
              <span className="text-blue-500 font-bold">✔️</span>
            )}
          </div>
          <p className="text-gray-600 dark:text-zinc-300 mb-1">{user.email}</p>
          <p className="text-gray-600 dark:text-zinc-300 mb-1">{user.phone}</p>
          {user.firstName || user.lastName ? (
            <p className="text-gray-600 dark:text-zinc-300 mb-1">{user.firstName} {user.lastName}</p>
          ) : null}
          {user.bio && <p className="text-gray-500 dark:text-zinc-400 text-sm">{user.bio}</p>}
        </div>

        <div className="mt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
              Edit Profile
            </h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-2 border rounded-lg dark:bg-zinc-700 dark:text-white"
              />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-2 border rounded-lg dark:bg-zinc-700 dark:text-white"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-2 border rounded-lg dark:bg-zinc-700 dark:text-white"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded-lg dark:bg-zinc-700 dark:text-white"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-2 border rounded-lg dark:bg-zinc-700 dark:text-white"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="w-full p-2 border rounded-lg dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
