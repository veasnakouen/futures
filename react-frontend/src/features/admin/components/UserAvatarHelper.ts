export interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: any[];
  passwordText?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-indigo-500 to-purple-600 text-white ring-indigo-200 dark:ring-indigo-900",
  "bg-gradient-to-br from-blue-500 to-cyan-600 text-white ring-blue-200 dark:ring-blue-900",
  "bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-emerald-200 dark:ring-emerald-900",
  "bg-gradient-to-br from-amber-500 to-orange-600 text-white ring-amber-200 dark:ring-amber-900",
  "bg-gradient-to-br from-rose-500 to-pink-600 text-white ring-rose-200 dark:ring-rose-900",
  "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white ring-violet-200 dark:ring-violet-900",
  "bg-gradient-to-br from-teal-500 to-emerald-600 text-white ring-teal-200 dark:ring-teal-900",
];

export const getAvatarStyle = (idOrName: string) => {
  if (!idOrName) return AVATAR_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < idOrName.length; i++) {
    hash = idOrName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

export const getInitials = (u: User) => {
  let first = u.firstName?.trim() || "";
  let last = u.lastName?.trim() || "";

  if (first.includes("@")) {
    const uname = first.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    return uname.slice(0, 2).toUpperCase() || "US";
  }

  const fLetter = first ? first[0].toUpperCase() : "";
  const lLetter = last ? last[0].toUpperCase() : "";
  if (fLetter && lLetter && fLetter !== lLetter) return `${fLetter}${lLetter}`;
  if (fLetter) return fLetter;
  return (u.userName || "US").slice(0, 2).toUpperCase();
};

export const formatFullName = (u: User) => {
  const first = u.firstName?.trim() || "";
  const last = u.lastName?.trim() || "";
  if (first.includes("@") && first === u.email) {
    const unamePart = first.split("@")[0];
    return unamePart.charAt(0).toUpperCase() + unamePart.slice(1);
  }
  if (first.toLowerCase() === last.toLowerCase()) {
    return first;
  }
  return `${first} ${last}`.trim() || u.userName;
};

export const DEFAULT_USER_AVATAR = "/default.png";

export const getUserAvatarUrl = (u: User): string => {
  if (u.avatarUrl && u.avatarUrl.trim().length > 0) {
    return u.avatarUrl;
  }
  return DEFAULT_USER_AVATAR;
};
