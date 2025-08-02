import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Plus, Minus, DollarSign, Target, Trash2, Edit } from 'lucide-react';

// --- Dados de Exemplo (em Português) ---
const initialTransactions = [
  { id: 1, type: 'income', category: 'Salário', amount: 4500, date: '2025-07-01', description: 'Salário Mensal' },
  { id: 2, type: 'expense', category: 'Moradia', amount: 1200, date: '2025-07-01', description: 'Aluguel' },
  { id: 3, type: 'expense', category: 'Alimentação', amount: 450, date: '2025-07-05', description: 'Compras de Supermercado' },
  { id: 4, type: 'expense', category: 'Transporte', amount: 150, date: '2025-07-07', description: 'Gasolina e Transporte Público' },
  { id: 5, type: 'expense', category: 'Lazer', amount: 80, date: '2025-07-12', description: 'Cinema' },
  { id: 6, type: 'income', category: 'Freelance', amount: 750, date: '2025-07-15', description: 'Projeto de Web Design' },
  { id: 7, type: 'expense', category: 'Contas', amount: 120, date: '2025-07-18', description: 'Eletricidade e Internet' },
  { id: 8, type: 'expense', category: 'Saúde', amount: 60, date: '2025-07-22', description: 'Farmácia' },
];

const initialSavingsGoals = [
  { id: 1, name: 'Viagem dos Sonhos para Neo-Tokyo', targetAmount: 5000, currentAmount: 1200 },
  { id: 2, name: 'Upgrade Cibernético', targetAmount: 2500, currentAmount: 800 },
];

// --- Paleta de Cores ---
const COLORS = {
  primary: '#00f6ff', // Neon Ciano
  secondary: '#ff00ff', // Neon Magenta
  accent: '#faff00', // Neon Amarelo
  background: '#0a0a1a', // Azul Espaço Profundo
  card: 'rgba(13, 12, 34, 0.6)', // Azul escuro semi-transparente
  text: '#e0e0e0',
  textSecondary: '#a0a0c0',
  border: 'rgba(0, 246, 255, 0.2)',
  glow: 'rgba(0, 246, 255, 0.1)',
};

const PIE_CHART_COLORS = ['#00f6ff', '#ff00ff', '#faff00', '#00ff8f', '#ff5733', '#8a2be2', '#33ff57'];

// --- Componente Principal do App ---
export default function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [savingsGoals, setSavingsGoals] = useState(initialSavingsGoals);
  const [activeView, setActiveView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const financialSummary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance };
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const categoryMap = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = 0;
        }
        categoryMap[t.category] += t.amount;
      });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const handleSaveTransaction = (transactionData) => {
    if (transactionData.id) {
      // Edit existing
      setTransactions(transactions.map(t => t.id === transactionData.id ? transactionData : t));
    } else {
      // Add new
      setTransactions(prev => [...prev, { ...transactionData, id: Date.now() }]);
    }
    closeModal();
  };

  const handleSaveGoal = (goalData) => {
    if (goalData.id) {
        // Edit existing
        setSavingsGoals(goals => goals.map(g => g.id === goalData.id ? {...g, ...goalData} : g));
    } else {
        // Add new
        setSavingsGoals(prev => [...prev, { ...goalData, id: Date.now(), currentAmount: 0 }]);
    }
    closeModal();
  };
  
  const handleDeleteTransaction = (id) => {
      setTransactions(transactions.filter(t => t.id !== id));
  }

  const handleDeleteGoal = (id) => {
      setSavingsGoals(savingsGoals.filter(g => g.id !== id));
  }

  const openModal = (type, item = null) => {
    setModalContent(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setModalContent(null);
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView summary={financialSummary} expenseData={expenseByCategory} goals={savingsGoals} />;
      case 'transactions':
        return <TransactionsView transactions={transactions} onDelete={handleDeleteTransaction} onEdit={(item) => openModal('transaction', item)} />;
      case 'goals':
        return <GoalsView goals={savingsGoals} onDelete={handleDeleteGoal} onEdit={(item) => openModal('goal', item)} />;
      default:
        return <DashboardView summary={financialSummary} expenseData={expenseByCategory} goals={savingsGoals} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans" style={{ backgroundColor: COLORS.background, color: COLORS.text }}>
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative z-10 flex flex-col md:flex-row">
        <Sidebar activeView={activeView} setActiveView={setActiveView} openModal={openModal} />
        <main className="flex-1 p-4 md:p-8">
          {renderView()}
        </main>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          {modalContent === 'transaction' && <TransactionForm onSubmit={handleSaveTransaction} initialData={editingItem} />}
          {modalContent === 'goal' && <GoalForm onSubmit={handleSaveGoal} initialData={editingItem} />}
        </Modal>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .glass-card {
          background: ${COLORS.card};
          backdrop-filter: blur(10px);
          border: 1px solid ${COLORS.border};
          box-shadow: 0 0 20px ${COLORS.glow};
        }
        .btn-primary {
          background-color: ${COLORS.primary};
          color: ${COLORS.background};
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px ${COLORS.primary}, 0 0 20px ${COLORS.primary} inset;
        }
        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px ${COLORS.primary}, 0 0 30px ${COLORS.primary} inset;
        }
        .btn-secondary {
          background-color: ${COLORS.secondary};
          color: ${COLORS.background};
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px ${COLORS.secondary}, 0 0 20px ${COLORS.secondary} inset;
        }
        .btn-secondary:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px ${COLORS.secondary}, 0 0 30px ${COLORS.secondary} inset;
        }
        .nav-link {
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }
        .nav-link.active, .nav-link:hover {
          background: ${COLORS.glow};
          color: ${COLORS.primary};
          border-left-color: ${COLORS.primary};
        }
      `}</style>
    </div>
  );
}

// --- Componentes ---

function Sidebar({ activeView, setActiveView, openModal }) {
  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: <BarChart className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transações', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'goals', label: 'Metas', icon: <Target className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-full md:w-64 p-4 md:p-6 md:min-h-screen" style={{ background: `rgba(13, 12, 34, 0.3)` }}>
      <h1 className="text-2xl font-bold mb-8 text-center" style={{ color: COLORS.primary }}>PubliFinance</h1>
      <nav className="flex md:flex-col gap-2">
        {navItems.map(item => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveView(item.id); }}
            className={`flex-1 md:flex-none flex items-center gap-3 p-3 rounded-lg nav-link ${activeView === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span className="hidden md:inline">{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="mt-8 flex flex-col gap-4">
        <button onClick={() => openModal('transaction')} className="w-full py-3 px-4 rounded-lg btn-primary flex items-center justify-center gap-2">
          <Plus size={20} /> Nova Transação
        </button>
        <button onClick={() => openModal('goal')} className="w-full py-3 px-4 rounded-lg btn-secondary flex items-center justify-center gap-2">
          <Target size={20} /> Nova Meta
        </button>
      </div>
    </aside>
  );
}

function DashboardView({ summary, expenseData, goals }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Saldo Total" value={summary.balance} icon={<DollarSign />} color={COLORS.primary} />
        <StatCard title="Receita Total" value={summary.totalIncome} icon={<Plus />} color="#00ff8f" />
        <StatCard title="Despesa Total" value={summary.totalExpense} icon={<Minus />} color={COLORS.secondary} />
      </div>

      <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.primary }}>Gastos por Categoria</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={expenseData}>
                    <XAxis dataKey="name" stroke={COLORS.textSecondary} />
                    <YAxis stroke={COLORS.textSecondary} tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value)} />
                    <Tooltip contentStyle={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                    <Legend />
                    <Bar dataKey="value" name="Despesas" fill={COLORS.primary} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Divisão de Despesas</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} formatter={(value, name) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), name]}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-3 glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.accent }}>Metas de Poupança</h2>
        <div className="space-y-4">
          {goals.map(goal => <GoalTracker key={goal.id} goal={goal} />)}
        </div>
      </div>
    </div>
  );
}

function TransactionsView({ transactions, onDelete, onEdit }) {
  return (
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.primary }}>Todas as Transações</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b" style={{ borderColor: COLORS.border }}>
              <th className="p-3">Data</th>
              <th className="p-3">Descrição</th>
              <th className="p-3">Categoria</th>
              <th className="p-3 text-right">Valor</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => (
              <tr key={t.id} className="border-b border-opacity-50" style={{ borderColor: COLORS.border }}>
                <td className="p-3 text-sm text-gray-400">{new Date(t.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td className="p-3 font-semibold">{t.description}</td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: COLORS.glow, color: COLORS.primary}}>{t.category}</span>
                </td>
                <td className={`p-3 text-right font-mono ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="p-3 text-center flex justify-center items-center gap-2">
                    <button onClick={() => onEdit(t)} className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-full transition-colors">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(t.id)} className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                        <Trash2 size={16} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GoalsView({ goals, onDelete, onEdit }) {
  return (
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.primary }}>Metas de Poupança</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
           <div key={goal.id} className="p-4 rounded-lg border flex flex-col justify-between" style={{ borderColor: COLORS.border, background: `rgba(13, 12, 34, 0.5)` }}>
             <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.accent }}>{goal.name}</h3>
                    <div className="flex items-center gap-1">
                       <button onClick={() => onEdit(goal)} className="p-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-full transition-colors">
                           <Edit size={16} />
                       </button>
                       <button onClick={() => onDelete(goal.id)} className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                           <Trash2 size={16} />
                       </button>
                    </div>
                </div>
                <GoalTracker goal={goal} />
             </div>
           </div>
        ))}
      </div>
    </div>
  );
}


function StatCard({ title, value, icon, color }) {
  return (
    <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
      <div className="p-3 rounded-full" style={{ background: `linear-gradient(145deg, ${color}20, ${color}40)` }}>
        <div style={{ color: color }}>{icon}</div>
      </div>
      <div>
        <h3 className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>{title}</h3>
        <p className="text-2xl font-bold font-mono" style={{ color: color }}>{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      </div>
    </div>
  );
}

function GoalTracker({ goal }) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-semibold">{goal.name}</span>
        <span className="text-sm font-mono" style={{ color: COLORS.textSecondary }}>
          {goal.currentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / <span style={{ color: COLORS.accent }}>{goal.targetAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5" style={{ background: COLORS.glow }}>
        <div
          className="h-2.5 rounded-full"
          style={{ width: `${progress}%`, backgroundColor: COLORS.accent, boxShadow: `0 0 8px ${COLORS.accent}` }}
        ></div>
      </div>
    </div>
  );
}

function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="glass-card rounded-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
        {children}
      </div>
    </div>
  );
}

function TransactionForm({ onSubmit, initialData }) {
  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setDescription(initialData.description);
      setAmount(String(initialData.amount));
      setCategory(initialData.category);
      setDate(initialData.date);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    onSubmit({ 
        ...initialData,
        type, 
        description, 
        amount: parseFloat(amount), 
        category, 
        date 
    });
  };

  const expenseCategories = ['Alimentação', 'Moradia', 'Transporte', 'Contas', 'Lazer', 'Saúde', 'Compras', 'Outros'];
  const incomeCategories = ['Salário', 'Freelance', 'Bônus', 'Presente', 'Outros'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center" style={{ color: COLORS.primary }}>
        {isEditing ? 'Editar Transação' : 'Nova Transação'}
      </h2>
      <div className="flex gap-4">
        <button type="button" onClick={() => setType('expense')} className={`flex-1 p-3 rounded-lg font-semibold transition-all ${type === 'expense' ? 'btn-secondary' : 'bg-gray-700'}`}>Despesa</button>
        <button type="button" onClick={() => setType('income')} className={`flex-1 p-3 rounded-lg font-semibold transition-all ${type === 'income' ? 'btn-primary' : 'bg-gray-700'}`}>Receita</button>
      </div>
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500" required />
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Valor" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500" required />
      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500">
        {(type === 'expense' ? expenseCategories : incomeCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500" />
      <button type="submit" className="w-full p-4 rounded-lg font-bold btn-primary">
        {isEditing ? 'Salvar Alterações' : 'Adicionar Transação'}
      </button>
    </form>
  );
}

function GoalForm({ onSubmit, initialData }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
        setName(initialData.name);
        setTargetAmount(String(initialData.targetAmount));
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !targetAmount) return;
    onSubmit({ 
        ...initialData,
        name, 
        targetAmount: parseFloat(targetAmount) 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center" style={{ color: COLORS.secondary }}>
        {isEditing ? 'Editar Meta' : 'Nova Meta de Poupança'}
      </h2>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome da Meta (ex: Novo Headset VR)" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-pink-500" required />
      <input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="Valor Alvo" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-pink-500" required />
      <button type="submit" className="w-full p-4 rounded-lg font-bold btn-secondary">
        {isEditing ? 'Salvar Alterações' : 'Definir Meta'}
      </button>
    </form>
  );
}
