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

const DeletedNews = () => {
  const [newsList, setNewsList] = useState([])
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [userList, setUserList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 30

  const fetchNews = async () => {
    try {
      const token = JSON.parse(secureLocalStorage.getItem('logininfo')).token

      const res = await fetch(setting.api + '/api/news/getAllNews', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const data = await res.json()

      // Show only type = 0 news
      const filteredNews = (data.data || []).filter((item) => Number(item.type) === 0)

      setNewsList(filteredNews)
    } catch (error) {
      console.error('Error fetching news:', error)
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
        console.log('Deleted successfully')

        // optional: remove from UI
        setBlogs((prev) => prev.filter((item) => item._id !== id))
        fetchNews()
      }
    } catch (error) {
      console.error('Delete Error:', error)
    }
  }

  const filteredNews = newsList.filter(
    (news) =>
      Number(news.type) === 0 && news.title.toLowerCase().includes(searchText.toLowerCase()),
  )

  // Total pages from filtered data
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)

  // Pagination from filtered data
  const paginatedItems = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <CCard className="shadow-sm border-0 rounded-4">
      <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-play-circle-fill me-2 text-danger"></i> Deleted News
          </h5>
        </div>
      </CCardHeader>

      <CCardBody>
        <CForm className="mb-4">
          <CRow className="g-3">
            {/* <CCol md={3}>
              <CFormLabel htmlFor="fromDate">From Date</CFormLabel>
              <CFormInput type="date" id="fromDate" />
            </CCol>
            <CCol md={3}>
              <CFormLabel htmlFor="toDate">To Date</CFormLabel>
              <CFormInput type="date" id="toDate" />
            </CCol> */}
            <CCol md={12}>
              <CFormInput
                type="text"
                id="searchText"
                placeholder="Search by Title"
                value={searchText} // bind state
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
              {/* <CTableHeaderCell scope="col">Date</CTableHeaderCell> */}
              {/* <CTableHeaderCell scope="col">Action</CTableHeaderCell> */}
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

                  <CTableDataCell>{getUserName(news.user_id)}</CTableDataCell>
                  {/* <CTableDataCell>{new Date(news.created_at).toLocaleDateString()}</CTableDataCell> */}

                  {/* <CTableDataCell>
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
                  </CTableDataCell> */}
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

export default DeletedNews
