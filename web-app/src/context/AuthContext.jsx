import { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Convert Firebase user to our app user format
        const appUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          role: 'admin',
          photoURL: firebaseUser.photoURL
        };
        setUser(appUser);
        localStorage.setItem('attendanceProUser', JSON.stringify(appUser));
      } else {
        // Check localStorage for saved auth (fallback)
        const savedUser = localStorage.getItem('attendanceProUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      const appUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email,
        role: 'admin',
        photoURL: firebaseUser.photoURL
      };
      setUser(appUser);
      localStorage.setItem('attendanceProUser', JSON.stringify(appUser));
      return { success: true };
    } catch (error) {
      console.error('Email login error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const appUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email,
        role: 'admin',
        photoURL: firebaseUser.photoURL
      };
      setUser(appUser);
      localStorage.setItem('attendanceProUser', JSON.stringify(appUser));
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    // For demo purposes, also allow mock login
    if (email === 'admin@example.com' && password === 'password') {
      const mockUser = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin',
        photoURL: null
      };
      setUser(mockUser);
      localStorage.setItem('attendanceProUser', JSON.stringify(mockUser));
      return { success: true };
    }
    
    // Try Firebase login
    return await loginWithEmail(email, password);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem('attendanceProUser');
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
