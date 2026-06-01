import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, query, where, doc, updateDoc } from '../firebase.mock';

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

const defaultCategories = ['Groceries', 'Dining', 'Transportation', 'Entertainment', 'Utilities', 'Other'];

export const BudgetProvider = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  
  const [activeAccount, setActiveAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({}); // { CategoryName: { limit: number, id: string } }
  const [customCategories, setCustomCategories] = useState([]);
  const [loans, setLoans] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    if (currentUser && userProfile) {
      initializeAccount();
    } else {
      setActiveAccount(null);
      setTransactions([]);
      setBudgets({});
      setCustomCategories([]);
      setLoans([]);
      setGroceries([]);
      setChatMessages([]);
    }
  }, [currentUser, userProfile]);

  const initializeAccount = async () => {
    setLoading(true);
    try {
      // Find account where owner is me, OR my username is in sharedWith
      let account = null;
      const qOwner = query(collection(db, 'accounts'), where('ownerId', '==', currentUser.uid));
      const resOwner = await getDocs(qOwner);
      if (resOwner.docs.length > 0) {
        account = { id: resOwner.docs[0].id, ...resOwner.docs[0].data() };
      } else {
        const qShared = query(collection(db, 'accounts'), where('sharedWith', 'array-contains', userProfile.username));
        const resShared = await getDocs(qShared);
        if (resShared.docs.length > 0) {
          account = { id: resShared.docs[0].id, ...resShared.docs[0].data() };
        }
      }

      if (account) {
        setActiveAccount(account);
        await fetchData(account.id);
      }
    } catch (e) {
      console.error("Error initializing account:", e);
    }
    setLoading(false);
  };

  const fetchData = async (accountId) => {
    // Fetch Transactions
    const qT = query(collection(db, 'transactions'), where('accountId', '==', accountId));
    const tSnap = await getDocs(qT);
    const trans = tSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    trans.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTransactions(trans);

    // Fetch Budgets
    const qB = query(collection(db, 'budgets'), where('accountId', '==', accountId));
    const bSnap = await getDocs(qB);
    const bData = {};
    bSnap.docs.forEach(doc => {
      const d = doc.data();
      bData[d.category] = { limit: d.limit, id: doc.id };
    });
    setBudgets(bData);

    // Fetch Custom Categories
    const qC = query(collection(db, 'categories'), where('accountId', '==', accountId));
    const cSnap = await getDocs(qC);
    setCustomCategories(cSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Fetch Loans
    const qL = query(collection(db, 'loans'), where('accountId', '==', accountId));
    const lSnap = await getDocs(qL);
    setLoans(lSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Fetch Groceries
    const qG = query(collection(db, 'groceries'), where('accountId', '==', accountId));
    const gSnap = await getDocs(qG);
    const grocs = gSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    grocs.sort((a, b) => new Date(a.date) - new Date(b.date));
    setGroceries(grocs);

    // Fetch Messages
    const qMsg = query(collection(db, 'messages'), where('accountId', '==', accountId));
    const msgSnap = await getDocs(qMsg);
    const msgs = msgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    msgs.sort((a, b) => new Date(a.date) - new Date(b.date));
    setChatMessages(msgs);
  };

  const addTransaction = async (transaction) => {
    if (!activeAccount) return;
    const newDoc = { ...transaction, accountId: activeAccount.id, addedBy: userProfile.username };
    const docRef = await addDoc(collection(db, 'transactions'), newDoc);
    setTransactions([{ id: docRef.id, ...newDoc }, ...transactions]);
    
    // Notification
    if (Notification.permission === 'granted') {
      new Notification('Expense Added', { body: `Added $${transaction.amount} for ${transaction.title}` });
    }
  };

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, 'transactions', id));
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addCategory = async (name) => {
    if (!activeAccount) return;
    const newDoc = { name, accountId: activeAccount.id };
    const docRef = await addDoc(collection(db, 'categories'), newDoc);
    setCustomCategories([...customCategories, { id: docRef.id, ...newDoc }]);
  };

  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, 'categories', id));
    setCustomCategories(customCategories.filter(c => c.id !== id));
  };

  const setBudgetLimit = async (category, limit) => {
    if (!activeAccount) return;
    if (budgets[category]) {
      await updateDoc(doc(db, 'budgets', budgets[category].id), { limit });
      setBudgets(prev => ({ ...prev, [category]: { ...prev[category], limit } }));
    } else {
      const docRef = await addDoc(collection(db, 'budgets'), { accountId: activeAccount.id, category, limit });
      setBudgets(prev => ({ ...prev, [category]: { limit, id: docRef.id } }));
    }
  };

  const deleteBudgetLimit = async (category) => {
    if (budgets[category]) {
      await deleteDoc(doc(db, 'budgets', budgets[category].id));
      const newBudgets = { ...budgets };
      delete newBudgets[category];
      setBudgets(newBudgets);
    }
  };

  const addLoan = async (loan) => {
    if (!activeAccount) return;
    const docRef = await addDoc(collection(db, 'loans'), { ...loan, accountId: activeAccount.id });
    setLoans([...loans, { id: docRef.id, ...loan, accountId: activeAccount.id }]);
  };

  const updateLoan = async (id, data) => {
    await updateDoc(doc(db, 'loans', id), data);
    setLoans(loans.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const shareAccount = async (username) => {
    if (activeAccount && activeAccount.ownerId === currentUser.uid) {
      const newShared = [...activeAccount.sharedWith, username];
      await updateDoc(doc(db, 'accounts', activeAccount.id), { sharedWith: newShared });
      setActiveAccount({ ...activeAccount, sharedWith: newShared });
    }
  };

  const addGroceryItem = async (title) => {
    if (!activeAccount) return;
    const newDoc = { title, completed: false, accountId: activeAccount.id, addedBy: userProfile.username, date: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'groceries'), newDoc);
    setGroceries(prev => [...prev, { id: docRef.id, ...newDoc }]);
  };

  const toggleGroceryItem = async (id, completed) => {
    await updateDoc(doc(db, 'groceries', id), { completed });
    setGroceries(prev => prev.map(g => g.id === id ? { ...g, completed } : g));
  };

  const deleteGroceryItem = async (id) => {
    await deleteDoc(doc(db, 'groceries', id));
    setGroceries(prev => prev.filter(g => g.id !== id));
  };

  const sendChatMessage = async (text) => {
    if (!activeAccount) return;
    const newDoc = { text, accountId: activeAccount.id, sender: userProfile.username, date: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'messages'), newDoc);
    setChatMessages(prev => [...prev, { id: docRef.id, ...newDoc }]);
  };

  const allCategories = [...defaultCategories, ...customCategories.map(c => c.name)];

  const value = {
    activeAccount,
    transactions,
    budgets,
    loans,
    customCategories,
    categories: allCategories,
    groceries,
    chatMessages,
    loading,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    setBudgetLimit,
    deleteBudgetLimit,
    addLoan,
    updateLoan,
    shareAccount,
    addGroceryItem,
    toggleGroceryItem,
    deleteGroceryItem,
    sendChatMessage
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};
