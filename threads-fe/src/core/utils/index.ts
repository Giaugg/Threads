// File: core/utils/index.ts

export const timeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
};

// File: core/utils/index.ts

export const timeAgoVN = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);

  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (seconds < 10) return "vừa xong";
  if (seconds < 60) return `${seconds} giây trước`;

  if (minutes < 60) return `${minutes} phút trước`;

  if (hours < 24) return `${hours} giờ trước`;

  if (days < 7) return `${days} ngày trước`;

  // fallback: hiển thị ngày giờ VN
  return past.toLocaleString("vi-VN");
};