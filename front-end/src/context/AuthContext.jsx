import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase"; // Đảm bảo đúng đường dẫn file firebase.js

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setUserDetails(firebaseUser ? { email: firebaseUser.email, name: firebaseUser.displayName, photo: firebaseUser.photoURL } : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Hàm đăng xuất
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserDetails(null);
      console.log("✅ Đã đăng xuất thành công");
    } catch (error) {
      console.error("❌ Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userDetails, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}