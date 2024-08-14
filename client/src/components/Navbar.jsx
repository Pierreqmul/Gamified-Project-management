import React, { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import NotificationPanel from "./NotificationPanel";
import UserAvatar from "./UserAvatar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { updateURL } from "../utils";
import { Input, Layout, Button } from "antd";
import axios from "axios"; // Import axios for API requests

const { Header } = Layout;

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [streak, setStreak] = useState(0); // State to store streak count

  useEffect(() => {
    updateURL({ searchTerm, navigate, location });
  }, [searchTerm]);

  useEffect(() => {
    // Fetch the streak count from the backend
    const fetchStreak = async () => {
      try {
        const response = await axios.get("/api/user/streak");
        setStreak(response.data.streakCount);
      } catch (error) {
        console.error("Failed to fetch streak:", error);
      }
    };
    fetchStreak();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <Header className='flex justify-between items-center bg-white dark:bg-[#1f1f1f] px-4 py-3 2xl:py-4 sticky z-10 top-0'>
      <div className='flex gap-4'>
        <div>
          <Button
            onClick={() => dispatch(setOpenSidebar(true))}
            type="text"
            className='text-2xl text-gray-500 block md:hidden'
            icon="☰"
          />
        </div>

        {location?.pathname !== "/dashboard" && (
          <form
            onSubmit={handleSubmit}
            className='w-64 2xl:w-[400px] flex items-center'
          >
            <Input
              prefix={<MdOutlineSearch className='text-gray-500 text-xl' />}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              placeholder='Search...'
              className='rounded-full bg-[#f3f4f6] dark:bg-[#1c1c1c] placeholder:text-gray-500 text-gray-800'
            />
          </form>
        )}
      </div>

      <div className='flex gap-2 items-center'>
        <div className='mr-4 text-gray-800 dark:text-gray-800 flex items-center'>
          <span className='mr-1'>Streak: </span>
          <span className='text-lg font-bold'>{streak}</span>
          <span className='ml-1'>🔥</span>
        </div>
        <NotificationPanel />
        <UserAvatar />
      </div>
    </Header>
  );
};

export default Navbar;
