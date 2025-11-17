"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Inbox as InboxIcon,
  Send,
  Archive,
  Search,
  Filter,
  Plus,
  Trash2,
  Mail,
  MailOpen,
  X,
  ChevronLeft,
} from "lucide-react";
import { Message } from "@/types";
import { inboxMessages, sentMessages } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useMessages } from "@/context/MessagesContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { applyPersistedReadState, saveReadState } from "@/lib/message-storage";

/**
 * Inbox Component Props
 */
interface InboxProps {
  messages?: Message[];
  sentMessages?: Message[];
  onMessageClick?: (message: Message) => void;
  onCompose?: () => void;
  onArchive?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onMarkAsRead?: (messageId: string) => void;
  onMarkAsUnread?: (messageId: string) => void;
  onMessageSelect?: (message: Message | null) => void;
  selectedMessageId?: string | null;
}

/**
 * Internationalization strings
 */
const i18n: Record<string, Record<string, string>> = {
  en: {
    inbox: "Inbox",
    sent: "Sent",
    archived: "Archived",
    compose: "Compose",
    search: "Search messages...",
    filter: "Filter",
    all: "All",
    unread: "Unread",
    read: "Read",
    noMessages: "No messages",
    noMessagesInFolder: "No messages in this folder",
    selectMessage: "Select a message to view",
    markAsRead: "Mark as read",
    markAsUnread: "Mark as unread",
    archive: "Archive",
    delete: "Delete",
    reply: "Reply",
    from: "From",
    to: "To",
    subject: "Subject",
    date: "Date",
    close: "Close",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
    justNow: "Just now",
  },
  es: {
    inbox: "Bandeja de entrada",
    sent: "Enviados",
    archived: "Archivados",
    compose: "Redactar",
    search: "Buscar mensajes...",
    filter: "Filtrar",
    all: "Todos",
    unread: "No leídos",
    read: "Leídos",
    noMessages: "No hay mensajes",
    noMessagesInFolder: "No hay mensajes en esta carpeta",
    selectMessage: "Selecciona un mensaje para ver",
    markAsRead: "Marcar como leído",
    markAsUnread: "Marcar como no leído",
    archive: "Archivar",
    delete: "Eliminar",
    reply: "Responder",
    from: "De",
    to: "Para",
    subject: "Asunto",
    date: "Fecha",
    close: "Cerrar",
    minutesAgo: "hace minutos",
    hoursAgo: "hace horas",
    daysAgo: "hace días",
    justNow: "Ahora mismo",
  },
  fr: {
    inbox: "Boîte de réception",
    sent: "Envoyés",
    archived: "Archivés",
    compose: "Rédiger",
    search: "Rechercher des messages...",
    filter: "Filtrer",
    all: "Tous",
    unread: "Non lus",
    read: "Lus",
    noMessages: "Aucun message",
    noMessagesInFolder: "Aucun message dans ce dossier",
    selectMessage: "Sélectionnez un message à afficher",
    markAsRead: "Marquer comme lu",
    markAsUnread: "Marquer comme non lu",
    archive: "Archiver",
    delete: "Supprimer",
    reply: "Répondre",
    from: "De",
    to: "À",
    subject: "Objet",
    date: "Date",
    close: "Fermer",
    minutesAgo: "il y a minutes",
    hoursAgo: "il y a heures",
    daysAgo: "il y a jours",
    justNow: "À l'instant",
  },
  de: {
    inbox: "Posteingang",
    sent: "Gesendet",
    archived: "Archiviert",
    compose: "Verfassen",
    search: "Nachrichten suchen...",
    filter: "Filter",
    all: "Alle",
    unread: "Ungelesen",
    read: "Gelesen",
    noMessages: "Keine Nachrichten",
    noMessagesInFolder: "Keine Nachrichten in diesem Ordner",
    selectMessage: "Wählen Sie eine Nachricht aus",
    markAsRead: "Als gelesen markieren",
    markAsUnread: "Als ungelesen markieren",
    archive: "Archivieren",
    delete: "Löschen",
    reply: "Antworten",
    from: "Von",
    to: "An",
    subject: "Betreff",
    date: "Datum",
    close: "Schließen",
    minutesAgo: "vor Minuten",
    hoursAgo: "vor Stunden",
    daysAgo: "vor Tagen",
    justNow: "Gerade jetzt",
  },
  ja: {
    inbox: "受信トレイ",
    sent: "送信済み",
    archived: "アーカイブ",
    compose: "作成",
    search: "メッセージを検索...",
    filter: "フィルター",
    all: "すべて",
    unread: "未読",
    read: "既読",
    noMessages: "メッセージなし",
    noMessagesInFolder: "このフォルダーにメッセージがありません",
    selectMessage: "表示するメッセージを選択",
    markAsRead: "既読にする",
    markAsUnread: "未読にする",
    archive: "アーカイブ",
    delete: "削除",
    reply: "返信",
    from: "送信元",
    to: "宛先",
    subject: "件名",
    date: "日付",
    close: "閉じる",
    minutesAgo: "分前",
    hoursAgo: "時間前",
    daysAgo: "日前",
    justNow: "たった今",
  },
  zh: {
    inbox: "收件箱",
    sent: "已发送",
    archived: "已归档",
    compose: "撰写",
    search: "搜索消息...",
    filter: "筛选",
    all: "全部",
    unread: "未读",
    read: "已读",
    noMessages: "没有消息",
    noMessagesInFolder: "此文件夹中没有消息",
    selectMessage: "选择要查看的消息",
    markAsRead: "标记为已读",
    markAsUnread: "标记为未读",
    archive: "归档",
    delete: "删除",
    reply: "回复",
    from: "发件人",
    to: "收件人",
    subject: "主题",
    date: "日期",
    close: "关闭",
    minutesAgo: "分钟前",
    hoursAgo: "小时前",
    daysAgo: "天前",
    justNow: "刚刚",
  },
};

/**
 * Format relative time
 */
function formatRelativeTime(date: Date, t: Record<string, string>): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return t.justNow;
  if (diffMins < 60) return `${diffMins} ${t.minutesAgo}`;
  if (diffHours < 24) return `${diffHours} ${t.hoursAgo}`;
  return `${diffDays} ${t.daysAgo}`;
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

/**
 * Inbox - Full-page message inbox component matching Home page design exactly
 * 
 * Features:
 * - Matches Home page background, cards, spacing, and colors exactly
 * - Left sidebar with folder navigation (Inbox, Sent, Archived)
 * - Main area with scrollable message list
 * - Right panel for message detail (desktop) or full view (mobile)
 * - Top bar with search, filters, and compose button
 * - Full theme support (light/dark)
 * - Internationalization support
 * - Responsive design (mobile, tablet, desktop)
 * - Message actions: archive, delete, mark as read/unread
 */
export default function Inbox({
  messages = inboxMessages,
  sentMessages: propSentMessages = sentMessages,
  onMessageClick,
  onCompose,
  onArchive,
  onDelete,
  onMarkAsRead,
  onMarkAsUnread,
  onMessageSelect,
  selectedMessageId,
}: InboxProps) {
  const { language } = useTheme();
  const t = i18n[language] || i18n.en;
  const { setUnreadCount } = useMessages();

  // State
  const [activeFolder, setActiveFolder] = useState<"inbox" | "sent" | "archived">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [localMessages, setLocalMessages] = useState<Message[]>(() => 
    applyPersistedReadState(messages || [])
  );
  const [localSentMessages, setLocalSentMessages] = useState<Message[]>(() => 
    applyPersistedReadState(propSentMessages || [])
  );
  const [archivedMessages, setArchivedMessages] = useState<Message[]>([]);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Sync local state with props when they change, applying persisted read state
  useEffect(() => {
    setLocalMessages(applyPersistedReadState(messages || []));
  }, [messages]);

  useEffect(() => {
    setLocalSentMessages(applyPersistedReadState(propSentMessages || []));
  }, [propSentMessages]);

  // Sync selectedMessage with parent if selectedMessageId prop is provided
  useEffect(() => {
    if (selectedMessageId) {
      const message = [...localMessages, ...localSentMessages, ...archivedMessages].find(m => m.id === selectedMessageId);
      setSelectedMessage(message || null);
    } else {
      setSelectedMessage(null);
    }
  }, [selectedMessageId, localMessages, localSentMessages, archivedMessages]);

  // Initialize and update unread count in context whenever messages change
  useEffect(() => {
    const unreadCount = localMessages.filter((m) => !m.isRead).length;
    setUnreadCount(unreadCount);
  }, [localMessages, setUnreadCount]);

  /**
   * Handle mark all as read
   */
  const handleMarkAllRead = () => {
    if (activeFolder === "inbox") {
      setLocalMessages((prev) => {
        const updated = prev.map((m) => {
          if (!m.isRead) {
            saveReadState(m.id, true); // Save to localStorage
          }
          return { ...m, isRead: true };
        });
        setUnreadCount(0);
        return updated;
      });
    } else if (activeFolder === "sent") {
      setLocalSentMessages((prev) => {
        return prev.map((m) => {
          if (!m.isRead) {
            saveReadState(m.id, true); // Save to localStorage
          }
          return { ...m, isRead: true };
        });
      });
    } else {
      setArchivedMessages((prev) => {
        return prev.map((m) => {
          if (!m.isRead) {
            saveReadState(m.id, true); // Save to localStorage
          }
          return { ...m, isRead: true };
        });
      });
    }
    
    // Show confirmation (you can replace with a toast notification)
    console.log(`All messages in ${activeFolder} marked as read`);
  };

  /**
   * Handle empty trash - Delete all messages in current folder
   */
  const handleEmptyTrash = () => {
    // Confirm before deleting all messages
    const folderName = activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1);
    if (!confirm(`Are you sure you want to delete all messages in ${folderName}? This action cannot be undone.`)) {
      return;
    }

    if (activeFolder === "inbox") {
      setLocalMessages([]);
      setUnreadCount(0);
    } else if (activeFolder === "sent") {
      setLocalSentMessages([]);
    } else {
      setArchivedMessages([]);
    }

    // Clear selected message if it was in this folder
    setSelectedMessage(null);
    setIsMobileDetailOpen(false);

    // Show confirmation (you can replace with a toast notification)
    console.log(`All messages in ${activeFolder} deleted`);
  };

  /**
   * Get messages for current folder
   */
  const currentMessages = useMemo(() => {
    let folderMessages: Message[] = [];
    if (activeFolder === "inbox") {
      folderMessages = localMessages;
    } else if (activeFolder === "sent") {
      folderMessages = localSentMessages;
    } else if (activeFolder === "archived") {
      folderMessages = archivedMessages;
    }

    // Apply search filter
    if (searchQuery) {
      folderMessages = folderMessages.filter(
        (msg) =>
          msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply read/unread filter
    if (filter === "unread") {
      folderMessages = folderMessages.filter((msg) => !msg.isRead);
    } else if (filter === "read") {
      folderMessages = folderMessages.filter((msg) => msg.isRead);
    }

    // Sort by timestamp (newest first)
    return folderMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [activeFolder, localMessages, localSentMessages, archivedMessages, searchQuery, filter]);

  /**
   * Handle message click
   */
  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setIsMobileDetailOpen(true);
    onMessageClick?.(message);
    onMessageSelect?.(message);
    
    // Mark as read if unread (this will also save to localStorage via handleMarkAsRead)
    if (!message.isRead) {
      handleMarkAsRead(message.id);
    }
    
    if (onMessageClick) {
      onMessageClick(message);
    }
  };

  /**
   * Handle archive
   */
  const handleArchive = (messageId: string) => {
    const message = [...localMessages, ...localSentMessages].find((m) => m.id === messageId);
    if (!message) return;

    // Remove from current folder
    if (activeFolder === "inbox") {
      setLocalMessages((prev) => {
        const updated = prev.filter((m) => m.id !== messageId);
        // Update context count
        const unreadCount = updated.filter((m) => !m.isRead).length;
        setUnreadCount(unreadCount);
        return updated;
      });
    } else if (activeFolder === "sent") {
      setLocalSentMessages((prev) => prev.filter((m) => m.id !== messageId));
    }

    // Add to archived
    setArchivedMessages((prev) => [...prev, { ...message, folder: "archived" }]);

    // Close detail if this message was selected
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
      setIsMobileDetailOpen(false);
    }

    if (onArchive) {
      onArchive(messageId);
    }
  };

  /**
   * Handle delete
   */
  const handleDelete = (messageId: string) => {
    if (activeFolder === "inbox") {
      setLocalMessages((prev) => {
        const updated = prev.filter((m) => m.id !== messageId);
        // Update context count
        const unreadCount = updated.filter((m) => !m.isRead).length;
        setUnreadCount(unreadCount);
        return updated;
      });
    } else if (activeFolder === "sent") {
      setLocalSentMessages((prev) => prev.filter((m) => m.id !== messageId));
    } else {
      setArchivedMessages((prev) => prev.filter((m) => m.id !== messageId));
    }

    // Close detail if this message was selected
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
      setIsMobileDetailOpen(false);
    }

    if (onDelete) {
      onDelete(messageId);
    }
  };

  /**
   * Handle mark as read
   */
  const handleMarkAsRead = (messageId: string) => {
    // Save to localStorage
    saveReadState(messageId, true);

    const updateMessage = (msgs: Message[]) =>
      msgs.map((m) => (m.id === messageId ? { ...m, isRead: true } : m));

    if (activeFolder === "inbox") {
      setLocalMessages((prev) => {
        const updated = updateMessage(prev);
        // Update context count
        const unreadCount = updated.filter((m) => !m.isRead).length;
        setUnreadCount(unreadCount);
        return updated;
      });
    } else if (activeFolder === "sent") {
      setLocalSentMessages(updateMessage);
    } else {
      setArchivedMessages(updateMessage);
    }

    if (selectedMessage?.id === messageId) {
      setSelectedMessage((prev) => (prev ? { ...prev, isRead: true } : null));
    }

    if (onMarkAsRead) {
      onMarkAsRead(messageId);
    }
  };

  /**
   * Handle mark as unread
   */
  const handleMarkAsUnread = (messageId: string) => {
    // Save to localStorage
    saveReadState(messageId, false);

    const updateMessage = (msgs: Message[]) =>
      msgs.map((m) => (m.id === messageId ? { ...m, isRead: false } : m));

    if (activeFolder === "inbox") {
      setLocalMessages((prev) => {
        const updated = updateMessage(prev);
        // Update context count
        const unreadCount = updated.filter((m) => !m.isRead).length;
        setUnreadCount(unreadCount);
        return updated;
      });
    } else if (activeFolder === "sent") {
      setLocalSentMessages(updateMessage);
    } else {
      setArchivedMessages(updateMessage);
    }

    if (selectedMessage?.id === messageId) {
      setSelectedMessage((prev) => (prev ? { ...prev, isRead: false } : null));
    }

    if (onMarkAsUnread) {
      onMarkAsUnread(messageId);
    }
  };

  /**
   * Get unread count for folder
   */
  const getUnreadCount = (folder: "inbox" | "sent" | "archived") => {
    let folderMessages: Message[] = [];
    if (folder === "inbox") folderMessages = localMessages;
    else if (folder === "sent") folderMessages = localSentMessages;
    else folderMessages = archivedMessages;
    return folderMessages.filter((m) => !m.isRead).length;
  };

  return (
    <ErrorBoundary>
      {/* Main Container - Matching Home page structure exactly */}
      <div className="space-y-6">
        {/* Unified Container: Tabs + Content - Matching Home page card style */}
        <div className="rounded-xl lg:rounded-3xl lg:p-6 lg:shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] dark:lg:shadow-[inset_0_2px_8px_rgba(255,255,255,0.06)] lg:dark:bg-gray-800">

          {/* Main Content Grid - Matching Home page layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Folders + Quick Actions */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ff9500]" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 pr-4 pl-10 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                />
              </div>

              {/* Folders Navigation */}
              <div className="rounded-xl bg-white dark:bg-gray-700 p-4 shadow-md">
                <nav className="space-y-2">
                  {[
                    { id: "inbox" as const, label: t.inbox, icon: InboxIcon },
                    { id: "sent" as const, label: t.sent, icon: Send },
                    { id: "archived" as const, label: t.archived, icon: Archive },
                  ].map((folder) => {
                    const Icon = folder.icon;
                    const unreadCount = getUnreadCount(folder.id);
                    const isActive = activeFolder === folder.id;

                    return (
                      <button
                        key={folder.id}
                        onClick={() => {
                          setActiveFolder(folder.id);
                          setSelectedMessage(null);
                          setIsMobileDetailOpen(false);
                          // Reset filter when switching folders
                          setFilter("all");
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                          isActive
                            ? "bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                            : "text-gray-500 dark:text-gray-400 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-[#ff9500]" />
                          <span>{folder.label}</span>
                        </div>
                        {unreadCount > 0 && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-semibold",
                              isActive
                                ? "bg-[#22243A] text-[#ffe369]"
                                : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                            )}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Actions Card */}
              <div className="rounded-xl bg-white dark:bg-gray-700 p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button 
                    onClick={handleMarkAllRead}
                    className="w-full rounded-xl bg-[#22243A] dark:bg-gray-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#ffe369] dark:text-yellow-400 shadow-md transition-all duration-200 hover:bg-[#2a2d3f] dark:hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ffe369] focus:ring-offset-2"
                  >
                    Mark All Read
                  </button>
                  <button 
                    onClick={handleEmptyTrash}
                    className="w-full rounded-xl bg-[#22243A] dark:bg-gray-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#ffe369] dark:text-yellow-400 shadow-md transition-all duration-200 hover:bg-[#2a2d3f] dark:hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ffe369] focus:ring-offset-2"
                  >
                    Empty Trash
                  </button>
                </div>
              </div>
            </div>

            {/* Message List Area */}
            <div className="lg:col-span-9">
              <div className="rounded-xl bg-white dark:bg-gray-700 p-4 shadow-md">
                {/* Top Bar - Filter and Compose */}
                <div className="mb-4 flex items-center justify-between gap-3">
                  {/* Filter Dropdown */}
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as "all" | "unread" | "read")}
                      className="appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 pr-10 text-sm text-gray-700 dark:text-gray-200 shadow-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                    >
                      <option value="all">{t.all}</option>
                      <option value="unread">{t.unread}</option>
                      <option value="read">{t.read}</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="h-4 w-4 text-[#ff9500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Compose Button */}
                  <button
                    onClick={() => onCompose?.()}
                    className="flex items-center gap-2 rounded-xl bg-[#22243A] dark:bg-gray-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#ffe369] dark:text-yellow-400 shadow-md transition-all duration-200 hover:bg-[#2a2d3f] dark:hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ffe369] focus:ring-offset-2"
                  >
                    <Plus className="h-4 w-4 text-[#ffe369] dark:text-yellow-400" />
                    <span className="hidden sm:inline">{t.compose}</span>
                  </button>
                </div>

                {/* Message List */}
                <div className="max-h-[600px] overflow-y-auto">
                  {currentMessages.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.noMessagesInFolder}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentMessages.map((message) => {
                        const isSelected = selectedMessage?.id === message.id;
                        return (
                          <div
                            key={message.id}
                            onClick={() => handleMessageClick(message)}
                            className={cn(
                              "cursor-pointer rounded-xl p-1 sm:p-4 transition-all duration-200",
                              "hover:bg-gray-50 dark:hover:bg-gray-600/50",
                              isSelected && "bg-blue-50 dark:bg-gray-600"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#22243A] text-sm font-semibold text-[#ffe369]">
                                {message.senderAvatar ? (
                                  <img
                                    src={message.senderAvatar}
                                    alt={message.sender}
                                    className="h-full w-full rounded-full object-cover"
                                  />
                                ) : (
                                  <span>{getInitials(message.sender)}</span>
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p
                                        className={cn(
                                          "truncate text-sm font-semibold",
                                          !message.isRead
                                            ? "text-gray-900 dark:text-white"
                                            : "text-gray-600 dark:text-gray-400"
                                        )}
                                      >
                                        {message.sender}
                                      </p>
                                      {!message.isRead && (
                                        <div className="h-2 w-2 shrink-0 rounded-full bg-[#ff9500]" />
                                      )}
                                    </div>
                                    <p
                                      className={cn(
                                        "mt-1 truncate text-sm",
                                        !message.isRead
                                          ? "font-medium text-gray-900 dark:text-white"
                                          : "text-gray-600 dark:text-gray-400"
                                      )}
                                    >
                                      {message.subject}
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                                      {message.preview}
                                    </p>
                                  </div>
                                  <div className="shrink-0 text-right">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatRelativeTime(message.timestamp, t)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
