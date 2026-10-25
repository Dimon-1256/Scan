import './Tariffs.css';

const tariffs = [
    {
        id: 'beginner',
        name: 'Beginner',
        description: 'Для небольшого исследования',
        icon: '/Beginner.svg',
        price: '799 ₽',
        oldPrice: '1 200 ₽',
        installment: 'или 150 ₽/мес. при рассрочке на 24 мес.',
        features: [
            'Безлимитная история запросов',
            'Безопасная сделка',
            'Поддержка 24/7',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        description: 'Для HR и фрилансеров',
        icon: '/Darts.svg',
        price: '1 299 ₽',
        oldPrice: '2 600 ₽',
        installment: 'или 279 ₽/мес. при рассрочке на 24 мес.',
        features: [
            'Все пункты тарифа Beginner',
            'Экспорт истории',
            'Рекомендации по приоритетам',
        ],
    },
    {
        id: 'business',
        name: 'Business',
        description: 'Для корпоративных клиентов',
        icon: '/Laptop.svg',
        price: '2 379 ₽',
        oldPrice: '3 700 ₽',
        features: [
            'Все пункты тарифа Pro',
            'Безлимитное количество запросов',
            'Приоритетная поддержка',
        ],
    },
];

export default function Tariffs({
    isAuthenticated = false,
    currentTariffId = null,
}) {
        return (
        <section className="rates">
            <div className="rates__illustration">
                <img src="/Main-svg.svg" alt="" />
            </div>

            <h2 className="rates__title">Наши тарифы</h2>

            <div className="rates__cards">
                {tariffs.map((tariff) => {
                    const isCurrent =
                    isAuthenticated &&
                    currentTariffId !== null &&
                    tariff.id === currentTariffId;

                    return (
                        <article
                        key={tariff.id}
                        className={`rates__card rates__card--${tariff.id} ${
                        isCurrent ? 'rates__card--current' : ''
                        }`}
                        >
                            <div className="rates__card-header">
                                <div>
                                <h3 className="rates__card-title">{tariff.name}</h3>
                                <p className="rates__card-description">
                                    {tariff.description}
                                </p>
                                </div>

                            <img
                            className="rates__card-icon"
                src={tariff.icon}
                alt=""
                            />
                            </div>

                        {isCurrent && (
                            <span className="rates__current-badge">
                                Текущий тариф
                            </span>
                        )}

                        <div className="rates__price">
                            <span className="rates__current-price">
                                {tariff.price}
                            </span>

                            <span className="rates__old-price">
                                {tariff.oldPrice}
                            </span>

                            {tariff.installment && (
                                <p className="rates__installment">
                                    {tariff.installment}
                                </p>
                            )}
                        </div>

                        <div className="rates__features">
                            <p className="rates__features-title">В тариф входит:</p>

                            <ul className="rates__features-list">
                                {tariff.features.map((feature) => (
                                <li key={feature} className="rates__feature">
                                    <img src="/Check.svg" alt="" />
                                    <span>{feature}</span>
                                </li>
                                ))}
                            </ul>
                        </div>

                        <button type="button" className="rates__button">
                            {isCurrent ? 'Перейти в личный кабинет' : 'Подробнее'}
                        </button>
                        </article>
                    );
                })}
            </div>
        </section>
  );
}