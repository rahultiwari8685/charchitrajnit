import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CFormLabel,
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

const PublishedNews = () => {
  const [newsList, setNewsList] = useState([])
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [userList, setUserList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 30

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')

  const [categoryList, setCategoryList] = useState([])

  const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')

  const userRole = loginInfo.role || ''

  console.log('User role from storage:', userRole)

  const fetchNews = async () => {
    try {
      const token = JSON.parse(secureLocalStorage.getItem('logininfo')).token

      const res = await fetch(`${setting.api}/api/news/getAllNews?lang=hi`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const data = await res.json()

      // 1 month ago date
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      // const filteredNews = (data.data || []).filter((item) => {
      //   const newsDate = new Date(item.createdAt)

      //   return item.type === 1 && newsDate >= oneMonthAgo
      // })

      const currentUserId = String(loginInfo?.user?.id || '')

      const filteredNews = (data.data || []).filter((item) => {
        const newsDate = new Date(item.createdAt)

        const isPublished = Number(item.type) === 1
        const isWithinOneMonth = newsDate >= oneMonthAgo

        const authorId =
          typeof item.author === 'object' ? item.author?._id || item.author?.id : item.author

        const authorMatch = String(userRole) !== '3' || String(authorId || '') === currentUserId

        return isPublished && isWithinOneMonth && authorMatch
      })

      setNewsList(filteredNews)

      setNewsList(filteredNews)
    } catch (error) {
      console.error('Error fetching news:', error)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchCategories = async () => {
    const res = await fetch(setting.api + '/api/categories/getAllCategory')
    const data = await res.json()

    if (data.success) {
      setCategoryList(data.data)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const allUserList = async () => {
    await fetch(setting.api + '/api/users/getAllUser', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
      },
    })
      .then((response) => response.json())
      .then((u) => {
        if (u.status == false) {
          // secureLocalStorage.clear();
          navigate('/login')
        } else {
          setUserList(u.data)
        }
      })
  }

  useEffect(() => {
    allUserList()
  }, [])

  const getUserName = (id) => {
    console.log(id)
    const user = userList.find((c) => String(c.id) === String(id))
    return user ? user.name : 'N/A'
  }

  const handleEdit = (news) => {
    navigate(`/UpdateNews/${news._id}`)
  }

  function handleDelete(id) {
    var ans = confirm('Are you sure For Delete?')
    console.log(ans)

    if (ans == true) {
      deleteNews(id)
    }
  }

  const deleteNews = async (id) => {
    try {
      const response = await fetch(`${setting.api}/api/news/deleteNews/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      fetchNews()

      if (data.status === true) {
        setNewsList((prev) => prev.filter((item) => item._id !== id))

        toast.success('News deleted successfully')
      } else {
        toast.error(data.message || 'Delete failed')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const filteredNews = newsList.filter((news) => {
    const titleMatch = news.title?.toLowerCase().includes(searchText.toLowerCase())

    const authorMatch = !selectedAuthor || news.author?._id === selectedAuthor

    const categoryMatch =
      !selectedCategory || news.categories?.some((cat) => cat._id === selectedCategory)

    const newsDate = new Date(news.createdAt)

    const fromMatch = !fromDate || newsDate >= new Date(fromDate)

    const toMatch = !toDate || newsDate <= new Date(new Date(toDate).setHours(23, 59, 59))

    return titleMatch && authorMatch && categoryMatch && fromMatch && toMatch
  })

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)

  const paginatedItems = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <CCard className="shadow-sm border-0 rounded-4">
      <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-play-circle-fill me-2 text-danger"></i> Published News
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

                {categoryList.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
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
                  <option key={user._id} value={user._id}>
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

        <CTable align="middle" hover responsive bordered>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Title</CTableHeaderCell>
              <CTableHeaderCell scope="col">Category</CTableHeaderCell>
              <CTableHeaderCell scope="col">Author</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date & Time</CTableHeaderCell>
              <CTableHeaderCell>Views</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {paginatedItems.map((news, index) => {
              const actualIndex = (currentPage - 1) * itemsPerPage + index
              return (
                <CTableRow key={news._id}>
                  <CTableDataCell>{actualIndex + 1}</CTableDataCell>

                  <CTableDataCell>
                    <a
                      href={`https://bharat19express.com/${news.categories?.[0]?.slug}/${news.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: 'none',
                        color: '#0d6efd',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      {news.title}
                    </a>
                  </CTableDataCell>
                  {/* <CTableDataCell>{news.title}</CTableDataCell> */}

                  <CTableDataCell>
                    {news.categories && news.categories.length > 0
                      ? news.categories.map((cat) => cat.name).join(', ')
                      : '-'}
                  </CTableDataCell>

                  <CTableDataCell> {news.author?.name || 'N/A'}</CTableDataCell>

                  <CTableDataCell>
                    {new Date(news.createdAt).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </CTableDataCell>

                  <CTableDataCell>{news.views || 0}</CTableDataCell>

                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="primary"
                      className="rounded-pill px-3 shadow-sm fw-semibold"
                      onClick={() => handleEdit(news)}
                    >
                      <CIcon icon={cilPencil} /> Edit
                    </CButton>{' '}
                    {String(userRole) !== '3' && (
                      <CButton
                        size="sm"
                        color="danger"
                        className="rounded-pill px-3 shadow-sm fw-semibold"
                        onClick={() => handleDelete(news._id)}
                      >
                        <CIcon icon={cilTrash} /> Delete
                      </CButton>
                    )}
                    {/* <CButton
                      size="sm"
                      color="danger"
                      className="rounded-pill px-3 shadow-sm fw-semibold"
                      onClick={() => handleDelete(news._id)}
                    >
                      <CIcon icon={cilTrash} /> Delete
                    </CButton> */}
                  </CTableDataCell>
                </CTableRow>
              )
            })}
          </CTableBody>
        </CTable>

        <div className="d-flex justify-content-center mt-4">
          <CPagination align="center">
            {/* Previous Button */}
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </CPaginationItem>

            {/* Dynamic Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2),
              )
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && page - arr[idx - 1] > 1 && (
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

            {/* Next Button */}
            <CPaginationItem
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </CPaginationItem>
          </CPagination>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default PublishedNews
