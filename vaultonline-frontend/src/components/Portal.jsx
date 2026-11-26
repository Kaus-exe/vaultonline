import React, { useEffect, useState } from 'react';
import { authFetch, getToken, loginUser, logoutUser } from '../api/authRepository';
import './Portal.css';

const money = value => Number(value || 0).toLocaleString('ru-RU') + ' ₸';

export default function Portal({ onBack }) {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [login, setLogin] = useState(true);
  const [form, setForm] = useState({ phone: '', password: '', name: '', email: '' });
  const [data, setData] = useState({ account: null, transactions: [], users: [], stats: null });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [transfer, setTransfer] = useState({ recipientPhone: '', amount: '', description: '' });
  const [userSearch, setUserSearch] = useState('');
  const [transactionType, setTransactionType] = useState('ALL');
  const [transactionStatus, setTransactionStatus] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const request = async (url, options) => {
    const response = await authFetch(url, options);
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || 'Не удалось выполнить запрос');
    return body;
  };

  const load = async current => {
    try {
      if (current.role === 'ADMIN') {
        const [users, transactions, stats] = await Promise.all([
          request('/admin/users'), request('/admin/transactions'), request('/admin/stats')
        ]);
        setData({ users, transactions, stats, account: null });
      } else {
        const [account, transactions] = await Promise.all([
          request('/account'), request('/transactions')
        ]);
        setData({ account, transactions, users: [], stats: null });
      }
    } catch (e) { setMessage(e.message); }
  };

  useEffect(() => {
    if (!getToken()) return;
    request('/auth/me').then(current => { setUser(current); load(current); }).catch(() => logoutUser());
  }, []);

  const submitAuth = async e => {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      let current;
      if (login) current = await loginUser(form.phone, form.password);
      else {
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Ошибка регистрации');
        localStorage.setItem('vault_jwt_token', result.token);
        current = result.user;
      }
      setUser(current); await load(current);
    } catch (e) { setMessage(e.message); }
    finally { setBusy(false); }
  };

  const sendTransfer = async e => {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      await request('/transfers', { method: 'POST', body: JSON.stringify({
        recipientPhone: transfer.recipientPhone, amount: Number(transfer.amount), description: transfer.description
      }) });
      setMessage('Перевод успешно выполнен'); setTransfer({ recipientPhone: '', amount: '', description: '' });
      await load(user);
    } catch (e) { setMessage(e.message); }
    finally { setBusy(false); }
  };

  const toggleBlock = async id => {
    try { await request('/admin/users/' + id + '/block', { method: 'PATCH' }); await load(user); }
    catch (e) { setMessage(e.message); }
  };

  const signOut = () => { logoutUser(); setUser(null); setData({ account: null, transactions: [], users: [], stats: null }); setPage('home'); };

  if (!user) return <div className="portal-shell"><div className="portal-auth">
    <button className="portal-back" onClick={onBack}>← На главную</button>
    <div className="portal-brand">VaultOnline</div><h1>{login ? 'Вход в аккаунт' : 'Создать аккаунт'}</h1>
    <p>Управляйте своими финансами в одном месте</p>
    <form onSubmit={submitAuth}>
      {!login && <input placeholder="Ваше имя" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />}
      {!login && <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />}
      <input placeholder="Номер телефона" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} required />
      <input placeholder="Пароль" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required minLength="6" />
      <button className="portal-primary" disabled={busy}>{busy ? 'Подождите...' : login ? 'Войти' : 'Зарегистрироваться'}</button>
    </form>
    {message && <div className="portal-message">{message}</div>}
    <button className="portal-switch" onClick={() => { setLogin(!login); setMessage(''); }}>{login ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}</button>
  </div></div>;

  const admin = user.role === 'ADMIN';
  const filteredUsers = (data.users || []).filter(u => `${u.name || ''} ${u.phone || ''}`.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredTransactions = (data.transactions || []).filter(t => {
    const date = t.createdAt ? new Date(t.createdAt) : null;
    const day = date ? date.toISOString().slice(0, 10) : '';
    return (transactionType === 'ALL' || t.type === transactionType) &&
      (transactionStatus === 'ALL' || (t.status || 'COMPLETED') === transactionStatus) &&
      (!dateFrom || day >= dateFrom) && (!dateTo || day <= dateTo);
  });
  const nav = admin ? [['home','Обзор'],['users','Пользователи'],['history','Все операции'],['profile','Профиль']] : [['home','Обзор'],['transfer','Перевод'],['history','История операций'],['profile','Профиль']];

  return <div className="portal-layout">
    <aside className="portal-sidebar">
      <div className="portal-brand">VaultOnline</div><div className="portal-label">{admin ? 'ПАНЕЛЬ АДМИНИСТРАТОРА' : 'ЛИЧНЫЙ КАБИНЕТ'}</div>
      {nav.map(([key,label]) => <button key={key} className={page===key?'selected':''} onClick={()=>{setPage(key);setMessage('');}}>{label}</button>)}
      <button className="portal-exit" onClick={signOut}>Выйти</button>
      <button className="portal-home" onClick={onBack}>На главную</button>
    </aside>
    <main className="portal-main">
      <header className="portal-top"><div><span>VaultOnline / </span>{nav.find(n=>n[0]===page)?.[1]}</div><div className="portal-user">{user.name} <small>{admin?'Администратор':'Клиент'}</small></div></header>
      {message && <div className="portal-message">{message}</div>}
      {page==='home' && <><h1>{admin?'Панель управления':'Добро пожаловать, '+user.name}</h1><p className="portal-muted">{admin?'Сводная информация по работе банка':'Ваши финансы и последние операции'}</p>
        {admin ? <div className="portal-stats"><article><span>Пользователи</span><b>{data.stats?.users ?? '—'}</b></article><article><span>Операции</span><b>{data.stats?.transactions ?? '—'}</b></article><article><span>Общий баланс</span><b>{money(data.stats?.balance)}</b></article></div>
        : <><section className="portal-balance"><span>Общий баланс</span><strong>{money(data.account?.balance)}</strong><small>Счёт •••• {String(data.account?.accountNumber || '0000').slice(-4)}</small></section><div className="portal-actions"><button onClick={()=>setPage('transfer')}>Перевести деньги</button><button onClick={()=>setPage('history')}>История операций</button></div></>}
        <h2>Последние операции</h2><Transactions rows={(data.transactions||[]).slice(0,5)} />
      </>}
      {page==='transfer' && <><h1>Перевод денег</h1><p className="portal-muted">Перевод другому клиенту VaultOnline по номеру телефона</p><form className="portal-form" onSubmit={sendTransfer}><label>Телефон получателя<input value={transfer.recipientPhone} onChange={e=>setTransfer({...transfer,recipientPhone:e.target.value})} required placeholder="+7 700 000 00 00" /></label><label>Сумма, ₸<input type="number" min="1" step="1" value={transfer.amount} onChange={e=>setTransfer({...transfer,amount:e.target.value})} required /></label><label>Комментарий<input value={transfer.description} onChange={e=>setTransfer({...transfer,description:e.target.value})} placeholder="Например, за обед" /></label><button className="portal-primary" disabled={busy}>Отправить перевод</button></form></>}
      {page==='history' && <><h1>{admin?'Все операции':'История операций'}</h1><div className="portal-filters"><select value={transactionType} onChange={e=>setTransactionType(e.target.value)}><option value="ALL">Все типы</option><option value="IN">Пополнение</option><option value="OUT">Перевод</option></select><select value={transactionStatus} onChange={e=>setTransactionStatus(e.target.value)}><option value="ALL">Все статусы</option><option value="COMPLETED">Выполнено</option><option value="PENDING">В обработке</option><option value="FAILED">Отклонено</option></select><label>С даты<input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} /></label><label>По дату<input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} /></label><button className="portal-small" onClick={()=>{setTransactionType('ALL');setTransactionStatus('ALL');setDateFrom('');setDateTo('');}}>Сбросить</button></div><Transactions rows={filteredTransactions} /></>}
      {page==='users' && <><h1>Пользователи</h1><input className="portal-search" placeholder="Поиск по имени или телефону" value={userSearch} onChange={e=>setUserSearch(e.target.value)} /><div className="portal-table-wrap"><table><thead><tr><th>Имя</th><th>Телефон</th><th>Роль</th><th>Баланс</th><th>Статус</th><th></th></tr></thead><tbody>{filteredUsers.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.phone}</td><td>{u.role}</td><td>{money(u.balance)}</td><td>{u.blocked?'Заблокирован':'Активен'}</td><td><button className="portal-small" onClick={()=>toggleBlock(u.id)}>{u.blocked?'Разблокировать':'Заблокировать'}</button></td></tr>)}</tbody></table></div></>}
      {page==='profile' && <><h1>Профиль</h1><div className="portal-profile"><p><span>Имя</span><b>{user.name}</b></p><p><span>Телефон</span><b>{user.phone}</b></p><p><span>Email</span><b>{user.email||'Не указан'}</b></p><p><span>Тип аккаунта</span><b>{admin?'Администратор':'Пользователь'}</b></p></div></>}
    </main>
  </div>;
}

function Transactions({ rows }) {
  return <div className="portal-table-wrap"><table><thead><tr><th>Дата</th><th>Операция</th><th>Описание</th><th>Сумма</th><th>Статус</th></tr></thead><tbody>
    {rows.map(t=><tr key={t.id}><td>{t.createdAt?new Date(t.createdAt).toLocaleString('ru-RU'):'—'}</td><td>{t.type==='IN'?'Пополнение':t.type==='OUT'?'Перевод':'Операция'}</td><td>{t.description||'—'}</td><td className={t.type==='IN'?'positive':'negative'}>{t.type==='IN'?'+':'−'}{money(t.amount)}</td><td>{t.status||'Выполнено'}</td></tr>)}
    {!rows.length && <tr><td colSpan="5">Операций пока нет</td></tr>}
  </tbody></table></div>;
}
