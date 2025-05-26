export function formatMessageTime(date: string | number | Date) {
  return new Date(date).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
