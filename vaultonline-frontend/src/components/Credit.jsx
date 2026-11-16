import React, { useState } from 'react';
import { api } from '../api/axios';

export default function Credit() {
  const [calcTab, setCalcTab] = useState('deposit');
  const [depCurrency, setDepCurrency] = useState('KZT');
  const [depAmount, setDepAmount] = useState(1000);
  const [depTerm, setDepTerm] = useState('6');

  const [creditAmount, setCreditAmount] = useState(60000);
  const [creditMonths, setCreditMonths] = useState(12);
  const [creditRate] = useState(14.5);
  const [creditResult, setCreditResult] = useState(null);

  const handleCalculateCredit = async () => {
    try {
      const res = await api.get('/credit/calculate', {
        params: { amount: creditAmount, months: creditMonths, rate: creditRate }
      });
      setCreditResult(res.data);
    } catch (e) {
      alert('Ошибка при вызове бэкенда! Убедитесь, что Spring Boot запущен на порту 8080.');
    }
  };

  return (
    <div className="page-container">
      <section className="card-box margin-bottom">
        <h2 className="section-title text-center">Курсы валют</h2>
        <div className="grid-2">
          <div className="currency-card">
            <h3>Наличные валюты в отделении</h3>
            <table className="currency-table">
              <thead>
                <tr>
                  <th>Валюта</th>
                  <th>Продать</th>
                  <th>Купить</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><strong>USD / KZT</strong></td><td>456.00</td><td>460.00</td></tr>
                <tr><td><strong>EUR / KZT</strong></td><td>527.50</td><td>532.50</td></tr>
                <tr><td><strong>RUB / KZT</strong></td><td>4.37</td><td>5.15</td></tr>
              </tbody>
            </table>
          </div>

          <div className="currency-card">
            <h3>Курсы приложения vault.online</h3>
            <table className="currency-table">
              <thead>
                <tr>
                  <th>Валюта</th>
                  <th>Продать</th>
                  <th>Купить</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><strong>USD / KZT</strong></td><td>455.50</td><td>459.00</td></tr>
                <tr><td><strong>EUR / KZT</strong></td><td>526.70</td><td>531.00</td></tr>
                <tr><td><strong>RUB / KZT</strong></td><td>4.40</td><td>5.10</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="card-box">
        <h2 className="section-title text-center">Рассчитайте выгоду</h2>
        
        <div className="top-tab-switcher">
          <button 
            className={`top-tab-btn ${calcTab === 'deposit' ? 'active' : ''}`}
            onClick={() => setCalcTab('deposit')}
          >
            Депозиты
          </button>
          <button 
            className={`top-tab-btn ${calcTab === 'credit' ? 'active' : ''}`}
            onClick={() => setCalcTab('credit')}
          >
            Кредит наличными
          </button>
        </div>

        {calcTab === 'deposit' && (
          <div className="grid-2 margin-top">
            <div className="calc-form">
              <div className="form-group">
                <label>Валюта:</label>
                <div className="pill-group">
                  {['KZT', 'USD', 'EUR', 'RUB'].map((curr) => (
                    <button
                      key={curr}
                      className={`pill ${depCurrency === curr ? 'active' : ''}`}
                      onClick={() => setDepCurrency(curr)}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Сумма депозита: {Number(depAmount).toLocaleString()} {depCurrency}</label>
                <input 
                  type="range" min="1000" max="10000000" step="10000"
                  value={depAmount} onChange={(e) => setDepAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Срок:</label>
                <div className="pill-group">
                  {['6', '12', '24'].map((term) => (
                    <button
                      key={term}
                      className={`pill ${depTerm === term ? 'active' : ''}`}
                      onClick={() => setDepTerm(term)}
                    >
                      {term} мес.
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="calc-result-card border-green">
              <h3>Наше предложение</h3>
              <div className="grid-2 margin-top">
                <div>
                  <span className="text-sub">Ставка</span>
                  <div className="big-stat text-green">14,20 %</div>
                </div>
                <div>
                  <span className="text-sub">ГЭСВ</span>
                  <div className="big-stat">15,16 %</div>
                </div>
              </div>
              <div className="margin-top">
                <span className="text-sub">Сумма в конце срока</span>
                <div className="price-title">
                  {(depAmount * 1.142).toLocaleString(undefined, {maximumFractionDigits: 0})} {depCurrency}
                </div>
              </div>
              <button className="btn btn-success full-width margin-top" onClick={() => alert('Депозит оформлен!')}>
                Подробнее
              </button>
            </div>
          </div>
        )}

        {calcTab === 'credit' && (
          <div className="grid-2 margin-top">
            <div className="calc-form">
              <div className="form-group">
                <label>Сумма кредита: {Number(creditAmount).toLocaleString()} ₸</label>
                <input 
                  type="range" min="10000" max="5000000" step="50000"
                  value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Срок: {creditMonths} мес.</label>
                <input 
                  type="range" min="3" max="60" step="3"
                  value={creditMonths} onChange={(e) => setCreditMonths(e.target.value)}
                />
              </div>

              <button className="btn btn-primary full-width margin-top" onClick={handleCalculateCredit}>
                Рассчитать через бэкенд
              </button>
            </div>

            <div className="calc-result-card">
              <h3>Результаты расчёта</h3>
              {creditResult ? (
                <div className="margin-top">
                  <span className="text-sub">Ежемесячный платёж</span>
                  <div className="price-title">{creditResult.monthlyPayment} ₸</div>
                  <button className="btn btn-success full-width margin-top" onClick={() => alert('Заявка отправлена!')}>
                    Оформить онлайн
                  </button>
                </div>
              ) : (
                <div className="margin-top">
                  <p className="text-sub">Нажмите кнопку «Рассчитать», чтобы получить данные с сервера.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}