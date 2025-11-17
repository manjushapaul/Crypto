"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { inboxMessages } from "@/lib/dummy-data";
import { getPersistedUnreadCount } from "@/lib/message-storage";

/**
 * Messages Context Type
 * Defines the shape of the messages context
 */
interface MessagesContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

/**
 * Messages Context
 * Provides global unread message count state
 */
const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

/**
 * Messages Provider Props
 */
interface MessagesProviderProps {
  children: ReactNode;
}

/**
 * Messages Provider
 * Provides message count state management
 */
export function MessagesProvider({ children }: MessagesProviderProps) {
  // Initialize with persisted unread count
  const [unreadCount, setUnreadCount] = useState(0);

  // Load persisted unread count on mount
  useEffect(() => {
    const persistedCount = getPersistedUnreadCount(inboxMessages);
    setUnreadCount(persistedCount);
  }, []);

  return (
    <MessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </MessagesContext.Provider>
  );
}

/**
 * useMessages Hook
 * Hook to access messages context
 */
export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}


