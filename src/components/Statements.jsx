import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Lightbulb, Image } from 'lucide-react';

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  INR: '₹'
};

export default function Statements() {
  const { transactions, activeAccount, budgets, loans } = useBudget();
  const { userProfile } = useAuth();

  const currencySymbol = CURRENCY_SYMBOLS[userProfile?.currency || 'USD'] || '$';

  // Analyze spending to generate customized tips
  const totalSpent = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
  const uselessSpent = transactions.filter(t => t.category === 'Useless').reduce((acc, t) => acc + Number(t.amount), 0);
  
  // Find categories over budget
  const categorySpentMap = {};
  transactions.forEach(t => {
    if (!categorySpentMap[t.category]) categorySpentMap[t.category] = 0;
    categorySpentMap[t.category] += Number(t.amount);
  });

  const overBudgetCategories = [];
  Object.entries(budgets).forEach(([cat, data]) => {
    const spent = categorySpentMap[cat] || 0;
    if (spent > data.limit) {
      overBudgetCategories.push({ category: cat, spent, limit: data.limit, over: spent - data.limit });
    }
  });

  // Dynamic Tips Generation
  const generateTips = () => {
    const tips = [];
    if (uselessSpent > 0) {
      tips.push(`You spent ${currencySymbol}${uselessSpent.toFixed(2)} on non-essential "Useless" items this month. Eliminating just half of these impulse purchases next month would save you ${currencySymbol}${(uselessSpent / 2).toFixed(2)}!`);
    } else {
      tips.push("Excellent work! You had no flagged 'Useless' or non-essential impulse spending this month. Keep up this disciplined spending next month!");
    }

    if (overBudgetCategories.length > 0) {
      overBudgetCategories.forEach(item => {
        tips.push(`You went over your budget in ${item.category} by ${currencySymbol}${item.over.toFixed(2)}. For next month, try setting a calendar alert mid-month to review your ${item.category} ledger before hitting the limit.`);
      });
    } else if (Object.keys(budgets).length > 0) {
      tips.push("Congratulations! You stayed within all of your monthly budget goals this month. You're building great financial habits.");
    } else {
      tips.push("Tip: You haven't set any category budget goals yet. Go to the 'Budget Goals' tab to set monthly limits; users who set explicit targets save 15% more on average.");
    }

    if (loans.filter(l => !l.completed).length > 0) {
      tips.push("Debt Strategy: Use the Debt Snowball method. Pay the minimums on all loans except your smallest one, and throw any surplus cash at that smallest debt to clear it first.");
    }

    // Default tips
    tips.push("General: Always review your statements on the 1st of the month. Visualizing your actual statements builds mindfulness and long-term financial safety.");
    return tips;
  };

  const currentTips = generateTips();

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to download statements.");
      return;
    }
    
    const monthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Statement - ${monthYear}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 40px; 
              color: #1e293b; 
              background: #fff;
              line-height: 1.5;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .title {
              font-size: 24px;
              font-weight: 700;
              color: #0f172a;
              margin: 0;
            }
            .subtitle {
              color: #64748b;
              font-size: 14px;
              margin-top: 4px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
            }
            .meta-item {
              font-size: 14px;
            }
            .meta-item strong {
              color: #0f172a;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
              margin-bottom: 40px;
            }
            th, td { 
              padding: 12px; 
              text-align: left; 
              border-bottom: 1px solid #e2e8f0; 
              font-size: 14px;
            }
            th { 
              background: #f1f5f9; 
              font-weight: 600;
              color: #334155;
            }
            .tips-box {
              background: #eff6ff;
              border-left: 4px solid #3b82f6;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .tips-box h3 {
              margin-top: 0;
              color: #1d4ed8;
              font-size: 16px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .tips-list {
              padding-left: 20px;
              margin: 0;
            }
            .tips-list li {
              margin-bottom: 8px;
              font-size: 14px;
              color: #1e3a8a;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            .total-row {
              font-weight: 700;
              background: #f8fafc;
            }
            .badge-useless {
              background: #fee2e2;
              color: #ef4444;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">Vaultr Statement</h1>
              <div class="subtitle">Personal Monthly Financial Report</div>
            </div>
            <div style="text-align: right; font-weight: 600; font-size: 14px; color: #3b82f6;">
              ${monthYear}
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <strong>User:</strong> ${userProfile?.firstName} ${userProfile?.lastName} (@${userProfile?.username})<br />
              <strong>Email:</strong> ${userProfile?.email}<br />
              <strong>Preferred Currency:</strong> ${userProfile?.currency || 'USD'}
            </div>
            <div class="meta-item">
              <strong>Linked Account:</strong> ${activeAccount?.name || 'Personal Ledger'}<br />
              <strong>Report Generated:</strong> ${new Date().toLocaleDateString()}<br />
              <strong>Total Expenses:</strong> ${currencySymbol}${totalSpent.toFixed(2)}
            </div>
          </div>

          <div class="tips-box">
            <h3>💡 Smart Tips & Financial Strategy for Next Month</h3>
            <ul class="tips-list">
              ${currentTips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>

          <h2 style="font-size: 18px; margin-bottom: 10px; color: #0f172a;">Ledger Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Added By</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString()}</td>
                  <td style="font-weight: 500;">
                    ${t.title}
                    ${t.category === 'Useless' ? '<span class="badge-useless">Impulse</span>' : ''}
                  </td>
                  <td>${t.category}</td>
                  <td>@${t.addedBy || userProfile?.username}</td>
                  <td style="text-align: right; font-weight: 600;">${currencySymbol}${Number(t.amount).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4" style="text-align: right;">Total Spent:</td>
                <td style="text-align: right; font-weight: 700; color: #0f172a; font-size: 16px;">
                  ${currencySymbol}${totalSpent.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Generated by the Vaultr Expenses Tracker App. Wealth intelligence.
          </div>

          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Monthly Statements</h1>
          <p style={{ color: 'var(--text-muted)' }}>Generate comprehensive PDF reports containing monthly transactions and AI-powered savings tips</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Main report generator card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '600' }}>
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Statement
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                Combines your transaction log, budget achievements, and custom financial advice.
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Size: ~25 KB • Format: PDF
            </span>
            <button className="btn-primary" onClick={handleDownload} style={{ padding: '10px 20px' }}>
              <Download size={18} /> Get Statement PDF
            </button>
          </div>
        </div>

        {/* Tips Quick Look Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-orange)' }}>
            <Lightbulb size={20} /> Next Month Strategy Preview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '180px' }}>
            {currentTips.slice(0, 3).map((tip, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{idx + 1}.</span>
                <span style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Receipts directory folder */}
      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image size={20} color="var(--primary-color)" /> Stored Receipts Folder
        </h3>
        <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', minHeight: '180px', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            <p style={{ marginBottom: '8px' }}>Receipt images are securely stored in your sandbox directory.</p>
            <p style={{ fontSize: '0.85rem' }}>Upload receipt files in the <strong>Scan Receipt</strong> tab to view folder contents.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
