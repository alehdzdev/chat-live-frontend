"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { chatService, Conversation, User } from "@/lib/chat";
import { AxiosError } from "axios";

export default function ConversationsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        console.error("Invalid data format:", data);
        setConversations([]);
        setError("Failed to load conversations");
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setConversations([]);
      setError(axiosError.response?.data?.error || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError("");
    try {
      const results = await chatService.searchUsers(searchQuery);
      if (Array.isArray(results)) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setSearchResults([]);
      setError(axiosError.response?.data?.error || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleStartConversation = async (userId: number) => {
    try {
      setError("");
      const conversation = await chatService.createConversation(userId);
      router.push(`/chat/${conversation.id}`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(axiosError.response?.data?.error || "Failed to create conversation");
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Chats</h1>
            <div className="flex gap-2">
              <button onClick={() => router.push("/dashboard")} className="btn">
                Profile
              </button>
              <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow-md">
          {/* Error Message */}
          {error && <div className="p-4 bg-red-100 border-b border-red-400 text-red-700">{error}</div>}

          {/* New Chat Button */}
          <div className="p-4 border-b">
            <button onClick={() => setShowNewChat(!showNewChat)} className="w-full btn">
              + New Chat
            </button>
          </div>

          {/* New Chat Modal */}
          {showNewChat && (
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold mb-3">Start a new conversation</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search usernames..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSearch} disabled={searching} className="btn disabled:opacity-50">
                  {searching ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-white rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleStartConversation(user.id)}
                    >
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-600">
                          {user.first_name} {user.last_name}
                        </p>
                      </div>
                      <button className="text-[#e05c28] text-sm">Chat</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Conversations List */}
          <div className="divide-y">
            {!Array.isArray(conversations) || conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No conversations yet. Start a new chat!</div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => router.push(`/chat/${conversation.id}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#e05c28] rounded-full flex items-center justify-center text-white font-semibold">
                          {conversation.other_participant?.username?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{conversation.other_participant?.username || "Unknown User"}</p>
                          {conversation.last_message && (
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.last_message.sender_username === conversation.other_participant?.username
                                ? ""
                                : "You: "}
                              {conversation.last_message.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {conversation.last_message && (
                      <span className="text-xs text-gray-500">{formatTime(conversation.last_message.timestamp)}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
