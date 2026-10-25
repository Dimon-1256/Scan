import { useState } from 'react';
import './Calendar.css';

const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function Calendar({ onSelectDate }) {
    const today = new Date();

    const [calendarDate, setCalendarDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);

    let firstDayOfWeek = firstDay.getDay();

    if (firstDayOfWeek === 0) {
        firstDayOfWeek = 7;
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 1; i < firstDayOfWeek; i += 1) {
        days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        days.push(day);
    }

    const handlePreviousMonth = () => {
        setCalendarDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCalendarDate(new Date(year, month + 1, 1));
    };

    const handleSelectDate = (day) => {
        if (!day) {
            return;
        }

        const selectedDate = new Date(year, month, day);
        
        const formattedDate = [
            selectedDate.getFullYear(),
            String(selectedDate.getMonth() + 1).padStart(2, '0'),
            String(selectedDate.getDate()).padStart(2, '0'),
        ].join('-');
        
        onSelectDate(formattedDate);
    };

    return (
        <div className="calendar">
            <div className="calendar_header">
                <button
                    type="button"
                    className="calendar_arrow"
                    onClick={handlePreviousMonth}
                >
                    ‹
                </button>

                <span className="calendar_month">
                    {months[month]} {year}
                </span>

                <button
                    type="button"
                    className="calendar_arrow"
                    onClick={handleNextMonth}
                >
                    ›
                </button>
            </div>

            <div className="calendar_weekdays">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="calendar_weekday"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar_days">
                {days.map((day, index) => (
                    <button
                        key={`${day}-${index}`}
                        type="button"
                        className="calendar_day"
                        disabled={!day}
                        onClick={() => handleSelectDate(day)}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
}