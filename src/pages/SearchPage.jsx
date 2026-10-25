import { useReducer } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Calendar from '../components/Calendar';
import './SearchPage.css';


const initialState = {
    // Основные поля формы
    inn: '',
    startDate: '',
    endDate: '',
    documents: '',
    tonality: 'any',

    // Ошибки валидации
    dateError: false,
    innError: false,
    documentsError: false,

    //Состояние календаря
    activeDatePicker: null,

    //Фильтры поиска
    maxFullness: false,
    inBusinessNews: null,
    onlyMainRole: false,

    // Пока неактивные фильтры
    onlyWithRiskFactors: false,
    includeTechNews: false,
    includeAnnouncements: false,
    includeDigests: false,
};

const formReducer = (state, action) => {
    switch (action.type) {
        case 'SET_INN':
            return {
                ...state,
                inn: action.payload,
            };

        case 'SET_START_DATE':
            return {
                ...state,
                startDate: action.payload,
            };

        case 'SET_END_DATE':
            return {
                ...state,
                endDate: action.payload,
            };

        case 'SET_ACTIVE_DATE_PICKER':
            return {
                ...state,
                activeDatePicker: action.payload,
            };

        case 'SET_DATE_ERROR':
            return {
                ...state,
                dateError: action.payload,
            };

        case 'SET_INN_ERROR':
            return {
                ...state,
                innError: action.payload,
            };

        case 'SET_DOCUMENTS':
            return {
                ...state,
                documents: action.payload,
            };

        case 'SET_DOCUMENTS_ERROR':
            return {
                ...state,
                documentsError: action.payload,
            };

        case 'SET_TONALITY':
            return {
                ...state,
                tonality: action.payload,
            };

        case 'SET_MAX_FULLNESS':
            return {
                ...state,
                maxFullness: action.payload,
            };

        case 'SET_IN_BUSINESS_NEWS':
            return {
                ...state,
                inBusinessNews: action.payload,
            };

        case 'SET_ONLY_MAIN_ROLE':
            return {
                ...state,
                onlyMainRole: action.payload,
            };

        case 'SET_INCLUDE_ANNOUNCEMENTS':
            return {
                ...state,
                includeAnnouncements: action.payload,
            };

        default:
            return state;
        }
};

export default function SearchPage() {

const [formState, dispatch] = useReducer(
    formReducer,
    initialState
);

const {isLoggedIn, loading } = useAuth();

const navigate = useNavigate();
    
const formatDateForInput = (date) => {
    if (!date) {
        return '';
    }

const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
};
    
const validateDateRange = (start, end) => {
    if (!start || !end) {
        return false;
    }

const startDateValue = new Date(`${start}T00:00:00`);
const endDateValue = new Date(`${end}T00:00:00`);
const today = new Date();
    today.setHours(23, 59, 59, 999);
        if (startDateValue > today || endDateValue > today) {
            return false;
        }
        if (startDateValue > endDateValue) {
            return false;
        }
        return true;
};
    
const validateInn = (value) => {
    if (!/^\d{10}$/.test(value)) {
        return false;
    }
const digits = value.split('').map(Number);
const coefficients = [2, 4, 10, 3, 5, 9, 4, 6, 8];
let sum = 0;
    for (let i = 0; i < coefficients.length; i += 1) {
        sum += digits[i] * coefficients[i];
    }

const checkDigit = (sum % 11) % 10;    
    return checkDigit === digits[9];
};

const isFormValid = () => {
    return (
        validateInn(formState.inn) &&
        formState.documents !== '' &&
        !formState.documentsError &&
        validateDateRange(formState.startDate, formState.endDate)
    );
};

const buildRequestBody = () => {
    return {
        issueDateInterval: {
            dateFrom: formState.startDate,
            dateTo: formState.endDate,
        },
        searchContext: {
            targetSearchEntitiesContext: {
                targetSearchEntities: [
                    {
                        type: 'company',
                        sparkId: null,
                        entityId: null,
                        inn: formState.inn,
                        maxFullness: formState.maxFullness,
                        inBusinessNews: formState.inBusinessNews,
                    },
                ],
                onlyMainRole: formState.onlyMainRole,
                onlyWithRiskFactors: formState.onlyWithRiskFactors,
                tonality: formState.tonality,
            },
        },
        attributeFilters: {
            excludeTechNews: true,
            excludeAnnouncements: !formState.includeAnnouncements,
            excludeDigests: true,
        },
        similarMode: 'duplicates',
        limit: Number(formState.documents),
        sortType: 'issueDate',
        sortDirectionType: 'desc',
        intervalType: 'month',
        histogramTypes: [
            'totalDocuments',
            'riskFactors',
        ],
    };
};
    
const handleSearch = () => {
    const requestBody = buildRequestBody();


    console.log('REQUEST BODY:', requestBody);

    navigate('/results', {
        state: {
            requestBody,
        },
    });
};

    if (loading) {
        return null;
    }
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return (
    <main className="search-page">
        <section className="search-page_content">
            <div className="search-page_header">
                <div className="search-page_header-text">
                    <h1 className="search-page_title">
                        НАЙДИТЕ НЕОБХОДИМЫЕ ДАННЫЕ В ПАРУ КЛИКОВ.
                    </h1>
                    <p className="search-page_subtitle">
                        Задайте параметры поиска.
                    </p>
                    <p className="search-page_description">
                        Чем больше заполните, тем точнее поиск
                    </p>
                </div>
                <div className="search-page_header-images">
                    <img src="/Document.svg" alt="" />
                    <img src="/Folders.svg" alt="" />
                </div>
            </div>
            <div className="search-page_main">
                <div className="search-page_form">
                    <div className="search-page_form-left">
                        <div className="search-field">
                            <label htmlFor="inn">ИНН компании*</label>
                            <input
                            id="inn"
                            type="text"
                            placeholder="10 цифр"
                            className={formState.innError ? 'search-input-error' : ''}
                            value={formState.inn}
                            onChange={(event) => {
                                const value =event.target.value;
                                dispatch({
                                    type: 'SET_INN',
                                    payload: value,
                                });
                                dispatch({
                                    type: 'SET_INN_ERROR',
                                    payload: value !== '' && !validateInn(value),
                                });
                            }}
                            />
                        </div>                       
                        <div className="search-field">
                            <label htmlFor="tonality">Тональность</label>
                            <div className='search-select'>
                                <select
                                id="tonality"
                                className="search-tonality"
                                value={formState.tonality}
                                onChange={(event) =>
                                    dispatch({
                                        type: 'SET_TONALITY',
                                        payload: event.target.value,
                                    })
                                }
                                >
                                    <option value="" disabled>Выберите тональность</option>
                                    <option value="positive">Позитивная</option>
                                    <option value="negative">Негативная</option>
                                    <option value="any">Любая</option>
                                </select>
                                <span className='search-select_arrow'></span>
                            </div>
                        </div>
                        <div className="search-field">
                            <label htmlFor="documents">Количество документов в выдаче*</label>
                            <input
                            id="documents"
                            type="number"
                            placeholder="от 1 до 1000"
                            min="1"
                            max="1000"
                            value={formState.documents}
                            onChange={(event) => {
                                const value = event.target.value;
                                dispatch({
                                    type: 'SET_DOCUMENTS',
                                    payload: value,
                                });
                                if (value === '') {
                                    dispatch({
                                        type: 'SET_DOCUMENTS_ERROR',
                                        payload: false,
                                    });
                                    return;
                                }
                                const number = Number(value);
                                dispatch({
                                    type: 'SET_DOCUMENTS_ERROR',
                                    payload: number < 1 || number > 1000,
                                });
                            }}
                            className={formState.documentsError ? 'search-input-error' : ''}
                            />
                        </div>                        
                        <div className="search-field">
                            <label>Диапазон поиска*</label>
                            <div className="search-date-range">
                                <div className={`search-date-field ${formState.dateError ? 'search-date-field-error' : ''}`}>
                                    <input
                                    type="text"
                                    placeholder="Дата начала"
                                    aria-label="Дата начала поиска"
                                    value={formatDateForInput(formState.startDate)}
                                    onChange={(event) =>
                                        dispatch({
                                            type: 'SET_START_DATE',
                                            payload: event.target.value,
                                        })
                                    }
                                    onFocus={() =>
                                        dispatch({
                                            type: 'SET_ACTIVE_DATE_PICKER',
                                            payload: 'start',
                                        })
                                    }
                                    />
                                    <span className="search-date-arrow"
                                    onClick={() => dispatch({
                                        type: 'SET_ACTIVE_DATE_PICKER',
                                        payload: 'start',
                                    })}
                                    ></span>
                                    {formState.activeDatePicker === "start" && (
                                        <Calendar
                                        onSelectDate={(date) => {
                                            dispatch({
                                                type: 'SET_START_DATE',
                                                payload: date,
                                            });
                                            dispatch({
                                                type: 'SET_ACTIVE_DATE_PICKER',
                                                payload: null,
                                            });
                                            dispatch({
                                                type: 'SET_DATE_ERROR',
                                                payload: !validateDateRange(date, formState.endDate),
                                            });
                                        }}
                                        />
                                    )}
                                </div>
                                <div className={`search-date-field ${formState.dateError ? 'search-date-field-error' : ''}`}>
                                    <input
                                    type="text"
                                    placeholder="Дата конца"
                                    aria-label="Дата окончания поиска"
                                    value={formatDateForInput(formState.endDate)}
                                    onChange={(event) =>
                                        dispatch({
                                            type: 'SET_END_DATE',
                                            payload: event.target.value,
                                        })
                                    }
                                    onFocus={() =>
                                        dispatch({
                                            type: 'SET_ACTIVE_DATE_PICKER',
                                            payload: 'end',
                                        })
                                    }
                                    />
                                    <span className="search-date-arrow"
                                    onClick={() => dispatch({
                                        type: 'SET_ACTIVE_DATE_PICKER',
                                        payload: 'end',
                                    })}
                                    ></span>
                                    {formState.activeDatePicker === "end" && (
                                        <Calendar
                                        onSelectDate={(date) => {
                                            dispatch({
                                                type: 'SET_END_DATE',
                                                payload: date,
                                            })
                                            dispatch({
                                                type: 'SET_ACTIVE_DATE_PICKER',
                                                payload: null,
                                            });
                                            dispatch({
                                                type: 'SET_DATE_ERROR',
                                                payload: !validateDateRange(formState.startDate, date),
                                            });
                                        }}
                                        />
                                    )}
                                </div>
                            </div>
                            {formState.dateError && (
                                <p className="search-date-error">
                                    Введите корректные данные
                                </p>
                            )}
                        </div>
                    </div>                    
                    <div className="search-page_form-right">
                        <label className="search-checkbox">
                            <input
                            type="checkbox"
                            checked={formState.maxFullness}
                            onChange={(event) =>
                                dispatch({
                                    type: 'SET_MAX_FULLNESS',
                                    payload: event.target.checked,
                                })
                            }
                            />
                            <span className="search-checkbox_box">
                                <img src="/Checkbox.svg" alt="" />
                            </span>
                            <span>Признак максимальной полноты</span>
                        </label>
                        <label className="search-checkbox">
                            <input
                            type="checkbox"
                            checked={formState.inBusinessNews === true}
                            onChange={(event) =>
                                dispatch({
                                    type: 'SET_IN_BUSINESS_NEWS',
                                    payload: event.target.checked ? true : null,
                                })
                            }
                            />
                            <span className="search-checkbox_box">
                                <img src="/Checkbox.svg" alt="" />
                            </span>
                            <span>Упоминания в бизнес-контексте</span>
                        </label>
                        <label className="search-checkbox">
                            <input
                            type="checkbox"
                            checked={formState.onlyMainRole}
                            onChange={(event) =>
                                dispatch({
                                    type: 'SET_ONLY_MAIN_ROLE',
                                    payload: event.target.checked,
                                })
                            }
                            />
                            <span className="search-checkbox_box">
                                <img src="/Checkbox.svg" alt="" />
                            </span>
                            <span>Главная роль в публикации</span>
                        </label>
                        <label className="search-checkbox search-checkbox-disabled">
                            <input type="checkbox" disabled />
                            <span className="search-checkbox_box-disabled">
                                <img src="/Checkbox.svg" alt="" />
                            </span>
                            <span>Публикации только с риск-факторами</span>
                        </label>
                        <label className="search-checkbox search-checkbox-disabled">
                            <input type="checkbox" disabled />
                            <span className="search-checkbox_box-disabled">
                                <img src="/Checkbox.svg" alt="" />
                            </span>
                            <span>Включать технические новости рынков</span>
                        </label>
                        <label className="search-checkbox">
                            <input
                            type="checkbox"
                            checked={formState.includeAnnouncements}
                            onChange={(event) =>
                                dispatch({
                                    type: 'SET_INCLUDE_ANNOUNCEMENTS',
                                    payload: event.target.checked,
                                })
                            }
                            />
                            <span className="search-checkbox_box">
                                <img src="/Checkbox.svg" alt="" />
                            </span>
                            <span>Включать анонсы и календари</span>
                        </label>
                        <label className="search-checkbox search-checkbox-disabled">
                            <input type="checkbox" disabled />
                            <span className="search-checkbox_box-disabled">
                                <img src="/Checkbox.svg" alt="" />
                            </span>
                            <span>Включать сводки новостей</span>
                        </label>
                        <button
                        type="button"
                        className="search-button"
                        disabled={!isFormValid()}
                        onClick={handleSearch}
                        >
                            Поиск
                        </button>
                        <p className="search-required-note">
                            * Обязательные к заполнению поля
                        </p>
                    </div>
                </div>
                <div className="search-page_image">
                    <img src="/Search-illustration.svg" alt="" />
                </div>
            </div>
        </section>
    </main>
    );
}