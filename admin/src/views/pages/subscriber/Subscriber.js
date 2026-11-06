import React, { useEffect, useMemo, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CPagination,
  CPaginationItem,
  CFormInput,
  CSpinner,
  CAlert,
} from '@coreui/react'
import setting from '../../../setting.json'
import secureLocalStorage from 'react-secure-storage'

const Subscriber = () => {
  const [customerList, setCustomerList] = useState([])
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const itemsPerPage = 10

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError('')

      const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || 'null')

      const token = loginInfo?.token

      const response = await fetch(`${setting.api}/api/customer/getAllCustomer`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch customers')
      }

      setCustomerList(result.data || [])
    } catch (err) {
      console.error('Error fetching customers:', err)
      setError(err.message || 'Unable to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    const search = searchText.trim().toLowerCase()

    return customerList.filter((customer) => {
      return (
        (customer.name || '').toLowerCase().includes(search) ||
        (customer.email || '').toLowerCase().includes(search) ||
        (customer.phone || '').toLowerCase().includes(search) ||
        (customer.status || '').toLowerCase().includes(search)
      )
    })
  }, [customerList, searchText])

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const formatDate = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const handleSearch = (value) => {
    setSearchText(value)
    setCurrentPage(1)
  }

  return (
    <CCard className="shadow-sm border-0 rounded-4">
      <CCardHeader className="bg-dark text-white px-4 py-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <h5 className="mb-0 fw-bold">Subscribers / Customers</h5>

          <div className="d-flex align-items-center gap-2">
            <span className="small">Total: {filteredCustomers.length}</span>

            <CButton color="light" size="sm" onClick={fetchCustomers} disabled={loading}>
              Refresh
            </CButton>
          </div>
        </div>
      </CCardHeader>

      <CCardBody>
        <div className="mb-3">
          <CFormInput
            type="text"
            placeholder="Search by name, email, phone or status..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {error && (
          <CAlert color="danger" dismissible onClose={() => setError('')}>
            {error}
          </CAlert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <div className="mt-2">Loading customers...</div>
          </div>
        ) : (
          <>
            <CTable align="middle" hover responsive bordered>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Phone</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Registration Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer, index) => (
                    <CTableRow key={customer._id}>
                      <CTableDataCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </CTableDataCell>

                      <CTableDataCell>{customer.name || '-'}</CTableDataCell>

                      <CTableDataCell>{customer.email || '-'}</CTableDataCell>

                      <CTableDataCell>{customer.phone || '-'}</CTableDataCell>

                      <CTableDataCell>
                        <span
                          className={`badge ${
                            customer.status === 'active'
                              ? 'bg-success'
                              : customer.status === 'blocked'
                                ? 'bg-danger'
                                : 'bg-secondary'
                          }`}
                        >
                          {customer.status || 'Unknown'}
                        </span>
                      </CTableDataCell>

                      <CTableDataCell>{formatDate(customer.createdAt)}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center py-4">
                      {searchText ? 'No customers match your search.' : 'No customers found.'}
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <CPagination aria-label="Customer pagination">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
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
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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

export default Subscriber
