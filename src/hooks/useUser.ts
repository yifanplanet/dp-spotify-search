import { useState, useEffect } from "react";

interface User {
  name: string;
  profileUrl: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/user`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const userData: User = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null); // Consider how you want to handle errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { user, isLoading };
};
