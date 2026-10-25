import { useEffect, useState } from 'react';
import './Carousel.css';

const cards = [
    {
        icon: './Timer.svg',
        text: 'Высокая и оперативная скорость обработки заявки',
    },
    {
        icon: './Magnifier.svg',
        text: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос',
    },
    {
        icon: './Shield.svg',
        text: 'Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству',
    },
    {
        icon: './Timer.svg',
        text: 'Высокая и оперативная скорость обработки заявки',
    },
    {
        icon: './Magnifier.svg',
        text: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос',
    },
    {
        icon: './Shield.svg',
        text: 'Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству',
    },
];

const SLIDE_WIDTH = 400;
const GAP = 30;
const VISIBLE_SLIDES = 3;

const MOBILE_SLIDE_WIDTH = 298;
const MOBILE_GAP = 25;

export default function Carousel() {
    const [position, setPosition] = useState(0);

    const [isMobile, setIsMobile] = useState(
        window.matchMedia('(max-width: 375px)').matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 375px)');

        const handleResize = (event) => {
            setIsMobile(event.matches);
            setPosition(0);
        };

        mediaQuery.addEventListener('change', handleResize);

        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, []);

    const step = SLIDE_WIDTH + GAP;
    const mobileStep = MOBILE_SLIDE_WIDTH + MOBILE_GAP;

    const maxPosition = -(cards.length - VISIBLE_SLIDES) * step;
    const mobileMaxPosition = cards.length - 1;

    const goPrev = () => {
        if (isMobile) {
            setPosition((prev) =>
                prev === 0 ? mobileMaxPosition : prev - 1
            );
            return;
        }

        setPosition((prev) =>
            prev === 0 ? maxPosition : prev + step
        );
    };

    const goNext = () => {
        if (isMobile) {
            setPosition((prev) =>
                prev === mobileMaxPosition ? 0 : prev + 1
            );
            return;
        }

        setPosition((prev) =>
            prev === maxPosition ? 0 : prev - step
        );
    };

    const trackTransform = isMobile
        ? `translateX(-${position * mobileStep}px)`
        : `translateX(${position}px)`;

    return (
        <section className="main-carousel">
            <div className="main-carousel-container">
                <button
                    type="button"
                    className="main-carousel-btn--prev"
                    aria-label="Предыдущая карточка"
                    onClick={goPrev}
                >
                    <img src="./Arrow_left.svg" alt="" />
                </button>

                <div className="main-carousel-viewport">
                    <div
                        className="main-carousel-track"
                        style={{ transform: trackTransform }}
                    >
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className="main-carousel-slide"
                            >
                                <article className="main-carousel-card">
                                    <img src={card.icon} alt="" />
                                    <span>{card.text}</span>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    className="main-carousel-btn--next"
                    aria-label="Следующая карточка"
                    onClick={goNext}
                >
                    <img src="./Arrow_right.svg" alt="" />
                </button>
            </div>
        </section>
    );
}