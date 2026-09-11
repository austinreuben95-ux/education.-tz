import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  Timestamp,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { UserProgress, StudyRoomMessage } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function loginWithEmail(email: string, pass: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error("Email login failed:", error);
    throw error;
  }
}

export async function signUpWithEmail(email: string, pass: string, name?: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (name && result.user) {
      await updateProfile(result.user, { displayName: name });
    }
    return result.user;
  } catch (error) {
    console.error("Sign up failed:", error);
    throw error;
  }
}

export async function logout() {
  await signOut(auth);
}

// --- Firestore Error Handling ---

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Data Operations ---

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const docRef = doc(db, 'users', userId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProgress;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    return null;
  }
}

export async function saveUserProgress(userId: string, progress: UserProgress) {
  const docRef = doc(db, 'users', userId);
  try {
    await setDoc(docRef, {
      ...progress,
      userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
  }
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export const MASTER_ADMIN_EMAIL = 'austinreuben95@gmail.com';

export async function checkIsAdmin(uid: string): Promise<boolean> {
  const currentEmail = auth.currentUser?.email?.toLowerCase().trim();
  if (!currentEmail) return false;
  
  // 1. Primary Master Admin
  if (currentEmail === MASTER_ADMIN_EMAIL) return true;

  // 2. Secondary spot or active collaborators granted access by austinreuben95@gmail.com
  let grantedEmails: string[] = [];
  if (typeof window !== 'undefined') {
    try {
      const savedSpot2 = localStorage.getItem('tz_admin_spot_2');
      if (savedSpot2) grantedEmails.push(savedSpot2.toLowerCase().trim());

      const savedCollabs = localStorage.getItem('tz_app_collaborators');
      if (savedCollabs) {
        const collabs = JSON.parse(savedCollabs);
        collabs.forEach((c: any) => {
          if (c.status === 'Active' && c.email) {
            grantedEmails.push(c.email.toLowerCase().trim());
          }
        });
      }
    } catch (e) {
      // fallback
    }
  }

  if (grantedEmails.includes(currentEmail)) return true;

  try {
    const docRef = doc(db, 'admins', uid);
    const snap = await getDoc(docRef);
    return snap.exists();
  } catch (err) {
    return false;
  }
}

export async function searchUserByEmail(email: string): Promise<UserProgress | null> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where("email", "==", email));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return { ...data, userId: querySnapshot.docs[0].id } as UserProgress;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'users');
    return null;
  }
}

export async function updateUserCredits(userId: string, newCredits: number, newPoints: number) {
  const docRef = doc(db, 'users', userId);
  try {
    await updateDoc(docRef, {
      credits: newCredits,
      points: newPoints,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
  }
}

export async function getAllUsers(): Promise<UserProgress[]> {
  const usersRef = collection(db, 'users');
  try {
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map(d => ({ ...d.data(), userId: d.id })) as UserProgress[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'users');
    return [];
  }
}

// --- Study Room Realtime Database Functions ---

/**
 * Ensures there is an active Firebase Auth user so rules evaluate isSignedIn() == true.
 * If user is not yet logged in, signs in anonymously without friction.
 */
export async function ensureAuthUser(): Promise<User> {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (err) {
    console.warn("Anonymous sign-in unavailable or restricted, fallback to current session:", err);
    // Create an ephemeral fallback user object
    return {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      displayName: 'Tanzanian Scholar',
      isAnonymous: true,
    } as any;
  }
}

/**
 * Realtime listener for study tips and NECTA traps filtered by subject.
 * Automatically pushes live updates via onSnapshot whenever any student posts or likes.
 */
export function subscribeToStudyTips(
  subjectId: string,
  onUpdate: (tips: StudyRoomMessage[]) => void,
  onError?: (err: any) => void
): () => void {
  const tipsRef = collection(db, 'study_tips');
  
  // Realtime query
  let q = query(tipsRef, orderBy('createdAt', 'desc'), limit(150));
  if (subjectId && subjectId !== 'ALL') {
    q = query(tipsRef, where('subjectId', '==', subjectId), orderBy('createdAt', 'desc'), limit(100));
  }

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items: StudyRoomMessage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          subjectId: data.subjectId || 'general',
          subjectName: data.subjectName || 'General Studies',
          gradeLevel: data.gradeLevel || 'Secondary',
          authorName: data.authorName || 'Anonymous Student',
          authorId: data.authorId || '',
          authorRole: data.authorRole || 'Candidate',
          type: data.type || 'tip',
          title: data.title || '',
          content: data.content || '',
          likes: typeof data.likes === 'number' ? data.likes : 0,
          likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
          createdAt: data.createdAt || new Date().toISOString(),
          isNectaTrap: Boolean(data.isNectaTrap || data.type === 'trap'),
          topicRef: data.topicRef || ''
        });
      });
      onUpdate(items);
    },
    (error) => {
      console.error("Study room realtime listener error:", error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Post a new study tip, formula, or NECTA trap into the shared Study Room in real-time.
 */
export async function postStudyTip(
  tipData: Omit<StudyRoomMessage, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'authorId'> & { authorId?: string }
): Promise<string> {
  const user = await ensureAuthUser();
  const tipsRef = collection(db, 'study_tips');
  const newDocRef = doc(tipsRef);
  const docId = newDocRef.id;

  const payload = {
    id: docId,
    subjectId: tipData.subjectId,
    subjectName: tipData.subjectName,
    gradeLevel: tipData.gradeLevel || 'Secondary',
    authorName: tipData.authorName || user.displayName || 'Tanzanian Scholar',
    authorId: tipData.authorId || user.uid,
    authorRole: tipData.authorRole || 'Candidate',
    type: tipData.type,
    title: tipData.title || '',
    content: tipData.content.trim(),
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
    isNectaTrap: tipData.type === 'trap' || Boolean(tipData.isNectaTrap),
    topicRef: tipData.topicRef || ''
  };

  try {
    await setDoc(newDocRef, payload);
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `study_tips/${docId}`);
    throw error;
  }
}

/**
 * Toggle upvote/helpful reaction on a study tip in real-time.
 */
export async function toggleLikeStudyTip(tipId: string): Promise<boolean> {
  const user = await ensureAuthUser();
  const docRef = doc(db, 'study_tips', tipId);

  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) return false;
    const data = snap.data();
    const likedBy: string[] = Array.isArray(data.likedBy) ? data.likedBy : [];
    const alreadyLiked = likedBy.includes(user.uid);

    if (alreadyLiked) {
      await updateDoc(docRef, {
        likes: Math.max(0, (data.likes || 1) - 1),
        likedBy: arrayRemove(user.uid)
      });
      return false;
    } else {
      await updateDoc(docRef, {
        likes: (data.likes || 0) + 1,
        likedBy: arrayUnion(user.uid)
      });
      return true;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `study_tips/${tipId}`);
    return false;
  }
}

/**
 * Delete a study tip (allowed for author or admin).
 */
export async function deleteStudyTip(tipId: string): Promise<void> {
  const docRef = doc(db, 'study_tips', tipId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `study_tips/${tipId}`);
    throw error;
  }
}

testConnection();
