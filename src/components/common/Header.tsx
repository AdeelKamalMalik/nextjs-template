import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllNotifications, checkUnRead, markAllRead } from '../../queries/notification';
import { Notification } from '../../types';
import socket from '../../socket';
import { getNotificationMessage } from '@/utils';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications list
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getAllNotifications,
    enabled: !!currentUser,
  });

  const { data: unreadStatus } = useQuery<{ unread: boolean }>({
    queryKey: ['unreadStatus'],
    queryFn: checkUnRead,
    enabled: !!currentUser,
  });
  const hasUnread = unreadStatus?.unread ?? false;

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadStatus'] });
    },
  });

  const handleNotificationIconClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen && hasUnread) {
      markAllReadMutation.mutate();
    }
  };

  useEffect(() => {
    const userId = currentUser?.id;
    if (userId) {
      socket.emit("join-room", userId);

      socket.on("new-comment", () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unreadStatus'] });
      });

      socket.on("new-reply", () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unreadStatus'] });
      });
    }

    return () => {
      socket.off("new-comment");
      socket.off("new-reply");
    };
  }, [currentUser, queryClient]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/auth/signin';
  };

  return (
    <header className="flex justify-between items-center bg-white shadow-md p-2">
      <div className="flex items-center">
        <Link href="/" className="mr-2">
          <Image src="/images/logo.png" alt="Logo" width={100} height={60} className="cursor-pointer" />
        </Link>
        <h1 className="text-xl font-semibold">Blog Site</h1>
      </div>

      {currentUser && (
        <div className="flex items-center">
          <Link
            href="/blogs/create"
            className="mr-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            + Create New Blog
          </Link>

          <div className="relative mr-4">
            <button
              onClick={handleNotificationIconClick}
              className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6 6 0 10-12 0v3a2.032 2.032 0 01-.595 1.595L4 17h5m1 0v1a3 3 0 006 0v-1m-6 0h6" />
              </svg>
              {hasUnread && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  •
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-2">
                <h4 className="text-gray-700 font-semibold mb-2">Notifications</h4>
                <ul>
                  {notifications.slice(0, 5).map((notification) => (
                    <li key={notification.id} className="p-2 hover:bg-gray-100 rounded flex items-center space-x-2">
                      <Image
                        src={notification.sender.avatar || '/images/default-avatar.png'}
                        alt={notification.sender.username}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />

                      <Link href={`/blogs/${notification.blog.slug}`} className="text-gray-700 text-sm">
                        <span className="text-blue-600 font-semibold">{notification.sender.username}</span> {getNotificationMessage(notification)} <span className="text-blue-600 font-semibold">{notification.blog.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {notifications.length === 0 && !notificationsLoading && (
                  <p className="text-gray-500 text-sm">No new notifications</p>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center focus:outline-none"
            >
              <div className="mr-3 text-gray-700">
                <span className="font-medium">{currentUser.firstName}</span> <span>{currentUser.lastName}</span>
              </div>

              {currentUser?.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">{currentUser?.username?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <ul>
                  <li>
                    <Link href="/profile" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
