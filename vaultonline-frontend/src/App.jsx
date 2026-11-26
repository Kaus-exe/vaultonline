import React, { useState } from 'react';
import './App.css';
import Portal from './components/Portal';
import qrCodeImg from './assets/qr-code.png';

export default function App() {
  const [calcTab, setCalcTab] = useState('deposit');
  const [showPortal, setShowPortal] = useState(false);
  const [depositType, setDepositType] = useState('Чемпион (в приложении VaultOnline)');
  const [currency, setCurrency] = useState('KZT');
  const [depositAmount, setDepositAmount] = useState(250000);
  const [monthlyTopUp, setMonthlyTopUp] = useState(20000);
  const [depositTerm, setDepositTerm] = useState(12);

  const [loanType, setLoanType] = useState('Обычные условия');
  const [repaymentMethod, setRepaymentMethod] = useState('Аннуитет');
  const [loanAmount, setLoanAmount] = useState(1200000);
  const [loanTerm, setLoanTerm] = useState(24);

  // Модальное окно для интерактивности
  const [modalContent, setModalContent] = useState(null);
  const [cardForm, setCardForm] = useState({ name: '', phone: '' });
  const [cardSubmitted, setCardSubmitted] = useState(false);

  const getDepositRate = () => {
    if (currency === 'KZT') return 14.2;
    if (currency === 'USD' || currency === 'EUR') return 1.0;
    return 3.5;
  };

  const rate = getDepositRate();
  const gesv = (rate + 0.96).toFixed(2);
  const totalMonths = depositTerm;
  const totalInvested = Number(depositAmount) + Number(monthlyTopUp) * totalMonths;
  const reward = Math.round(totalInvested * (rate / 100) * (totalMonths / 12));
  const finalDepositSum = totalInvested + reward;

  const loanRate = loanType === 'Зарплатный проект' ? 18.5 : 21.0;
  const monthlyRate = loanRate / 100 / 12;
  const monthlyPayment =
    repaymentMethod === 'Аннуитет'
      ? Math.round(
          (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm))) /
            (Math.pow(1 + monthlyRate, loanTerm) - 1)
        )
      : Math.round(loanAmount / loanTerm + loanAmount * monthlyRate);

  const currencySymbol = { KZT: '₸', USD: '$', EUR: '€', RUB: '₽' }[currency];

  const handleActionClick = (title) => {
    setModalContent(title);
  };

  if (showPortal) return <Portal onBack={() => setShowPortal(false)} />;

  return (
    <div className="page">
      {/* Шапка */}
      <header className="header">
        <div className="container header-inner">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="logo-dot"></span>
            <span>VaultOnline</span>
          </div>
          <nav className="nav">
            <a href="#products">Продукты</a>
            <a href="#rates">Курсы</a>
            <a href="#calculator">Калькулятор</a>
            <a href="#promo">Приложение</a>
          </nav>
          <button className="btn-login" onClick={() => setShowPortal(true)}>
            Войти в банк
          </button>
        </div>
      </header>

      <main className="container">
        {/* Hero-блок */}
        <section className="hero-wrapper">
          <div className="hero-banner">
            <div className="hero-content">
              <span className="badge">Digital Banking Ecosystem</span>
              <h1>Финансы без границ, очередей и скрытых комиссий</h1>
              <p>
                Инновационная платформа для управления счетами, выгодных конвертаций и 
                мгновенных инвестиций в пару кликов.
              </p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => { setCardSubmitted(false); setCardForm({ name: '', phone: '' }); handleActionClick('Открытие карты Vault Black'); }}>
                  Заказать карту
                </button>
                <button className="btn-secondary" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  Узнать больше
                </button>
              </div>
            </div>
          </div>
          <div className="hero-bottom-bar">
            <span>⚡️ Мгновенный кэшбэк до 15%</span>
            <span>•</span>
            <span>🛡 Безопасность по стандарту PCI DSS</span>
            <span>•</span>
            <span>🌐 Мультивалютные счета 24/7</span>
          </div>
        </section>

        {/* Продукты */}
        <section id="products" className="products-grid">
          <div className="product-card" onClick={() => handleActionClick('Карта Vault Black')}>
            <div className="product-icon">💳</div>
            <h3>Vault Black</h3>
            <p>Премиальная карта с персональным дизайном и нулевой комиссией</p>
            <span className="product-link">Открыть счет →</span>
          </div>
          <div className="product-card" onClick={() => handleActionClick('Депозит Чемпион')}>
            <div className="product-icon">📈</div>
            <h3>Депозит «Чемпион»</h3>
            <p>Максимальная доходность до 15,16% ГЭСВ с ежемесячной выплатой</p>
            <span className="product-link">Рассчитать доход →</span>
          </div>
          <div className="product-card" onClick={() => handleActionClick('Кредит наличными')}>
            <div className="product-icon">💸</div>
            <h3>Кредитная линия</h3>
            <p>Одобрение за 60 секунд на любые цели без поручителей</p>
            <span className="product-link">Получить деньги →</span>
          </div>
          <div className="product-card" onClick={() => handleActionClick('Мультивалютный портфель')}>
            <div className="product-icon">🌍</div>
            <h3>Global Wallet</h3>
            <p>Храните тенге, доллары, евро и рубли с единого баланса</p>
            <span className="product-link">Подключить →</span>
          </div>
        </section>

        {/* Курсы валют */}
        <section id="rates" className="section-block">
          <h2 className="section-title">Актуальные курсы обмена</h2>
          <div className="rates-grid">
            <div className="rate-card">
              <h3>В отделениях банка</h3>
              <p className="rate-date">Обновлено сегодня в режиме реального времени</p>
              <table className="rate-table">
                <thead>
                  <tr>
                    <th>Валюта</th>
                    <th>Диапазон</th>
                    <th>Продажа</th>
                    <th>Покупка</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>USD / KZT</strong><span>Доллар США</span></td>
                    <td>до / от 10k</td>
                    <td>495,00</td>
                    <td>499,00</td>
                  </tr>
                  <tr>
                    <td><strong>EUR / KZT</strong><span>Евро</span></td>
                    <td>до / от 10k</td>
                    <td>527,50</td>
                    <td>532,50</td>
                  </tr>
                  <tr>
                    <td><strong>RUB / KZT</strong><span>Рубль</span></td>
                    <td>до / от 1 млн</td>
                    <td>4,87</td>
                    <td>5,05</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rate-card">
              <h3>В приложении VaultOnline</h3>
              <p className="rate-date">Специальный курс для цифровых клиентов</p>
              <table className="rate-table">
                <thead>
                  <tr>
                    <th>Валюта</th>
                    <th>Продажа</th>
                    <th>Покупка</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>USD / KZT</strong><span>Доллар США</span></td>
                    <td>496,50</td>
                    <td>498,20</td>
                  </tr>
                  <tr>
                    <td><strong>EUR / KZT</strong><span>Евро</span></td>
                    <td>528,70</td>
                    <td>531,20</td>
                  </tr>
                  <tr>
                    <td><strong>RUB / KZT</strong><span>Рубль</span></td>
                    <td>4,92</td>
                    <td>5,00</td>
                  </tr>
                </tbody>
              </table>
              <p className="rate-hint">💡 В приложении курс выгоднее на 1.5 тенге благодаря онлайн-конвертации</p>
            </div>
          </div>
        </section>

        {/* Калькулятор */}
        <section id="calculator" className="section-block">
          <h2 className="section-title">Интерактивный калькулятор</h2>

          <div className="calc-tabs">
            <button
              className={calcTab === 'deposit' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setCalcTab('deposit')}
            >
              Депозиты
            </button>
            <button
              className={calcTab === 'loan' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setCalcTab('loan')}
            >
              Кредиты
            </button>
          </div>

          {calcTab === 'deposit' ? (
            <div className="calc-card">
              <div className="calc-controls">
                <div className="control-group">
                  <label>Программа депозита</label>
                  <select value={depositType} onChange={(e) => setDepositType(e.target.value)}>
                    <option>Чемпион (в приложении VaultOnline)</option>
                    <option>Рахмет (сберегательный)</option>
                    <option>Стандартный накопительный</option>
                  </select>
                </div>

                <div className="control-group">
                  <label>Валюта вклада</label>
                  <div className="pill-group">
                    {['KZT', 'USD', 'EUR', 'RUB'].map((cur) => (
                      <button
                        key={cur}
                        className={currency === cur ? 'pill active' : 'pill'}
                        onClick={() => setCurrency(cur)}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <label>Начальная сумма: {Number(depositAmount).toLocaleString('ru-RU')} {currencySymbol}</label>
                  <input
                    type="range"
                    min="1000"
                    max="10000000"
                    step="5000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>Ежемесячное пополнение: {Number(monthlyTopUp).toLocaleString('ru-RU')} {currencySymbol}</label>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    value={monthlyTopUp}
                    onChange={(e) => setMonthlyTopUp(e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>Срок размещения</label>
                  <div className="pill-group">
                    {[6, 12, 24].map((m) => (
                      <button
                        key={m}
                        className={depositTerm === m ? 'pill active' : 'pill'}
                        onClick={() => setDepositTerm(m)}
                      >
                        {m} мес.
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="calc-result">
                <h3>Итоги расчета</h3>
                <div className="result-row-top">
                  <div>
                    <span>Ставка</span>
                    <strong>{rate.toFixed(2)}%</strong>
                  </div>
                  <div>
                    <span>ГЭСВ</span>
                    <strong>{gesv}%</strong>
                  </div>
                </div>
                <div className="result-main">
                  <span>Сумма к концу срока</span>
                  <div className="big-number">
                    {finalDepositSum.toLocaleString('ru-RU')} {currencySymbol}
                  </div>
                </div>
                <div className="result-sub">
                  <span>Чистая прибыль</span>
                  <div className="green-number">+{reward.toLocaleString('ru-RU')} {currencySymbol}</div>
                </div>
                <button className="btn-green full-width" onClick={() => handleActionClick('Оформление депозита')}>
                  Открыть депозит онлайн
                </button>
              </div>
            </div>
          ) : (
            <div className="calc-card">
              <div className="calc-controls">
                <div className="control-group">
                  <label>Условия кредитования</label>
                  <div className="pill-group">
                    {['Обычные условия', 'Зарплатный проект'].map((type) => (
                      <button
                        key={type}
                        className={loanType === type ? 'pill active' : 'pill'}
                        onClick={() => setLoanType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <label>График платежей</label>
                  <div className="pill-group">
                    {['Аннуитет', 'Дифференцированный'].map((method) => (
                      <button
                        key={method}
                        className={repaymentMethod === method ? 'pill active' : 'pill'}
                        onClick={() => setRepaymentMethod(method)}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <label>Сумма кредита: {Number(loanAmount).toLocaleString('ru-RU')} ₸</label>
                  <input
                    type="range"
                    min="50000"
                    max="7000000"
                    step="50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>Срок: {loanTerm} мес.</label>
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="6"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="calc-result">
                <h3>Параметры кредита</h3>
                <div className="result-main">
                  <span>Ежемесячный платеж</span>
                  <div className="big-number">{monthlyPayment.toLocaleString('ru-RU')} ₸</div>
                </div>
                <div className="result-sub">
                  <span>Процентная ставка: {loanRate}% годовых</span>
                </div>
                <button className="btn-green full-width" onClick={() => handleActionClick('Заявка на кредит')}>
                  Подать заявку за 2 минуты
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Промо приложения */}
      
        <section id="promo" className="promo-block">
          <div className="promo-text">
            <h2>Банк в вашем смартфоне</h2>
            <p>
              Управляйте личными финансами, оплачивайте счета по QR-коду и выпускайте виртуальные 
              карты с защитой нового поколения.
            </p>
            <div className="promo-features">
              <div>✓ Переводы по номеру телефона без комиссий</div>
              <div>✓ Продвинутая аналитика расходов с категориями</div>
              <div>✓ Официальные справки и выписки в один клик</div>
            </div>
          </div>

          <div className="promo-qr-container">
            <div className="qr-code-box">
              <img src={qrCodeImg} alt="QR Code App" />
            </div>
            <div className="qr-text">
              <h4>Скачайте приложение</h4>
              <p>Наведите камеру смартфона, чтобы установить VaultOnline для iOS и Android</p>
            </div>
          </div>
        </section>
      </main>

      {modalContent && (
        <div className="modal-overlay" onClick={() => setModalContent(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {modalContent === 'Открытие карты Vault Black' ? (
              <>
                <h3>Заказ карты Vault Black</h3>
                {cardSubmitted ? (
                  <>
                    <p>Заявка заполнена. Это демонстрационная форма: данные пока не отправляются в банковскую систему.</p>
                    <button className="btn-green" onClick={() => setModalContent(null)}>Закрыть</button>
                  </>
                ) : (
                  <form className="card-order-form" onSubmit={(e) => { e.preventDefault(); setCardSubmitted(true); }}>
                    <p className="modal-sub">Оставьте контактные данные, чтобы подготовить заявку.</p>
                    <input aria-label="ФИО" placeholder="ФИО" value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} required />
                    <input aria-label="Телефон" placeholder="Номер телефона" type="tel" value={cardForm.phone} onChange={(e) => setCardForm({ ...cardForm, phone: e.target.value })} required />
                    <button className="btn-green" type="submit">Подготовить заявку</button>
                    <button className="modal-cancel" type="button" onClick={() => setModalContent(null)}>Отмена</button>
                  </form>
                )}
              </>
            ) : (
              <>
                <h3>VaultOnline Core</h3>
                <p>Вы выбрали действие: <strong>{modalContent}</strong>.</p>
                <p className="modal-sub">Этот раздел пока представлен демонстрационным окном.</p>
                <button className="btn-green" onClick={() => setModalContent(null)}>Понятно</button>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container footer-inner">
          <span>© 2026 VaultOnline Bank. Все права защищены.</span>
          <span>Лицензия АРРФР РК № 1.2.345/67</span>
        </div>
      </footer>
    </div>
  );
}