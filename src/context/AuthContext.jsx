import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getFirestore, doc, getDoc, setDoc, addDoc, collection } from '../firebase.mock';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user profile
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data());
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const signup = async (email, password, profileData) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const profile = {
      uid: user.uid,
      email,
      avatarUrl: '',
      ...profileData,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', user.uid), profile);

    // Create default account for this user
    await addDoc(collection(db, 'accounts'), {
      name: 'Personal Vault',
      ownerId: user.uid,
      sharedWith: [],
      createdAt: new Date().toISOString()
    });

    setUserProfile(profile);
    return user;
  };

  const logout = () => signOut(auth);

  const updateProfile = async (updates) => {
    if (!currentUser) return;
    const newProfile = { ...userProfile, ...updates };
    await setDoc(doc(db, 'users', currentUser.uid), newProfile, { merge: true });
    setUserProfile(newProfile);
  };

  const value = {
    currentUser,
    userProfile,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
