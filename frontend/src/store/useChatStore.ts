import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

// Define or import the SendMessageData type
export interface SendMessageData {
  content: string;
  timestamp?: string;
}
import { useAuthStore } from "./useAuthStore";

interface ChatStoreState {
  messages: any[];
  users: any[];
  selectedUser: any | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: SendMessageData) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: any) => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      if ((error as any).response && (error as any).response.data) {
        if ((error as any).isAxiosError && (error as any).response && (error as any).response.data) {
          toast.error((error as any)?.response?.data?.message || "An unexpected error occurred.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string): Promise<void> => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error: any) {
      if (error instanceof Error && (error as any).response?.data?.message) {
        toast.error((error as any).response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData: SendMessageData): Promise<void> => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      if (error instanceof Error && (error as any).response?.data?.message) {
        toast.error((error as any).response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket as SocketIOClient.Socket; // Ensure the type is explicitly defined

    socket.on("newMessage", (newMessage: { senderId: string; content: string; timestamp: string }) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === (selectedUser as { _id: string })._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
      messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));