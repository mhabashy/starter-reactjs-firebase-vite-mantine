import create from 'zustand';
import { getFirestore, getDoc, doc, updateDoc, Timestamp, setDoc } from "firebase/firestore";
import { firebaseApp } from '../config';
import { UserStatus } from '../models/user.models';

export const userStore = create((set) => ({
    displayName: localStorage.getItem('displayName'),
    accessToken: localStorage.getItem('accessToken'),
    uid: localStorage.getItem('uid'),
    photoUrl: localStorage.getItem('photoUrl'),
    email: localStorage.getItem('email'),
    isLoading: false,
    setSignUser: async (displayName: string, accessToken: string, uid: string, photoUrl: string, email: string) => {
        set((state) => ({
            ...state,
            accessToken,
            uid,
            photoUrl,
            email
        }));
        
        if (displayName) {
            set((state) => ({
                ...state,
                displayName
            }));
            localStorage.setItem('displayName', displayName);
        }
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('uid', uid);
        if (photoUrl) {
            localStorage.setItem('photoUrl', photoUrl);
        } else {
            localStorage.removeItem('photoUrl');
        }
        localStorage.setItem('email', email);
        const db = getFirestore(firebaseApp);
        const payload: any = {
            uid,
            photoUrl,
            email
        };
        const docRef = await getDoc(doc(db, "users", uid));
        if (docRef.exists()) { 
            localStorage.setItem('displayName', docRef.data().displayName);
            set((state) => ({
                ...state,
                displayName: docRef.data().displayName
            }));
            await updateDoc(docRef.ref, {
                ...payload,
                'updatedAt': Timestamp.now()
            });
        } else {
            await setDoc(doc(db, "users", uid), {
                ...payload,
                'displayName': displayName,
                'createdAt': Timestamp.now(),
                'updatedAt': Timestamp.now(),
                'status': UserStatus.TRIAL
            });
        }

        set((state) => ({
            ...state,
            isLoading: false
        }));

        return {
            'displayName': displayName || localStorage.getItem('displayName'),
        }
        
    },
    signOutUser: async () => {
        set((state) => ({
            ...state,
            displayName: null,
            accessToken: null,
            uid: null,
            photoUrl: null,
            email: null,
            isLoading: false
        }));
        localStorage.removeItem('displayName');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('uid');
        localStorage.removeItem('photoUrl');
        localStorage.removeItem('email');
    },
    setIsLoading: (isLoading: boolean) => set((state) => ({ ...state, isLoading })),
}));