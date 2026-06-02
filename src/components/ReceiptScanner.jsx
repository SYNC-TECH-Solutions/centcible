import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle, Edit3, Key, Settings, AlertCircle } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

const USELESS_KEYWORDS = ['candy', 'toy', 'game', 'coffee', 'snack', 'beer', 'liquor', 'lottery'];

export default function ReceiptScanner() {
  const { addTransaction, categories, activeAccount } = useBudget();
  const [loading, setLoading] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);
  
  // Manual Fallback State
  const [showManual, setShowManual] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mAmount, setMAmount] = useState('');
  const [mCategory, setMCategory] = useState(categories[0]);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', apiKey.trim());
    alert('Gemini API Key saved successfully!');
    setShowKeyConfig(false);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    alert('Gemini API Key removed. Using local Tesseract OCR mode.');
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setLoading(true);
    setShowManual(false);
    setErrorMsg('');
    setScannedItems([]);

    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      try {
        const base64Data = await fileToBase64(file);
        const mimeType = file.type || 'image/jpeg';
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${savedKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert receipt parsing AI for the "Vaultr" expense tracker app. Analyze this receipt image. 
Extract the list of items purchased and their corresponding prices. 
Determine if any item is a non-essential, impulsive, or "useless" spend (such as sugary snacks, junk food, alcohol, tobacco, video games, toys, coffee shop purchases, dining out on a whim). Mark those with isUseless: true, others as false.
Map each item to one of these categories: Groceries, Dining, Transportation, Entertainment, Utilities, Other, Useless.

Return a JSON array of objects representing the receipt items. Do not wrap the JSON output in markdown code blocks like \`\`\`json. Return only the raw JSON.
Each object must have:
- title: string (the name of the item)
- amount: number (the price)
- category: string (one of: Groceries, Dining, Transportation, Entertainment, Utilities, Other, Useless)
- isUseless: boolean (true if it represents an impulsive or non-essential spend)

Example format:
[
  {"title": "Organic Bananas", "amount": 2.50, "category": "Groceries", "isUseless": false},
  {"title": "Caramel Macchiato", "amount": 5.75, "category": "Useless", "isUseless": true}
]`
                  },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        });

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const jsonText = data.candidates[0].content.parts[0].text;
        const parsedItems = JSON.parse(jsonText.trim());
        
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          const itemsWithIds = parsedItems.map(item => ({
            ...item,
            id: Math.random().toString()
          }));
          setScannedItems(itemsWithIds);
        } else {
          throw new Error("No items detected in response.");
        }
      } catch (err) {
        console.error("Gemini scanning failed:", err);
        setErrorMsg("Gemini API call failed. Falling back to local OCR...");
        await runTesseractFallback(file);
      }
    } else {
      await runTesseractFallback(file);
    }
    setLoading(false);
  };

  const runTesseractFallback = async (file) => {
    try {
      const result = await Tesseract.recognize(file, 'eng', { logger: m => console.log(m) });
      processText(result.data.text);
    } catch (err) {
      console.error(err);
      setShowManual(true);
    }
  };

  const processText = (text) => {
    const lines = text.split('\n');
    const items = [];
    const priceRegex = /[\$£€]?\s*(\d+[\.,]\d{2})/;
    const totalRegex = /(total|amount due|balance due|subtotal)/i;

    let receiptTotal = null;

    lines.forEach(line => {
      let cleanLine = line.trim().replace(/O/g, '0');
      const priceMatch = cleanLine.match(priceRegex);
      if (priceMatch) {
        const rawPriceStr = priceMatch[1].replace(',', '.');
        const amount = parseFloat(rawPriceStr);
        let title = cleanLine.replace(priceMatch[0], '').trim();
        title = title.replace(/[^a-zA-Z0-9\s]/g, '').trim();

        if (title.length > 2 && amount > 0) {
          if (totalRegex.test(title)) {
             receiptTotal = { title: "Receipt Total", amount, category: 'Other', isUseless: false };
          } else {
             const isUseless = USELESS_KEYWORDS.some(kw => title.toLowerCase().includes(kw));
             items.push({ id: Math.random().toString(), title, amount, category: isUseless ? 'Useless' : 'Other', isUseless });
          }
        }
      }
    });

    if (receiptTotal) {
       items.unshift({ ...receiptTotal, id: 'TOTAL_LINE' });
    }

    if (items.length === 0) {
      setShowManual(true);
    } else {
      setScannedItems(items);
    }
  };

  const handleSaveItem = (item) => {
    addTransaction({ title: item.title, amount: item.amount, category: item.category, date: new Date().toISOString() });
    setScannedItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleManualSave = (e) => {
    e.preventDefault();
    if (!mTitle || !mAmount) return;
    addTransaction({ title: mTitle, amount: Number(mAmount), category: mCategory, date: new Date().toISOString() });
    setMTitle(''); setMAmount('');
    setShowManual(false);
    setImagePreview(null);
  };

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Scan Receipt</h1>
          <p style={{ color: 'var(--text-muted)' }}>Extract receipt items automatically using Gemini AI or Local OCR</p>
        </div>
        <button 
          className="btn-primary" 
          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', border: '1px solid var(--surface-border)' }}
          onClick={() => setShowKeyConfig(!showKeyConfig)}
        >
          <Settings size={20} /> AI Configuration
        </button>
      </header>

      {showKeyConfig && (
        <div className="glass-panel" style={{ marginBottom: '24px', animation: 'fadeIn 0.3s ease' }}>
          <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Key size={18} /> Gemini API Key Setup</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
            To use advanced receipt item scanning and saving tips, input your Gemini API Key. Keys are saved locally in your browser storage.
            Get a free key from the <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary-color)' }}>Google AI Studio</a>.
          </p>
          <form onSubmit={handleSaveApiKey} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input 
              type="password" 
              className="input-field" 
              style={{ flex: 1, minWidth: '250px' }} 
              placeholder="Paste your Gemini API Key here..." 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)} 
              required 
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary">Save Key</button>
              {localStorage.getItem('gemini_api_key') && (
                <button type="button" className="btn-primary" style={{ background: 'var(--accent-red)' }} onClick={handleClearApiKey}>Clear Key</button>
              )}
            </div>
          </form>
        </div>
      )}

      {errorMsg && (
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid var(--accent-orange)', marginBottom: '24px', padding: '16px' }}>
          <AlertCircle size={20} color="var(--accent-orange)" />
          <span style={{ fontSize: '0.9rem' }}>{errorMsg}</span>
        </div>
      )}

      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.85rem', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: apiKey ? 'var(--accent-green)' : 'var(--accent-orange)' }} />
        <span>
          {apiKey ? 'Mode: Gemini AI OCR Enabled (High Accuracy)' : 'Mode: Local OCR Mode (Lower Accuracy, configure Gemini API Key for best results)'}
        </span>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center' }}>
          {loading ? (
            <div style={{ color: 'var(--primary-color)' }}>
              <Loader2 size={48} className="animate-spin" />
              <p style={{ marginTop: '16px', fontWeight: '500' }}>Analyzing receipt items with AI...</p>
            </div>
          ) : (
            <>
              {imagePreview ? (
                <img src={imagePreview} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginBottom: '24px' }} />
              ) : (
                <Camera size={64} color="var(--surface-border)" style={{ marginBottom: '24px' }} />
              )}
              
              <input type="file" accept="image/*" capture="environment" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={() => fileInputRef.current.click()}>
                  <Upload size={20} /> Upload / Camera
                </button>
                {imagePreview && (
                  <button className="btn-primary" style={{ background: 'var(--surface-border)', color: 'var(--text-main)' }} onClick={() => setShowManual(true)}>
                    <Edit3 size={20} /> Manual Entry
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="glass-panel" style={{ overflowY: 'auto', maxHeight: '500px' }}>
          {showManual ? (
            <div>
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={20} /> Manual Fallback</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.875rem' }}>OCR couldn't find items or was skipped. Please enter the details manually.</p>
              <form onSubmit={handleManualSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Title/Store</label>
                  <input type="text" className="input-field" value={mTitle} onChange={e => setMTitle(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Total Amount</label>
                  <input type="number" step="0.01" className="input-field" value={mAmount} onChange={e => setMAmount(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Category</label>
                  <select className="input-field" value={mCategory} onChange={e => setMCategory(e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn-primary">Save Expense</button>
              </form>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: '16px' }}>Detected Items</h3>
              {scannedItems.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Scan a receipt image using the upload/camera button on the left to see itemized expenses.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {scannedItems.map(item => (
                    <div key={item.id} style={{ 
                      padding: '16px', borderRadius: '8px', 
                      background: item.isUseless ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      border: item.isUseless ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <h4 style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.title} {item.isUseless && <AlertTriangle size={16} color="var(--accent-red)" title="AI flagged this as non-essential / useless!" />}
                        </h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          Category: {item.category} • ${Number(item.amount).toFixed(2)}
                        </p>
                      </div>
                      <button className="btn-primary" style={{ padding: '8px 16px', background: 'var(--accent-green)' }} onClick={() => handleSaveItem(item)}>
                        <CheckCircle size={18} /> Save
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
}
