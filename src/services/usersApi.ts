import {
  IBackendRes,
  IFollower,
  IPagination,
  IUpdateResponse,
  IUser,
} from "../types/backend";
import axiosInstance from "./config";

const fetchUser = async () => {
  const accessToken = localStorage.getItem("access_token");
  try {
    const res = await axiosInstance.get("/users", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

const fetchUsersWithPagination = async (qs?: string) => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPagination<IUser>>>(
      `/users?${qs}`
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserById = async (id: string, visitorId?: string) => {
  try {
    const uri = visitorId
      ? `/users/${id}?visitorId=${visitorId}`
      : `/users/${id}`;
    const res = await axiosInstance.get<IBackendRes<IUser>>(uri);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const getUserByEmail = async (email: string) => {
  return await axiosInstance.get<IBackendRes<IPagination<IUser>>>(
    `/users?email=${email}&current=1&pageSize=1`
  );
};

const handleFollowUserById = async (
  targetUserId: string,
  currentUserId: string
) => {
  try {
    const res = await axiosInstance.post<IBackendRes<{ isFollowed: boolean }>>(
      `/users/follow/${targetUserId}`,
      { _id: currentUserId }
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchFollowersOfUserById = async (
  targetUserId: string,
  current: number = 0,
  pageSize: number = 5,
  visitorId?: string
) => {
  try {
    let query = `/users/${targetUserId}/followers?current=${current}&pageSize=${pageSize}`;
    if (visitorId) query += `&visitorId=${visitorId}`;
    const res = await axiosInstance.get<IBackendRes<IPagination<IFollower>>>(
      query
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateUserById = async (id: string, createUserDto: IUser) => {
  const res = await axiosInstance.patch<IBackendRes<IUpdateResponse>>(
    `/users/${id}`,
    createUserDto
  );
  return res;
};

const deleteUserById = async (id: string) => {
  console.log(id);
  try {
    const res = await axiosInstance.delete<IBackendRes<{ deleted: number }>>(
      `/users/${id}`
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export {
  fetchUser,
  fetchUsersWithPagination,
  getUserById,
  getUserByEmail,
  fetchFollowersOfUserById,
  handleFollowUserById,
  updateUserById,
  deleteUserById,
};
