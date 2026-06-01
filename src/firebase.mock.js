// Mock Firebase Configuration and API

// --- AUTH ---
let currentUser = null;
const authListeners = [];

export const getAuth = () => ({
  currentUser,
  onAuthStateChanged: (cb) => {
    authListeners.push(cb);
    setTimeout(() => cb(currentUser), 100);
    return () => {
      const idx = authListeners.indexOf(cb);
      if (idx > -1) authListeners.splice(idx, 1);
    };
  }
});

export const onAuthStateChanged = (auth, cb) => {
  return auth.onAuthStateChanged(cb);
};

export const signInWithEmailAndPassword = async (auth, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        currentUser = { uid: email, email }; // using email as uid for mock
        authListeners.forEach(cb => cb(currentUser));
        resolve({ user: currentUser });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export const createUserWithEmailAndPassword = async (auth, email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async (auth) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      authListeners.forEach(cb => cb(currentUser));
      resolve();
    }, 300);
  });
};

// --- FIRESTORE ---
export const getFirestore = () => ({});

export const collection = (db, path) => path;
export const doc = (db, path, id) => id ? `${path}/${id}` : path;
export const query = (col, ...args) => ({ col, args });
export const where = (field, op, val) => ({ field, op, val });

const readFromLocal = (path) => {
  try {
    const raw = localStorage.getItem(`mock_firebase_${path}`);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
};
const writeToLocal = (path, data) => {
  localStorage.setItem(`mock_firebase_${path}`, JSON.stringify(data));
};

export const getDocs = async (q) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const path = typeof q === 'string' ? q : q.col;
      let data = readFromLocal(path);
      if (q.args) {
        q.args.forEach(arg => {
          if (arg.field && arg.val !== undefined && arg.op === '==') {
            data = data.filter(d => d[arg.field] === arg.val);
          } else if (arg.field && arg.val && arg.op === 'array-contains') {
            data = data.filter(d => Array.isArray(d[arg.field]) && d[arg.field].includes(arg.val));
          }
        });
      }
      resolve({
        docs: data.map(d => ({ id: d.id, data: () => d }))
      });
    }, 200);
  });
};

export const getDoc = async (documentRef) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const parts = documentRef.split('/');
      const col = parts[0];
      const id = parts[1];
      const data = readFromLocal(col).find(d => d.id === id);
      resolve({
        exists: () => !!data,
        data: () => data,
        id
      });
    }, 200);
  });
};

export const addDoc = async (col, data) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const existing = readFromLocal(col);
      const id = Math.random().toString(36).substr(2, 9);
      const newItem = { ...data, id };
      existing.push(newItem);
      writeToLocal(col, existing);
      resolve({ id });
    }, 200);
  });
};

export const setDoc = async (documentRef, data, options = {}) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const parts = documentRef.split('/');
      const col = parts[0];
      const id = parts[1];
      let existing = readFromLocal(col);
      const idx = existing.findIndex(d => d.id === id);
      if (idx > -1) {
        if (options.merge) {
          existing[idx] = { ...existing[idx], ...data };
        } else {
          existing[idx] = { ...data, id };
        }
      } else {
        existing.push({ ...data, id });
      }
      writeToLocal(col, existing);
      resolve();
    }, 200);
  });
};

export const updateDoc = async (documentRef, data) => {
  return setDoc(documentRef, data, { merge: true });
};

export const deleteDoc = async (documentRef) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const parts = documentRef.split('/');
      if (parts.length === 2) {
        const col = parts[0];
        const id = parts[1];
        let existing = readFromLocal(col);
        existing = existing.filter(d => d.id !== id);
        writeToLocal(col, existing);
      }
      resolve();
    }, 200);
  });
};
