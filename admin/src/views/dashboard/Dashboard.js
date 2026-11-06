import React, { useEffect, useMemo, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CProgress,
  CProgressBar,
  CSpinner,
  CBadge,
  CButton,
} from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import {
  cilNewspaper,
  cilPencil,
  cilFolderOpen,
  cilTrash,
  cilUser,
  cilArrowRight,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import setting from '../../setting.json'
import secureLocalStorage from 'react-secure-storage'

const COLORS = {
  blue: '#2563eb',
  green: '#059669',
  orange: '#ea580c',
  purple: '#7c3aed',
  red: '#e11d48',
  cyan: '#0891b2',
}

const GRADIENTS = {
  blue: 'linear-gradient(135deg, #2563eb, #0891b2)',
  green: 'linear-gradient(135deg, #059669, #10b981)',
  orange: 'linear-gradient(135deg, #ea580c, #f59e0b)',
  purple: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  red: 'linear-gradient(135deg, #e11d48, #fb7185)',
  cyan: 'linear-gradient(135deg, #0891b2, #06b6d4)',
}

const cardStyle = {
  border: '1px solid rgba(226,232,240,0.8)',
  borderRadius: 12,
  overflow: 'hidden',
  minWidth: 0,
  boxShadow: '0 5px 20px rgba(15,23,42,0.045)',
}

const decodeText = (value = '') => {
  const entities = {
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
  }

  return String(value).replace(
    /&amp;|&quot;|&#39;|&#x27;|&lt;|&gt;|&nbsp;/gi,
    (entity) => entities[entity] || entity,
  )
}

const getTitle = (item) =>
  decodeText(item.title || item.heading || item.newsTitle || 'Untitled News')

const getViews = (item) => Number(item.views ?? item.viewCount ?? item.totalViews ?? 0) || 0

const getAuthorName = (item) => {
  if (item.author && typeof item.author === 'object') {
    return item.author.name || item.author.username || item.author.fullName || 'Unknown Author'
  }

  return item.authorName || (typeof item.author === 'string' ? item.author : '') || 'Unknown Author'
}

const getValidDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const isSameDay = (a, b) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear()

const formatNumber = (value) => Number(value || 0).toLocaleString('en-IN')

const Dashboard = () => {
  const [news, setNews] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError('')

        const loginInfo = secureLocalStorage.getItem('logininfo')
        const loginData = typeof loginInfo === 'string' ? JSON.parse(loginInfo) : loginInfo
        const token = loginData?.token

        const [newsResponse, categoryResponse] = await Promise.all([
          fetch(`${setting.api}/api/news/getAllNews`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${setting.api}/api/categories/getAllCategory`),
        ])

        if (!newsResponse.ok || !categoryResponse.ok) {
          throw new Error('Unable to load dashboard data.')
        }

        const [newsResult, categoryResult] = await Promise.all([
          newsResponse.json(),
          categoryResponse.json(),
        ])

        if (newsResult.status === false) {
          throw new Error(newsResult.message || 'Unable to load news.')
        }

        if (categoryResult.status === false) {
          throw new Error(categoryResult.message || 'Unable to load categories.')
        }

        if (!cancelled) {
          setNews(Array.isArray(newsResult.data) ? newsResult.data : [])
          setCategories(Array.isArray(categoryResult.data) ? categoryResult.data : [])
        }
      } catch (err) {
        console.error('Dashboard Error:', err)
        if (!cancelled) setError(err.message || 'Something went wrong.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDashboardData()

    return () => {
      cancelled = true
    }
  }, [])

  const analytics = useMemo(() => {
    const today = new Date()

    const activeNews = news.filter((item) => item.isDeleted !== true)
    const deletedNews = news.filter((item) => item.isDeleted === true)

    const publishedNews = activeNews.filter((item) => Number(item.type) === 1)

    const draftNews = activeNews.filter((item) => Number(item.type) === 2)

    const todaysPublishedNews = publishedNews.filter((item) => {
      const created = getValidDate(item.createdAt)
      return created && isSameDay(created, today)
    })

    const mostViewedNews = [...publishedNews].sort((a, b) => getViews(b) - getViews(a)).slice(0, 7)

    const authorsToday = Object.entries(
      todaysPublishedNews.reduce((result, item) => {
        const name = getAuthorName(item)
        result[name] = (result[name] || 0) + 1
        return result
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)

    const totalViews = publishedNews.reduce((sum, item) => sum + getViews(item), 0)

    const recentNews = [...activeNews]
      .sort(
        (a, b) =>
          (getValidDate(b.createdAt)?.getTime() || 0) - (getValidDate(a.createdAt)?.getTime() || 0),
      )
      .slice(0, 6)

    const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (6 - index))
      return date
    })

    const dailyPublishingCounts = lastSevenDays.map(
      (day) =>
        publishedNews.filter((item) => {
          const created = getValidDate(item.createdAt)
          return created && isSameDay(created, day)
        }).length,
    )

    return {
      activeNews,
      publishedNews,
      draftNews,
      deletedNews,
      todaysPublishedNews,
      mostViewedNews,
      authorsToday,
      totalViews,
      recentNews,
      lastSevenDays,
      dailyPublishingCounts,
    }
  }, [news])

  const stats = [
    {
      title: 'Total News',
      count: analytics.activeNews.length,
      icon: cilNewspaper,
      color: COLORS.blue,
      gradient: GRADIENTS.blue,
      detail: 'All active articles',
    },
    {
      title: 'Published News',
      count: analytics.publishedNews.length,
      icon: cilNewspaper,
      color: COLORS.green,
      gradient: GRADIENTS.green,
      detail: 'Live articles',
    },
    {
      title: 'Draft News',
      count: analytics.draftNews.length,
      icon: cilPencil,
      color: COLORS.orange,
      gradient: GRADIENTS.orange,
      detail: 'Pending publication',
    },
    {
      title: 'Categories',
      count: categories.length,
      icon: cilFolderOpen,
      color: COLORS.purple,
      gradient: GRADIENTS.purple,
      detail: 'Available categories',
    },
    {
      title: 'Deleted News',
      count: analytics.deletedNews.length,
      icon: cilTrash,
      color: COLORS.red,
      gradient: GRADIENTS.red,
      detail: 'Deleted records',
    },
    {
      title: 'Total Views',
      count: analytics.totalViews,
      icon: cilNewspaper,
      color: COLORS.cyan,
      gradient: GRADIENTS.cyan,
      detail: 'Published article views',
    },
  ]

  const maxStat = Math.max(...stats.map((item) => item.count), 1)

  const horizontalChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: '#edf1f7' },
        ticks: { precision: 0 },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: '#475569',
          font: { size: 11 },
        },
      },
    },
  }

  const panelHeading = (icon, title, subtitle, color) => (
    <div className="d-flex align-items-center gap-3 mb-4">
      <div
        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
        style={{
          width: 46,
          height: 46,
          color: '#fff',
          background: `linear-gradient(135deg, ${color}, ${color}bb)`,
          boxShadow: `0 5px 14px ${color}30`,
        }}
      >
        <CIcon icon={icon} size="lg" />
      </div>
      <div style={{ minWidth: 0 }}>
        <h5 className="fw-bold mb-1" style={{ color: '#172033' }}>
          {title}
        </h5>
        <p className="text-body-secondary small mb-0">{subtitle}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
      >
        <CSpinner color="primary" />
        <span className="ms-3 text-body-secondary">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div
      className="container-fluid p-3 p-md-4"
      style={{
        background: '#f3f6fc',
        minHeight: '100vh',
        maxWidth: '100%',
        width: '100%',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Welcome banner */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-4 mb-4"
        style={{
          borderRadius: 20,
          color: '#fff',
          background:
            'radial-gradient(circle at 85% 20%, #2563eb 0, transparent 30%), linear-gradient(115deg, #101b3d, #172554 60%, #312e81)',
          boxShadow: '0 12px 28px rgba(30,64,175,0.16)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="small mb-2" style={{ color: '#bfdbfe' }}>
            BHARAT 19 EXPRESS · ADMIN PANEL
          </div>
          <h2 className="fw-bold mb-2">
            Welcome Back, <span style={{ color: '#fb7185' }}>Admin!</span>
          </h2>
          <p className="mb-0" style={{ color: '#dbeafe' }}>
            Here&apos;s what&apos;s happening with your news portal today.
          </p>
        </div>

        <div
          className="d-flex align-items-center gap-3 p-3"
          style={{
            position: 'relative',
            zIndex: 1,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.16)',
            borderRadius: 14,
            backdropFilter: 'blur(8px)',
          }}
        >
          <CIcon icon={cilFolderOpen} size="xl" />
          <div>
            <div className="fw-semibold">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <small style={{ color: '#bfdbfe' }}>Today&apos;s overview</small>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <CButton
            size="sm"
            color="danger"
            variant="outline"
            className="ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </CButton>
        </div>
      )}

      {/* Colorful summary cards */}
      <CRow className="g-3 mb-4">
        {stats.map((item) => (
          <CCol xs={12} sm={6} lg={4} xxl={2} key={item.title}>
            <CCard
              className="h-100 border-0"
              style={{
                borderRadius: 12,
                color: '#fff',
                background: item.gradient,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: `0 8px 20px ${item.color}26`,
              }}
            >
              <CCardBody className="p-2">
                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.22)',
                    }}
                  >
                    <CIcon icon={item.icon} size="sm" />
                  </div>
                  <span
                    className="rounded-pill px-2 py-1 small"
                    style={{
                      background: 'rgba(255,255,255,0.88)',
                      color: item.color,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    LIVE
                  </span>
                </div>

                <div className="small mb-1" style={{ opacity: 0.9 }}>
                  {item.title}
                </div>

                <h4 className="fw-bold mb-1" style={{ fontSize: '1.25rem' }}>
                  {formatNumber(item.count)}
                </h4>

                <div className="small mb-2" style={{ minHeight: 0, opacity: 0.88 }}>
                  {item.detail}
                </div>

                <CProgress
                  style={{
                    height: 4,
                    background: 'rgba(255,255,255,0.25)',
                    borderRadius: 20,
                  }}
                >
                  <CProgressBar
                    value={Math.min((item.count / maxStat) * 100, 100)}
                    style={{
                      background: '#fff',
                      borderRadius: 20,
                    }}
                  />
                </CProgress>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Most viewed and today's authors */}
      <CRow className="g-4 mb-4">
        <CCol xs={12} xl={7}>
          <CCard className="h-100" style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              {panelHeading(
                cilNewspaper,
                'Most Viewed News',
                'Top published articles ranked by total views',
                COLORS.blue,
              )}

              {analytics.mostViewedNews.some((item) => getViews(item) > 0) ? (
                <div style={{ height: 310, width: '100%', minWidth: 0 }}>
                  <CChartBar
                    data={{
                      labels: analytics.mostViewedNews.map((item) => {
                        const title = getTitle(item)
                        return title.length > 34 ? `${title.slice(0, 34)}…` : title
                      }),
                      datasets: [
                        {
                          label: 'Views',
                          data: analytics.mostViewedNews.map(getViews),
                          backgroundColor: [
                            '#3B82F6',
                            '#06B6D4',
                            '#8B5CF6',
                            '#F59E0B',
                            '#64748B',
                            '#10B981',
                            '#F43F5E',
                          ],
                          borderRadius: 7,
                          barThickness: 23,
                        },
                      ],
                    }}
                    options={horizontalChartOptions}
                  />
                </div>
              ) : (
                <div className="text-center text-body-secondary py-5">
                  <CIcon icon={cilNewspaper} size="3xl" className="mb-3" />
                  <p className="fw-semibold mb-1">No view analytics available</p>
                  <small>Configure view tracking in the backend to rank articles.</small>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} xl={5}>
          <CCard className="h-100" style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-start gap-2">
                {panelHeading(
                  cilUser,
                  'Most Published Today',
                  'Authors ranked by articles published today',
                  COLORS.purple,
                )}
                <CBadge
                  className="px-3 py-2"
                  style={{
                    background: '#f3e8ff',
                    color: COLORS.purple,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {analytics.todaysPublishedNews.length} articles
                </CBadge>
              </div>

              {analytics.authorsToday.length > 0 ? (
                <div>
                  {analytics.authorsToday.map(([name, count], index) => {
                    const maxAuthorCount = Math.max(
                      ...analytics.authorsToday.map((author) => author[1]),
                      1,
                    )

                    return (
                      <div
                        key={name}
                        className="d-flex align-items-center gap-3 py-3"
                        style={{
                          borderBottom: '1px solid #edf0f6',
                          minWidth: 0,
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                          style={{
                            width: 32,
                            height: 32,
                            background:
                              index === 0 ? '#fef3c7' : index === 1 ? '#e2e8f0' : '#f1f5f9',
                            color: index === 0 ? '#92400e' : index === 1 ? '#334155' : '#64748b',
                            fontWeight: 800,
                            fontSize: 12,
                          }}
                        >
                          {index + 1}
                        </div>

                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                          style={{
                            width: 40,
                            height: 40,
                            color: '#fff',
                            fontWeight: 700,
                            background: index % 2 === 0 ? GRADIENTS.purple : GRADIENTS.blue,
                          }}
                        >
                          {name.charAt(0).toUpperCase()}
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            className="fw-semibold"
                            style={{
                              color: '#1e293b',
                              overflowWrap: 'anywhere',
                            }}
                          >
                            {name}
                          </div>
                          <small className="text-body-secondary">
                            {count} {count === 1 ? 'post' : 'posts'} today
                          </small>

                          <CProgress
                            className="mt-2"
                            style={{
                              height: 6,
                              background: '#edf1f8',
                              borderRadius: 20,
                            }}
                          >
                            <CProgressBar
                              value={(count / maxAuthorCount) * 100}
                              style={{
                                background: index % 2 === 0 ? GRADIENTS.purple : GRADIENTS.blue,
                                borderRadius: 20,
                              }}
                            />
                          </CProgress>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-body-secondary py-5">
                  <CIcon icon={cilUser} size="3xl" className="mb-3" />
                  <p className="fw-semibold mb-1">No articles published today</p>
                  <small>Today&apos;s author rankings will appear here.</small>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Publishing activity and recent news */}
      <CRow className="g-4">
        <CCol xs={12} xl={7}>
          <CCard className="h-100" style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              {panelHeading(
                cilPencil,
                'News Publishing Activity',
                'Published articles created over the last seven days',
                COLORS.green,
              )}

              <div style={{ height: 285, width: '100%', minWidth: 0 }}>
                <CChartLine
                  data={{
                    labels: analytics.lastSevenDays.map((day) =>
                      day.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      }),
                    ),
                    datasets: [
                      {
                        label: 'Published news',
                        data: analytics.dailyPublishingCounts,
                        borderColor: COLORS.blue,
                        backgroundColor: 'rgba(37,99,235,0.12)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: COLORS.blue,
                        pointBorderWidth: 3,
                        pointRadius: 5,
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                        grid: { color: '#edf1f7' },
                      },
                      x: {
                        grid: { display: false },
                      },
                    },
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} xl={5}>
          <CCard className="h-100" style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              <div className="d-flex align-items-start justify-content-between gap-2">
                {panelHeading(
                  cilNewspaper,
                  'Recent News',
                  'Latest content and publishing status',
                  COLORS.red,
                )}
                <span
                  className="small fw-semibold"
                  style={{ color: COLORS.red, whiteSpace: 'nowrap' }}
                >
                  Latest
                  <CIcon icon={cilArrowRight} className="ms-1" />
                </span>
              </div>

              {analytics.recentNews.length > 0 ? (
                analytics.recentNews.map((item) => {
                  const created = getValidDate(item.createdAt)
                  const published = Number(item.type) === 1

                  return (
                    <div
                      key={item._id}
                      className="py-3"
                      style={{
                        borderBottom: '1px solid #edf0f6',
                        minWidth: 0,
                        width: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        className="fw-semibold mb-2"
                        title={getTitle(item)}
                        style={{
                          fontSize: '0.91rem',
                          lineHeight: 1.55,
                          color: '#1e293b',
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {getTitle(item)}
                      </div>

                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                        <div
                          className="text-body-secondary small"
                          style={{
                            minWidth: 0,
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {getAuthorName(item)}
                          {' · '}
                          {created ? created.toLocaleDateString('en-IN') : 'Date unavailable'}
                        </div>

                        <CBadge
                          className="px-2 py-1"
                          style={{
                            color: published ? '#047857' : '#b45309',
                            background: published ? '#d1fae5' : '#fef3c7',
                            flexShrink: 0,
                          }}
                        >
                          {published ? 'Published' : 'Draft'}
                        </CBadge>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center text-body-secondary py-5">
                  <CIcon icon={cilNewspaper} size="3xl" className="mb-3" />
                  <p className="mb-0">No news found.</p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
