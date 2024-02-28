import React from "react";
import { User } from "../api/user";
interface ProfileProps {
  user: User;
}
export default function Profile({ user }: ProfileProps) {
  if (user)
    return (
      <div className="profile-container">
        {user.imageUrl && (
          <img src={user.imageUrl} alt={user.name} width="50" height="50" />
        )}
        <h2>{user.name}</h2>
      </div>
    );
  return null;
}
