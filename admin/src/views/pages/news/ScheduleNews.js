import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CForm,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { cilTrash, cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import setting from '../../../setting.json'
import secureLocalStorage from 'react-secure-storage'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const ScheduleNews = () => {
  const [newsList, setNewsList] = useState([])
  const [searchText, setSearchText] = useState('')
  const [userList, setUserList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [categoryList, setCategoryList] = useState([])

  const navigate = useNavigate()
  const itemsPerPage = 30

  const getLoginInfo = () => {
    const loginInfo = secureLocalStorage.getItem('logininfo')
    return typeof loginInfo === 'string' ? JSON.parse(loginInfo) : loginInfo
  }

  const fetchNews = async () => {
    try {
      setLoading(true)

      const loginInfo = getLoginInfo()

      const res = await fetch(setting.api + '/api/news/getScheduleNews', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + loginInfo?.token,
        },
      })

      const data = await res.json()

      if (!res.ok || data.status === false) {
        throw new Error(data.message || 'Failed to fetch scheduled news')
      }

      setNewsList(data.data || [])
    } catch (error) {
      console.error('Error fetching scheduled news:', error)
      toast.error(error.message || 'Failed to fetch scheduled news')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(setting.api + '/api/categories/getAllCategory')

      const data = await res.json()

      if (data.success) {
        setCategoryList(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const allUserList = async () => {
    try {
      const loginInfo = getLoginInfo()

      const response = await fetch(setting.api + '/api/users/getAllUser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + loginInfo?.token,
        },
      })

      const data = await response.json()

      if (data.status === false) {
        navigate('/login')
        return
      }

      setUserList(data.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchNews()
    fetchCategories()
    allUserList()
  }, [])

  const handleEdit = (news) => {
    navigate(`/UpdateNews/${news._id}`)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheduled news?')) {
      return
    }

    try {
      const response = await fetch(`${setting.api}/api/news/deleteNews/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok || data.status !== true) {
        throw new Error(data.message || 'Delete failed')
      }

      setNewsList((prev) => prev.filter((item) => item._id !== id))
      toast.success('Scheduled news deleted successfully')
    } catch (error) {
      console.error('Delete scheduled news error:', error)
      toast.error(error.message || 'Something went wrong')
    }
  }

  const filteredNews = newsList.filter((news) => {
    const titleMatch = (news.title || '').toLowerCase().includes(searchText.toLowerCase())

    const authorId = typeof news.author === 'object' ? news.author?._id : news.author

    const authorMatch = !selectedAuthor || String(authorId) === String(selectedAuthor)

    const categoryMatch =
      !selectedCategory ||
      news.categories?.some((category) => String(category._id) === String(selectedCategory))

    const dateValue = news.scheduledAt || news.createdAt
    const newsDate = dateValue ? new Date(dateValue) : null

    const fromMatch = !fromDate || (newsDate && newsDate >= new Date(`${fromDate}T00:00:00`))

    const toMatch = !toDate || (newsDate && newsDate <= new Date(`${toDate}T23:59:59.999`))

    return titleMatch && authorMatch && categoryMatch && fromMatch && toMatch
  })

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)

  const paginatedItems = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchText, selectedAuthor, selectedCategory, fromDate, toDate])

  const formatScheduledDate = (date) => {
    if (!date) return 'Not scheduled'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return 'Invalid date'

    return parsedDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <CCard className="shadow-sm border-0 rounded-4">
      <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-file-earmark-text-fill me-2 text-warning"></i>
            Schedule News ({filteredNews.length})
          </h5>
        </div>
      </CCardHeader>

      <CCardBody>
        <CForm className="mb-4">
          <CRow className="g-3">
            <CCol md={3}>
              <CFormInput
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </CCol>

            <CCol md={3}>
              <CFormInput type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </CCol>

            <CCol md={3}>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categoryList.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </CCol>

            <CCol md={3}>
              <select
                className="form-select"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
              >
                <option value="">All Authors</option>
                {userList.map((user) => (
                  <option key={user._id || user.id} value={user._id || user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </CCol>

            <CCol md={12}>
              <CFormInput
                placeholder="Search by Title"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </CCol>
          </CRow>
        </CForm>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <>
            <CTable align="middle" hover responsive bordered>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Author</CTableHeaderCell>
                  <CTableHeaderCell>Scheduled At</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((news, index) => (
                    <CTableRow key={news._id}>
                      <CTableDataCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </CTableDataCell>

                      <CTableDataCell>{news.title}</CTableDataCell>

                      <CTableDataCell>
                        {news.categories?.length
                          ? news.categories.map((category) => category.name).join(', ')
                          : '-'}
                      </CTableDataCell>

                      <CTableDataCell>{news.author?.name || 'N/A'}</CTableDataCell>

                      <CTableDataCell>{formatScheduledDate(news.scheduledAt)}</CTableDataCell>

                      <CTableDataCell>
                        <CButton
                          size="sm"
                          color="primary"
                          className="rounded-pill px-3 shadow-sm fw-semibold"
                          onClick={() => handleEdit(news)}
                        >
                          <CIcon icon={cilPencil} /> Edit
                        </CButton>{' '}
                        <CButton
                          size="sm"
                          color="danger"
                          className="rounded-pill px-3 shadow-sm fw-semibold"
                          onClick={() => handleDelete(news._id)}
                        >
                          <CIcon icon={cilTrash} /> Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center py-4">
                      No scheduled news found.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <CPagination align="center">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                  >
                    Previous
                  </CPaginationItem>

                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2),
                    )
                    .map((page, index, pages) => (
                      <React.Fragment key={page}>
                        {index > 0 && page - pages[index - 1] > 1 && (
                          <CPaginationItem disabled>...</CPaginationItem>
                        )}

                        <CPaginationItem
                          active={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </CPaginationItem>
                      </React.Fragment>
                    ))}

                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => page + 1)}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default ScheduleNews
