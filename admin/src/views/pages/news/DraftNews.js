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

const DraftNews = () => {
  const [newsList, setNewsList] = useState([])
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [userList, setUserList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 30

  const userRole = JSON.parse(secureLocalStorage.getItem('logininfo')).role

  console.log('User role from storage:', userRole)

  const fetchNews = async () => {
    try {
      const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo'))

      const token = loginInfo?.token

      const res = await fetch(setting.api + '/api/news/getAllDraftNews?page=1&limit=100', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch draft news')
      }

      const draftNews = (data.data || []).sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      )

      console.log('Draft News:', draftNews.length)

      setNewsList(draftNews)
    } catch (error) {
      console.error('Error fetching draft news:', error)
    }
  }

  useEffect(() => {
    fetchNews()
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
        toast.success('Draft deleted successfully')

        // optional: remove from UI
        setNewsList((prev) => prev.filter((item) => item._id !== id))
        fetchNews()
      }
      toast.error(data.message || 'Delete failed')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const filteredNews = newsList.filter((news) =>
    news.title.toLowerCase().includes(searchText.toLowerCase()),
  )

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
            <i className="bi bi-play-circle-fill me-2 text-danger"></i> Draft News
          </h5>
        </div>
      </CCardHeader>

      <CCardBody>
        <CTable align="middle" hover responsive bordered>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Title</CTableHeaderCell>
              <CTableHeaderCell scope="col">Category</CTableHeaderCell>
              <CTableHeaderCell scope="col">Author</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date & Time</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {paginatedItems.map((news, index) => {
              const actualIndex = (currentPage - 1) * itemsPerPage + index
              return (
                <CTableRow key={news.id}>
                  <CTableDataCell>{actualIndex + 1}</CTableDataCell>
                  <CTableDataCell>{news.title}</CTableDataCell>

                  <CTableDataCell>
                    {news.categories && news.categories.length > 0
                      ? news.categories.map((cat) => cat.name).join(', ')
                      : '-'}
                  </CTableDataCell>

                  <CTableDataCell> {news.author?.name || 'N/A'}</CTableDataCell>

                  <CTableDataCell>
                    {new Date(news.updatedAt || news.createdAt).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </CTableDataCell>

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
              )
            })}
          </CTableBody>
        </CTable>

        <div className="d-flex justify-content-center mt-4">
          <CPagination align="center">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </CPaginationItem>

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

export default DraftNews
