import { useEffect, useReducer, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getHistograms, getSearchResults, getDocuments } from '../api/search';
import './ResultsPage.css';

const decodeHtml = (html) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
};

const getImageFromMarkup = (markup) => {
    if (!markup) {
    return null;
    }
    
    const html = decodeHtml(markup);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return doc.querySelector('img')?.getAttribute('src') || null;
};

const getArticleTag = (attributes) => {
    if (attributes?.isTechNews) {
    return 'Технические новости';
    }

    if (attributes?.isAnnouncement) {
    return 'Анонсы и события';
    }

    if (attributes?.isDigest) {
    return 'Сводки новостей';
    }
    
    return null;
};

const DOCUMENTS_PER_PAGE = 10;
const MOBILE_DOCUMENTS_PER_PAGE = 2;
const SUMMARY_VISIBLE_COUNT = 8;
const MOBILE_SUMMARY_VISIBLE_COUNT = 1;

const getSummaryVisibleCount = () =>
    window.matchMedia('(max-width: 375px)').matches
        ? MOBILE_SUMMARY_VISIBLE_COUNT
        : SUMMARY_VISIBLE_COUNT;

const getDocumentsPerPage = () =>
    window.matchMedia('(max-width: 375px)').matches
        ? MOBILE_DOCUMENTS_PER_PAGE
        : DOCUMENTS_PER_PAGE;

const initialResultsState = {
    histograms: null,
    searchResults: null,
    documents: [],
    documentsOffset: 0,
    histogramsLoading: true,
    documentsLoading: true,
    documentsLoadingMore: false,
};

const resultsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_RESULTS':
            return {
                ...state,
                histograms: action.payload.histograms,
                searchResults: action.payload.searchResults,
            };

        case 'SET_DOCUMENTS':
            return {
                ...state,
                documents: action.payload.documents,
                documentsOffset: action.payload.offset,
            };

        case 'SET_HISTOGRAMS_LOADING':
            return {
                ...state,
                histogramsLoading: action.payload,
            };

        case 'SET_DOCUMENTS_LOADING':
            return {
                ...state,
                documentsLoading: action.payload,
            };

        case 'SET_DOCUMENTS_LOADING_MORE':
            return {
                ...state,
                documentsLoadingMore: action.payload,
            };

        case 'ADD_DOCUMENTS':
            return {
                ...state,
                documents: [
                    ...state.documents,
                    ...action.payload.documents,
                ],
                documentsOffset:
                    state.documentsOffset +
                    action.payload.count,
            };

        default:
            return state;
    }
};


export default function ResultsPage() {
    const location = useLocation();
    const { requestBody } = location.state || {};
    
    const [resultsState, dispatch] = useReducer(
    resultsReducer,
    initialResultsState
    );
    
    const {
    histograms,
    searchResults,
    documents,
    documentsOffset,
    histogramsLoading,
    documentsLoading,
    documentsLoadingMore,
    } = resultsState;

    const [summaryStartIndex, setSummaryStartIndex] = useState(0);
    
    useEffect(() => {
        const loadResults = async () => {
            if (!requestBody) {
                dispatch({
                    type: 'SET_HISTOGRAMS_LOADING',
                    payload: false,
                });
                dispatch({
                    type: 'SET_DOCUMENTS_LOADING',
                    payload: false,
                });
                return;
            }
            try {
                const [histogramData, searchData] = await Promise.all([
                    getHistograms(requestBody),
                    getSearchResults(requestBody),
                ]);

                dispatch({
                    type: 'SET_RESULTS',
                    payload: {
                        histograms: histogramData,
                        searchResults: searchData,
                    },
                });

                if (!searchData?.items?.length) {
                    return;
                }
                
                const pageSize = getDocumentsPerPage();
                
                const ids = searchData.items
                .slice(0, pageSize)
                .map((item) => item.encodedId);
                
                const documentsData = await getDocuments(ids);
                dispatch({
                    type: 'SET_DOCUMENTS',
                    payload: {
                        documents: documentsData,
                        offset: ids.length,
                    },
                });
            } catch (error) {
                console.error('Ошибка загрузки результатов:', error);
            } finally {
                dispatch({
                    type: 'SET_HISTOGRAMS_LOADING',
                    payload: false,
                });
                dispatch({
                    type: 'SET_DOCUMENTS_LOADING',
                    payload: false,
                });
            }
        };
        loadResults();
    }, [requestBody]);
    
    const loadMoreDocuments = async () => {
        if (
            documentsLoadingMore ||
            !searchResults?.items?.length ||
            documentsOffset >= searchResults.items.length
        )
        {
            return;
        }
        try {
            dispatch({
                type: 'SET_DOCUMENTS_LOADING_MORE',
                payload: true,
            });
            
            const pageSize = getDocumentsPerPage();
            
            const nextIds = searchResults.items
            .slice(
                documentsOffset,
                documentsOffset + pageSize
            )
            .map((item) => item.encodedId);
            
            const documentsData = await getDocuments(nextIds);
            dispatch({
                type: 'ADD_DOCUMENTS',
                payload: {
                    documents: documentsData,
                    count: nextIds.length,
                },
            });
        } catch (error) {
            console.error(
                'Ошибка загрузки дополнительных документов:',
                error
            );
        } finally {
            dispatch({
                type: 'SET_DOCUMENTS_LOADING_MORE',
                payload: false,
            });
        }
    };
    
    const histogramStartDate = new Date(
        requestBody?.issueDateInterval?.dateFrom
    );
    const histogramEndDate = new Date(
        requestBody?.issueDateInterval?.dateTo
    );
    
    const totalDocuments =
    histograms?.data
    ?.find(
        (item) => item.histogramType === 'totalDocuments'
    )
    ?.data?.filter((item) => {
        const date = new Date(item.date);
        return (
            date >= histogramStartDate &&
            date <= histogramEndDate
        );
    }) || [];
    
    const riskFactors =
    histograms?.data
    ?.find(
        (item) => item.histogramType === 'riskFactors'
    )
    ?.data?.filter((item) => {
        const date = new Date(item.date);
        return (
            date >= histogramStartDate &&
            date <= histogramEndDate
        );
    }) || [];
    
    const summaryVisibleCount = getSummaryVisibleCount();
    
    const visibleTotalDocuments = totalDocuments.slice(
        summaryStartIndex,
        summaryStartIndex + summaryVisibleCount
    );
    
    const visibleRiskFactors = riskFactors.slice(
        summaryStartIndex,
        summaryStartIndex + summaryVisibleCount
    );
    
    const canGoPrevious = summaryStartIndex > 0;
    
    const canGoNext =
    summaryStartIndex + summaryVisibleCount < totalDocuments.length;

    const canShowMore = documentsOffset < (searchResults?.items?.length || 0);

    return (
    <main className="results-page">
        <section className="results-intro">
            <div className="results-intro-text">
                <h1 className="results-intro-title">
                    ИЩЕМ. СКОРО
                    <br />
                    БУДУТ РЕЗУЛЬТАТЫ
                </h1>
                <p className="results-intro-description">
                    Поиск может занять некоторое время,
                    <br />
                    просим сохранять терпение.
                </p>
            </div>

            <div className="results-intro-image">
                <img src="/ResultsPageImage.svg" alt="" />
            </div>
        </section>
        <section className="results-summary">
            <h2 className="results-section-title">
                ОБЩАЯ СВОДКА
            </h2>
            <p className="results-summary-count">
                Найдено {searchResults?.items?.length || 0} вариантов
            </p>
            <div className="results-summary-carousel">
                <button
                className="summary-arrow"
                type="button"
                onClick={() =>
                    setSummaryStartIndex((current) =>
                        Math.max(0, current - 1)
                    )
                }
                disabled={!canGoPrevious}
                aria-label="Предыдущие периоды"
                >
                ‹
                </button>
                <div className="summary-table">
                    <div className="summary-desktop">
                        <div className="summary-label-column">
                            <div>Период</div>
                            <div>Всего</div>
                            <div>Риски</div>
                        </div>
                        
                        {histogramsLoading ? (
                            <div className="summary-loading">
                                <div className="loader-spinner"></div>
                                <span>Загружаем данные</span>
                            </div>
                        ) : (
                        <div className="summary-data">
                            <div className="summary-row">
                                {visibleTotalDocuments.map((item) => (
                                    <div className="summary-cell" key={item.date}>
                                        {new Date(item.date).toLocaleDateString('ru-RU')}
                                    </div>
                                ))}
                            </div>
                            <div className="summary-row">
                                {visibleTotalDocuments.map((item) => (
                                    <div className="summary-cell" key={item.date}>
                                        {item.value}
                                    </div>
                                ))}
                            </div>
                            <div className="summary-row">
                                {visibleRiskFactors.map((item) => (
                                    <div className="summary-cell" key={item.date}>
                                        {item.value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    </div>
                    <div className="summary-mobile">
                        <div className="summary-mobile-column">
                            <div className="summary-mobile-heading">
                                <span>Период</span>
                                <span>Всего</span>
                                <span>Риски</span>
                            </div>
                            {histogramsLoading ? (
                                <div className="summary-mobile-loading">
                                    <div className="loader-spinner"></div>
                                </div>
                            ) : (
                                visibleTotalDocuments.map((item) => {
                                    const risk = visibleRiskFactors.find(
                                        (riskItem) => riskItem.date === item.date
                                    );
                                    
                                    return (
                                    <div className="summary-mobile-values" key={item.date}>
                                        <span>
                                            {new Date(item.date).toLocaleDateString('ru-RU')}
                                        </span>
                                        <span>{item.value}</span>
                                        <span>{risk?.value ?? 0}</span>
                                    </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
                <button
                className="summary-arrow"
                type="button"
                onClick={() =>
                    setSummaryStartIndex((current) =>
                        Math.min(
                            Math.max(
                                0,
                                totalDocuments.length - summaryVisibleCount
                            ),
                            current + 1
                        )
                    )
                }
                disabled={!canGoNext}
                aria-label="Следующие периоды"
                >
                ›
                </button>
            </div>
        </section>
        <section className="results-documents">
            <h2 className="results-section-title">
                СПИСОК ДОКУМЕНТОВ
            </h2>
            
            {!documentsLoading && documents.length > 0 && (
                <div className="results-list">
                    {documents.map((document) => {
                        const article = document.ok;
                        if (!article) {
                            return null;
                        }

                        const imageUrl = getImageFromMarkup(
                            article?.content?.markup
                        );

                        const tag = getArticleTag(article?.attributes);

                        return (
                            <article
                             className="result-card"
                             key={article.id}
                            >
                                <div className="result-card_header">
                                    <span>
                                        {new Date(
                                            article.issueDate
                                        ).toLocaleDateString('ru-RU')}
                                    </span>

                                    <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >
                                        {article.source?.name}
                                    </a>
                                </div>

                                <h3 className="result-card_title">
                                    {article.title?.text}
                                </h3>

                                {tag && (
                                    <div className="result-card_tags">
                                        <span className="result-card_tag">
                                            {tag}
                                        </span>
                                    </div>
                                )}

                                <div className="result-card_content">
                                    {imageUrl && (
                                        <img
                                        className="result-card_image"
                                        src={imageUrl}
                                        alt=""
                                        />
                                    )}

                                    {article.content?.markup && (
                                        <div
                                        dangerouslySetInnerHTML={{
                                            __html: decodeHtml(
                                                article.content.markup
                                            )
                                            .replace(
                                                /<img[^>]*>/gi,
                                                ''
                                            )
                                            .replace(
                                                /<\?xml[^>]*>/i,
                                                ''
                                            )
                                            .replace(
                                                /<\/?body[^>]*>/gi,
                                                ''
                                            ),
                                        }}
                                        />
                                    )}
                                </div>

                                <div className="result-card_footer">
                                    <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >
                                        Читать в источнике
                                    </a>

                                    <span>
                                        {article.attributes?.wordCount || 0}{' '}
                                        слов
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {canShowMore && (
                <button
                type="button"
                className="results-show-more"
                onClick={loadMoreDocuments}
                disabled={documentsLoadingMore}
                >
                    {documentsLoadingMore ? 'Загружаем...' : 'Показать больше'}
                </button>
            )}
        </section>
    </main>
    );
}