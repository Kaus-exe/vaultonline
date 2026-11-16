import React, { useState } from 'react';
import './App.css';

export default function App() {
  // Состояние калькулятора
  const [calcTab, setCalcTab] = useState('deposit'); // 'deposit' | 'loan'

  // Депозит
  const [depositType, setDepositType] = useState('Чемпион (в приложении VaultOnline)');
  const [currency, setCurrency] = useState('KZT');
  const [depositAmount, setDepositAmount] = useState(100000);
  const [monthlyTopUp, setMonthlyTopUp] = useState(10000);
  const [depositTerm, setDepositTerm] = useState(6);

  // Кредит
  const [loanType, setLoanType] = useState('Обычные условия');
  const [repaymentMethod, setRepaymentMethod] = useState('Аннуитет');
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTerm, setLoanTerm] = useState(12);

  // Расчёт депозита
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

  // Расчёт кредита
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

  return (
    <div className="page">
      {/* Шапка */}
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            <span className="logo-dot"></span>
            <span>VaultOnline</span>
          </div>
          <nav className="nav">
            <a href="#products">Карты и счета</a>
            <a href="#rates">Курсы валют</a>
            <a href="#calculator">Калькулятор</a>
            <a href="#promo">Акции</a>
          </nav>
          <button className="btn-login">Войти в банк</button>
        </div>
      </header>

      <main className="container">
        {/* Hero-блок + нижняя плашка как на прототипе */}
        <section className="hero-wrapper">
          <div className="hero-banner">
            <div className="hero-content">
              <span className="badge">Онлайн-банкинг нового поколения</span>
              <h1>Управляйте финансами без очередей и комиссий</h1>
              <p>
                Открывайте депозиты под 14,2% ГЭСВ, переводите валюту по выгодному курсу и
                оформляйте кредиты за 2 минуты.
              </p>
              <div className="hero-actions">
                <button className="btn-primary">Открыть карту</button>
                <button className="btn-secondary">Подробнее</button>
              </div>
            </div>
          </div>
          <div className="hero-bottom-bar">
            <span>Кэшбэк до 15% на любимые категории</span>
            <span>•</span>
            <span>Бесплатные переводы внутри VaultOnline</span>
            <span>•</span>
            <span>Поддержка 24/7</span>
          </div>
        </section>

        {/* 4 карточки продуктов */}
        <section id="products" className="products-grid">
          <div className="product-card">
            <div className="product-icon">💳</div>
            <h3>Карта Vault Black</h3>
            <p>Кэшбэк до 15% и бесплатное обслуживание навсегда</p>
            <span className="product-link">Оформить →</span>
          </div>
          <div className="product-card">
            <div className="product-icon">📈</div>
            <h3>Депозит Чемпион</h3>
            <p>Ставка до 15,16% ГЭСВ с пополнением без ограничений</p>
            <span className="product-link">Открыть →</span>
          </div>
          <div className="product-card">
            <div className="product-icon">💸</div>
            <h3>Кредит наличными</h3>
            <p>До 7 000 000 ₸ без залога и справок онлайн</p>
            <span className="product-link">Рассчитать →</span>
          </div>
          <div className="product-card">
            <div className="product-icon">🌍</div>
            <h3>Мультивалютный счёт</h3>
            <p>KZT, USD, EUR и RUB в одном приложении</p>
            <span className="product-link">Подключить →</span>
          </div>
        </section>

        {/* Блок 1: Курсы валют (по референсу) */}
        <section id="rates" className="section-block">
          <h2 className="section-title">Курсы валют</h2>
          <div className="rates-grid">
            {/* Левая карточка: в отделении */}
            <div className="rate-card">
              <h3>Наличные валюты в отделении</h3>
              <p className="rate-date">Курс на 15.11.2026</p>
              <table className="rate-table">
                <thead>
                  <tr>
                    <th>Валюта</th>
                    <th>Сумма</th>
                    <th>Продать</th>
                    <th>Купить</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>USD / KZT</strong>
                      <span>Доллар США / Тенге</span>
                    </td>
                    <td>
                      <div>до 10 000</div>
                      <div>от 10 000</div>
                    </td>
                    <td>
                      <div>495,00</div>
                      <div>496,00</div>
                    </td>
                    <td>
                      <div>499,00</div>
                      <div>498,50</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>EUR / KZT</strong>
                      <span>Евро / Тенге</span>
                    </td>
                    <td>
                      <div>до 10 000</div>
                      <div>от 10 000</div>
                    </td>
                    <td>
                      <div>527,50</div>
                      <div>528,00</div>
                    </td>
                    <td>
                      <div>532,50</div>
                      <div>532,00</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>RUB / KZT</strong>
                      <span>Российский рубль / Тенге</span>
                    </td>
                    <td>
                      <div>до 1 млн</div>
                      <div>от 1 млн</div>
                    </td>
                    <td>
                      <div>4,87</div>
                      <div>4,91</div>
                    </td>
                    <td>
                      <div>5,05</div>
                      <div>5,02</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Правая карточка: в приложении */}
            <div className="rate-card">
              <h3>Курсы приложения VaultOnline</h3>
              <p className="rate-date">Курс на 15.11.2026</p>
              <table className="rate-table">
                <thead>
                  <tr>
                    <th>Валюта</th>
                    <th>Продать</th>
                    <th>Купить</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>USD / KZT</strong>
                      <span>Доллар США / Тенге</span>
                    </td>
                    <td>496,50</td>
                    <td>498,20</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>EUR / KZT</strong>
                      <span>Евро / Тенге</span>
                    </td>
                    <td>528,70</td>
                    <td>531,20</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>RUB / KZT</strong>
                      <span>Российский рубль / Тенге</span>
                    </td>
                    <td>4,92</td>
                    <td>5,00</td>
                  </tr>
                </tbody>
              </table>
              <p className="rate-hint">
                Загрузите приложение VaultOnline и обменивайте валюту по выгодному курсу
              </p>
            </div>
          </div>
          <div className="center-action">
            <button className="btn-green">Посмотреть все курсы</button>
          </div>
        </section>

        {/* Блок 2: Калькулятор (Депозиты / Кредит наличными) */}
        <section id="calculator" className="section-block">
          <h2 className="section-title">Рассчитайте выгоду</h2>

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
              Кредит наличными
            </button>
          </div>

          {calcTab === 'deposit' ? (
            <div className="calc-card">
              <div className="calc-controls">
                <div className="control-group">
                  <label>Выбор депозита</label>
                  <select
                    value={depositType}
                    onChange={(e) => setDepositType(e.target.value)}
                  >
                    <option>Чемпион (в приложении VaultOnline)</option>
                    <option>Рахмет (сберегательный)</option>
                    <option>Стандартный</option>
                  </select>
                </div>

                <div className="control-group">
                  <label>Валюта</label>
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
                  <label>Сумма депозита</label>
                  <div className="range-box">
                    <span>
                      {Number(depositAmount).toLocaleString('ru-RU')} {currencySymbol}
                    </span>
                    <input
                      type="range"
                      min="1000"
                      max="10000000"
                      step="1000"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>
                  <div className="range-labels">
                    <span>1 тыс.</span>
                    <span>5 млн.</span>
                    <span>10 млн.</span>
                  </div>
                </div>

                <div className="control-group">
                  <label>Сумма ежемесячного взноса</label>
                  <div className="range-box">
                    <span>
                      {Number(monthlyTopUp).toLocaleString('ru-RU')} {currencySymbol}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="5000"
                      value={monthlyTopUp}
                      onChange={(e) => setMonthlyTopUp(e.target.value)}
                    />
                  </div>
                  <div className="range-labels">
                    <span>0</span>
                    <span>500 тыс.</span>
                    <span>1 млн.</span>
                  </div>
                </div>

                <div className="control-group">
                  <label>Срок</label>
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
                <h3>Наше предложение</h3>
                <div className="result-row-top">
                  <div>
                    <span>Ставка депозита</span>
                    <strong>{rate.toFixed(2).replace('.', ',')} %</strong>
                  </div>
                  <div>
                    <span>ГЭСВ</span>
                    <strong>{gesv.replace('.', ',')} %</strong>
                  </div>
                </div>
                <div className="result-main">
                  <span>Сумма в конце срока</span>
                  <div className="big-number">
                    {finalDepositSum.toLocaleString('ru-RU')} {currencySymbol}
                  </div>
                </div>
                <div className="result-sub">
                  <span>Из них вознаграждение</span>
                  <div className="green-number">
                    +{reward.toLocaleString('ru-RU')} {currencySymbol}
                  </div>
                </div>
                <button className="btn-green full-width">Подробнее</button>
              </div>
            </div>
          ) : (
            <div className="calc-card">
              <div className="calc-controls">
                <div className="control-group">
                  <label>Тип кредита</label>
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
                  <label>Способ погашения</label>
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
                  <label>Сумма кредита</label>
                  <div className="range-box">
                    <span>{Number(loanAmount).toLocaleString('ru-RU')} ₸</span>
                    <input
                      type="range"
                      min="50000"
                      max="7000000"
                      step="10000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </div>
                  <div className="range-labels">
                    <span>50 тыс.</span>
                    <span>3,5 млн.</span>
                    <span>7 млн.</span>
                  </div>
                </div>

                <div className="control-group">
                  <label>Срок кредита</label>
                  <div className="range-box">
                    <span>{loanTerm} мес.</span>
                    <input
                      type="range"
                      min="6"
                      max="60"
                      step="6"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                    />
                  </div>
                  <div className="range-labels">
                    <span>6 мес.</span>
                    <span>36 мес.</span>
                    <span>60 мес.</span>
                  </div>
                </div>
              </div>

              <div className="calc-result">
                <h3>Результаты расчёта</h3>
                <div className="result-main">
                  <span>Ежемесячный платёж</span>
                  <div className="big-number">
                    {monthlyPayment.toLocaleString('ru-RU')} ₸
                  </div>
                </div>
                <div className="result-sub">
                  <span>Ставка: {loanRate}% годовых</span>
                  <div className="schedule-link">📅 График платежей</div>
                </div>
                <div className="result-actions">
                  <button className="btn-green">Оформить онлайн</button>
                  <button className="btn-outline">Подробнее</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Нижний большой информационный блок с прототипа */}
        <section id="promo" className="promo-block">
          <div className="promo-text">
            <h2>Мобильный банк VaultOnline всегда под рукой</h2>
            <p>
              Оплачивайте коммунальные услуги без комиссии, отслеживайте аналитику расходов и
              выпускайте виртуальные карты для безопасных покупок в интернете.
            </p>
            <div className="promo-features">
              <div>✓ Мгновенные переводы по номеру телефона</div>
              <div>✓ Биометрическая защита и Face ID</div>
              <div>✓ Выписки и справки в PDF за один клик</div>
            </div>
          </div>
          <div className="promo-card-preview">
            <div className="mock-bank-card">
              <div className="mock-card-top">
                <span>VaultOnline</span>
                <span>WORLD</span>
              </div>
              <div className="mock-card-balance">1 450 200,00 ₸</div>
              <div className="mock-card-bottom">
                <span>•••• 4829</span>
                <span>11/29</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© 2026 VaultOnline Bank. Все права защищены.</span>
          <span>Лицензия АРРФР РК № 1.2.345/67</span>
        </div>
      </footer>
    </div>
  );
}