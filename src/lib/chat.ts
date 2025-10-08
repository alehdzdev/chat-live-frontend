import api from './api';
import Cookies from 'js-cookie';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Message {
  sender_id: number;
  sender_username: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  participant1: User;
  participant2: User;
  other_participant: User;
  created_at: string;
  updated_at: string;
  last_message: Message | null;
  unread_count: number;
}

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/core/conversations/');
    return response.data;
  },

  async createConversation(userId: number): Promise<Conversation> {
    const response = await api.post('/core/conversations/create/', {
      user_id: userId,
    });
    return response.data;
  },

  async getConversationMessages(conversationId: number, limit = 50): Promise<Message[]> {
    const response = await api.get(`/core/conversations/${conversationId}/messages/`, {
      params: { limit },
    });
    return response.data;
  },

  async searchUsers(search: string): Promise<User[]> {
    const response = await api.get('/core/users/search/', {
      params: { search },
    });
    return response.data;
  },

  async deleteConversation(conversationId: number) {
    await api.delete(`/core/conversations/${conversationId}/`);
  },

  connectWebSocket(conversationId: number) {
    const token = Cookies.get('access_token');
    const ws = new WebSocket(
      `ws://localhost:8000/ws/chat/${conversationId}/?token=${token}`
    );
    return ws;
  },
};
