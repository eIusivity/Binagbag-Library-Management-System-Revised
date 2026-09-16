import { BASE_URL } from "./apiConfig";
export async function createNotification(notification) {
  const response = await fetch(`${BASE_URL}/notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    throw new Error("Failed to create notification");
  }

  return response.json();
}
export async function getUnreadNotificationCount(userId, role) {
  const response = await fetch(
    `${BASE_URL}/notification/unread?userId=${userId}&role=${role}`,
  );

  return await response.json();
}
export async function getNotificationsForUser(userId, role) {
  const response = await fetch(
    `${BASE_URL}/notification/get?userId=${userId}&role=${role}`,
  );

  return await response.json();
}
export async function getNotifications(userId, role) {
  const response = await fetch(
    `${BASE_URL}/notification/get?userId=${userId}&role=${role}`,
  );

  if (!response.ok) {
    throw new Error("Failed to retrieve notifications");
  }

  return await response.json();
}
export async function markNotificationAsRead(notificationId, userId) {
  const response = await fetch(
    `${BASE_URL}/notification/mark?notificationId=${notificationId}&userId=${userId}`,
    {
      method: "POST",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return response.json();
}
