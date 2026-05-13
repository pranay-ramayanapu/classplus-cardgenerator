import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  browserLocalPersistence,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";

const provider = new GoogleAuthProvider();

function getProfilePhoto(user) {
  return user.photoURL || "";
}

export function getUserProfile(user, loginType) {
  return {
    uid: user.uid,
    displayName: user.displayName || "Guest User",
    email: user.email || "",
    profilePhoto: getProfilePhoto(user),
    loginType,
    updatedAt: serverTimestamp(),
  };
}

export async function saveUserToFirestore(user, loginType) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const profile = getUserProfile(user, loginType);
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  await setDoc(
    userRef,
    {
      ...profile,
      createdAt: snapshot.exists() ? snapshot.data().createdAt : serverTimestamp(),
    },
    { merge: true }
  );

  return profile;
}

async function ensureAuthReady() {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured.");
  }

  await setPersistence(auth, browserLocalPersistence);
}

export async function signInWithGoogle() {
  if (!isFirebaseConfigured) {
    throw new Error("Add your Firebase environment variables before signing in.");
  }

  await ensureAuthReady();
  const result = await signInWithPopup(auth, provider);
  await saveUserToFirestore(result.user, "google");
  return result.user;
}

export async function signUpWithEmail(email, password, displayName) {
  if (!isFirebaseConfigured) {
    throw new Error("Add your Firebase environment variables before signing up.");
  }

  await ensureAuthReady();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  await saveUserToFirestore(
    {
      uid: result.user.uid,
      displayName: displayName || result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    },
    "email/password"
  );
  return result.user;
}

export async function signInWithEmail(email, password) {
  if (!isFirebaseConfigured) {
    throw new Error("Add your Firebase environment variables before signing in.");
  }

  await ensureAuthReady();
  const result = await signInWithEmailAndPassword(auth, email, password);
  await saveUserToFirestore(result.user, "email/password");
  return result.user;
}

export async function signInAsGuest() {
  if (!isFirebaseConfigured) {
    throw new Error("Add your Firebase environment variables before using guest login.");
  }

  await ensureAuthReady();
  const result = await signInAnonymously(auth);
  await saveUserToFirestore(result.user, "guest");
  return result.user;
}

export function watchAuthState(callback) {
  if (!auth) {
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

export async function signOutUser() {
  if (!auth) {
    return;
  }

  await signOut(auth);
}
