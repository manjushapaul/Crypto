"use client";

import { useState } from "react";
import Inbox from "@/components/dashboard/Inbox";
import { inboxMessages, sentMessages } from "@/lib/dummy-data";
import { Message } from "@/types";
import { Mail, MailOpen, Archive, Trash2, ChevronLeft, X, Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inbox Page
 * 
 * Full-page message inbox for the fintech dashboard
 * 
 * Features:
 * - Message inbox with folder navigation (Inbox, Sent, Archived)
 * - Search and filter functionality
 * - Message detail view
 * - Full theme support (light/dark)
 * - Internationalization support
 * - Responsive design
 * - Message actions (archive, delete, mark as read/unread)
 */
export default function InboxPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  /**
   * Handle message click
   */
  const handleMessageClick = (message: any) => {
    console.log("Message clicked:", message);
    // TODO: Implement message detail navigation or modal
  };

  /**
   * Handle message select
   */
  const handleMessageSelect = (message: Message | null) => {
    setSelectedMessage(message);
    setIsComposeOpen(false); // Close compose when selecting a message
  };

  /**
   * Handle compose
   */
  const handleCompose = () => {
    setIsComposeOpen(true);
    setSelectedMessage(null); // Clear selected message when composing
  };

  /**
   * Handle compose close
   */
  const handleComposeClose = () => {
    setIsComposeOpen(false);
    setComposeData({ to: "", subject: "", body: "" });
  };

  /**
   * Handle send message
   */
  const handleSendMessage = () => {
    if (!composeData.to || !composeData.subject || !composeData.body) {
      alert("Please fill in all fields");
      return;
    }
    
    console.log("Sending message:", composeData);
    // TODO: Call API to send message
    
    // Reset form and close compose
    setComposeData({ to: "", subject: "", body: "" });
    setIsComposeOpen(false);
    
    // Show success message (you can replace this with a toast notification)
    alert("Message sent successfully!");
  };

  /**
   * Handle archive
   */
  const handleArchive = (messageId: string) => {
    console.log("Archive message:", messageId);
    // TODO: Call API to archive message
  };

  /**
   * Handle delete
   */
  const handleDelete = (messageId: string) => {
    console.log("Delete message:", messageId);
    // TODO: Call API to delete message
  };

  /**
   * Handle mark as read
   */
  const handleMarkAsRead = (messageId: string) => {
    console.log("Mark as read:", messageId);
    // TODO: Call API to mark message as read
  };

  /**
   * Handle mark as unread
   */
  const handleMarkAsUnread = (messageId: string) => {
    console.log("Mark as unread:", messageId);
    // TODO: Call API to mark message as unread
  };

  /**
   * Format relative time
   */
  function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  }

  /**
   * Get sender initials for avatar
   */
  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="p-0 sm:p-0 lg:p-0">
      <div className="mx-auto max-w-screen-2xl min-h-screen">
        {/* Main Layout - Matching Home page structure exactly */}
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen">
          {/* Left Column - Inbox Content */}
          <div className="lg:col-span-2 space-y-6 p-3 bg-[#eaebfd] dark:bg-gray-900 sm:p-8">
            <Inbox
              messages={inboxMessages}
              sentMessages={sentMessages}
              onMessageClick={handleMessageClick}
              onCompose={handleCompose}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onMessageSelect={handleMessageSelect}
              selectedMessageId={selectedMessage?.id || null}
            />
          </div>

          {/* Right Column - Sidebar (matching Home page) - Gradient extends to bottom */}
          <div className="flex flex-col bg-linear-to-r from-gray-100 via-blue-100 to-gray-100 dark:bg-linear-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-8 lg:col-span-1 min-h-full">
            {isComposeOpen ? (
              /* Compose Message Form */
              <div className="rounded-xl bg-white dark:bg-gray-700 p-6 shadow-md">
                {/* Compose Header */}
                <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Compose Message
                  </h2>
                  <button
                    onClick={handleComposeClose}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                    title="Close"
                  >
                    <X className="h-5 w-5 text-[#ff9500]" />
                  </button>
                </div>

                {/* Compose Form */}
                <div className="space-y-4">
                  {/* To Field */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      To
                    </label>
                    <input
                      type="text"
                      value={composeData.to}
                      onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                      placeholder="Enter recipient email or username"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={composeData.subject}
                      onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                      placeholder="Enter message subject"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                    />
                  </div>

                  {/* Message Body */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message
                    </label>
                    <textarea
                      value={composeData.body}
                      onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                      placeholder="Type your message here..."
                      rows={12}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={handleComposeClose}
                      className="flex items-center gap-2 rounded-xl bg-[#ffe369] dark:bg-yellow-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#22243A] dark:text-gray-900 shadow-md transition-all duration-200 hover:bg-[#ffd940] dark:hover:bg-yellow-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22243A] focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                        title="Attach file"
                      >
                        <Paperclip className="h-5 w-5 text-[#ff9500]" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="flex items-center gap-2 rounded-xl bg-[#22243A] dark:bg-gray-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#ffe369] dark:text-yellow-400 shadow-md transition-all duration-200 hover:bg-[#2a2d3f] dark:hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ffe369] focus:ring-offset-2"
                      >
                        <Send className="h-4 w-4 text-[#ffe369] dark:text-yellow-400" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedMessage ? (
              /* Message Detail */
              <div className="rounded-xl bg-white dark:bg-gray-700 p-6 shadow-md">
                {/* Detail Header */}
                <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        selectedMessage.isRead
                          ? handleMarkAsUnread(selectedMessage.id)
                          : handleMarkAsRead(selectedMessage.id)
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                      title={selectedMessage.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {selectedMessage.isRead ? (
                        <Mail className="h-5 w-5 text-[#ff9500]" />
                      ) : (
                        <MailOpen className="h-5 w-5 text-[#ff9500]" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        handleArchive(selectedMessage.id);
                        setSelectedMessage(null);
                      }}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                      title="Archive"
                    >
                      <Archive className="h-5 w-5 text-[#ff9500]" />
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(selectedMessage.id);
                        setSelectedMessage(null);
                      }}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5 text-[#ff9500]" />
                    </button>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="space-y-4">
                  {/* Message Header */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#22243A] text-base font-semibold text-[#ffe369]">
                      {selectedMessage.senderAvatar ? (
                        <img
                          src={selectedMessage.senderAvatar}
                          alt={selectedMessage.sender}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(selectedMessage.sender)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedMessage.sender}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(selectedMessage.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {selectedMessage.preview}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {selectedMessage.preview}
                      {selectedMessage.preview}
                    </p>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
                  <button
                    onClick={() => {
                      setIsComposeOpen(true);
                      setComposeData({
                        to: selectedMessage.sender,
                        subject: `Re: ${selectedMessage.subject}`,
                        body: "",
                      });
                    }}
                    className="w-full rounded-xl bg-[#ffe369] dark:bg-yellow-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#22243A] dark:text-gray-900 shadow-md transition-all duration-200 hover:bg-[#ffd940] dark:hover:bg-yellow-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22243A] focus:ring-offset-2"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ) : (
              /* Empty State - No Message Selected */
              <div className="rounded-xl bg-white dark:bg-gray-700 p-8 shadow-md">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <Mail className="mx-auto h-16 w-16 text-[#ff9500]" />
                    <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Select a message to view
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

