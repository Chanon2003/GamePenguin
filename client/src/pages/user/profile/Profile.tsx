import { useNavigate } from 'react-router-dom'; // ถ้าใช้ react-router
// import { useRouter } from 'next/router'; // ถ้าเป็น Next.js

const Profile = () => {
  const navigate = useNavigate(); // หรือใช้ router.push('/') ถ้า Next.js

  const user = {
    name: "Chanon Lien",
    email: "chanon@example.com",
    phone: "+66 1234 5678",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 transition-colors">

      {/* Profile Card */}
      <div className="flex justify-center items-center p-6">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 w-full max-w-sm transition-colors">
          <div className="flex flex-col items-center">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold mb-1 text-zinc-800 dark:text-zinc-100">{user.name}</h2>
            <p className="text-gray-600 dark:text-zinc-300 mb-1">{user.email}</p>
            <p className="text-gray-600 dark:text-zinc-300">{user.phone}</p>
          </div>

          <div className="mt-6">
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
