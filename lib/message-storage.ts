/**
 * Message Storage Utility
 * Handles persistence of message read state in localStorage
 */

import { Message } from "@/types";

const STORAGE_KEY = "inbox_message_read_state";

/**
 * Get persisted read state from localStorage
 */
export function getPersistedReadState(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading message read state:", error);
    return {};
  }
}

/**
 * Save read state to localStorage
 */
export function saveReadState(messageId: string, isRead: boolean): void {
  if (typeof window === "undefined") return;
  
  try {
    const currentState = getPersistedReadState();
    currentState[messageId] = isRead;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  } catch (error) {
    console.error("Error saving message read state:", error);
  }
}

/**
 * Apply persisted read state to messages
 */
export function applyPersistedReadState(messages: Message[]): Message[] {
  const persistedState = getPersistedReadState();
  return messages.map((msg) => ({
    ...msg,
    isRead: persistedState[msg.id] !== undefined ? persistedState[msg.id] : msg.isRead,
  }));
}

/**
 * Get unread count from persisted state
 */
export function getPersistedUnreadCount(messages: Message[]): number {
  const persistedState = getPersistedReadState();
  return messages.filter((msg) => {
    const isRead = persistedState[msg.id] !== undefined ? persistedState[msg.id] : msg.isRead;
    return !isRead;
  }).length;
}

/**
 * Clear all persisted read state (for testing/debugging)
 */
export function clearPersistedReadState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

