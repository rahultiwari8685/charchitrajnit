import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormCheck,
  CButton,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CSpinner,
  CProgress,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  CPagination,
  CPaginationItem,
  CBadge,
} from '@coreui/react'

import setting from '../../../setting.json'
import secureLocalStorage from 'react-secure-storage'
import { cilPencil, cilPeople, cilChart, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Polls = () => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsType, setDetailsType] = useState('voters')
  const [detailsData, setDetailsData] = useState(null)

  const [pollList, setPollList] = useState([])

  const [editingPoll, setEditingPoll] = useState(null)
  const [visible, setVisible] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [showResult, setShowResult] = useState(true)

  const [loading, setLoading] = useState(false)

  const getToken = () => {
    const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')

    return loginInfo?.token || ''
  }

  const allPollList = async () => {
    try {
      const response = await fetch(`${setting.api}/api/polls/admin`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      })

      const result = await response.json()

      console.log('Poll API Response:', result)

      if (result.success === true) {
        setPollList(result.data || [])
      } else {
        console.error('Poll API Error:', result.message)
      }
    } catch (error) {
      console.error('Error loading polls:', error)
    }
  }

  const openPollDetails = async (poll, type) => {
    setDetailsType(type)
    setDetailsVisible(true)
    setDetailsLoading(true)
    setDetailsData(null)

    try {
      const endpoint =
        type === 'voters'
          ? `${setting.api}/api/polls/admin/${poll._id}/voters`
          : `${setting.api}/api/polls/${poll._id}/results`

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      })

      const result = await response.json()

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || 'Failed to load poll details')
      }

      setDetailsData(result.data)
    } catch (error) {
      console.error('Poll Details Error:', error)
      alert(error.message || 'Failed to load poll details')
      setDetailsVisible(false)
    } finally {
      setDetailsLoading(false)
    }
  }

  useEffect(() => {
    allPollList()
  }, [])

  const resetForm = () => {
    setQuestion('')
    setOptions(['', ''])
    setStartDate('')
    setEndDate('')
    setShowResult(true)
  }

  const openCreate = () => {
    setEditingPoll(null)
    resetForm()
    setVisible(true)
  }

  const handleEdit = (poll) => {
    setEditingPoll(poll)

    setQuestion(poll.question || '')

    setOptions(
      poll.options?.length >= 2 ? poll.options.map((option) => option.text || '') : ['', ''],
    )

    setStartDate(poll.start_date ? new Date(poll.start_date).toISOString().substring(0, 16) : '')

    setEndDate(poll.end_date ? new Date(poll.end_date).toISOString().substring(0, 16) : '')

    setShowResult(poll.show_result !== undefined ? poll.show_result : true)

    setVisible(true)
  }

  const handleDelete = async (poll) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${poll.question}"? This will also delete its votes.`,
    )

    if (!confirmed) return

    try {
      const response = await fetch(`${setting.api}/api/polls/admin/${poll._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      })

      const result = await response.json()

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || 'Failed to delete poll')
      }

      alert('Poll deleted successfully')

      // Refresh the poll list
      await allPollList()
    } catch (error) {
      console.error('Delete Poll Error:', error)
      alert(error.message || 'Failed to delete poll')
    }
  }

  const addOption = () => {
    setOptions([...options, ''])
  }

  // ==========================================
  // UPDATE OPTION
  // ==========================================

  const updateOption = (index, value) => {
    const updated = [...options]

    updated[index] = value

    setOptions(updated)
  }

  // ==========================================
  // REMOVE OPTION
  // ==========================================

  const removeOption = (index) => {
    if (options.length <= 2) {
      return
    }

    setOptions(options.filter((_, i) => i !== index))
  }

  // ==========================================
  // SAVE / UPDATE POLL
  // ==========================================

  const savePoll = async (e) => {
    e.preventDefault()

    if (loading) {
      return
    }

    // ==========================================
    // QUESTION VALIDATION
    // ==========================================

    if (!question.trim()) {
      alert('Poll question is required')
      return
    }

    // ==========================================
    // OPTIONS
    // ==========================================

    const cleanedOptions = options.map((option) => option.trim()).filter((option) => option !== '')

    if (cleanedOptions.length < 2) {
      alert('Please add at least 2 options')
      return
    }

    // ==========================================
    // DATE VALIDATION
    // ==========================================

    if (!startDate) {
      alert('Start date is required')
      return
    }

    if (!endDate) {
      alert('End date is required')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end <= start) {
      alert('End date must be after start date')
      return
    }

    // ==========================================
    // PAYLOAD
    // ==========================================

    const payload = {
      question: question.trim(),

      options: cleanedOptions.map((text) => ({
        text,
      })),

      start_date: startDate,

      end_date: endDate,

      show_result: showResult,
    }

    try {
      setLoading(true)

      const endpoint = editingPoll
        ? `${setting.api}/api/polls/admin/${editingPoll._id}`
        : `${setting.api}/api/polls/savePoll`

      const method = editingPoll ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      console.log('Save Poll Response:', result)

      if (result.success === true) {
        alert(editingPoll ? 'Poll updated successfully' : 'Poll created successfully')

        await allPollList()

        resetForm()

        setEditingPoll(null)

        setVisible(false)
      } else {
        alert(result.message || 'Failed to save poll')
      }
    } catch (error) {
      console.error('Save Poll Error:', error)

      alert('Something went wrong while saving poll')
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // GET STATUS
  // ==========================================

  const getStatus = (poll) => {
    const now = new Date()

    const start = new Date(poll.start_date)

    const end = new Date(poll.end_date)

    if (now < start) {
      return 'Scheduled'
    }

    if (now > end) {
      return 'Expired'
    }

    return 'Active'
  }

  // ==========================================
  // STATUS COLOR
  // ==========================================

  const getStatusColor = (status) => {
    if (status === 'Active') {
      return 'success'
    }

    if (status === 'Scheduled') {
      return 'info'
    }

    return 'secondary'
  }

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(pollList.length / itemsPerPage)

  const paginatedItems = pollList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div>
      <CCard className="shadow border-0 rounded-4">
        {/* HEADER */}

        <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-bar-chart-fill me-2 text-warning"></i>
              Poll Management
            </h5>

            <CButton
              color="light"
              variant="outline"
              className="fw-semibold px-3 shadow-sm rounded-pill"
              onClick={openCreate}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Poll
            </CButton>
          </div>
        </CCardHeader>

        {/* BODY */}

        <CCardBody>
          <CTable striped responsive bordered hover>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>

                <CTableHeaderCell>Question</CTableHeaderCell>

                <CTableHeaderCell>Options</CTableHeaderCell>

                <CTableHeaderCell>Status</CTableHeaderCell>

                <CTableHeaderCell>Start</CTableHeaderCell>

                <CTableHeaderCell>End</CTableHeaderCell>

                <CTableHeaderCell>Result</CTableHeaderCell>

                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {paginatedItems.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="text-center py-4">
                    No Poll Found
                  </CTableDataCell>
                </CTableRow>
              ) : (
                paginatedItems.map((poll, index) => {
                  const actualIndex = (currentPage - 1) * itemsPerPage + index

                  const status = getStatus(poll)

                  return (
                    <CTableRow key={poll._id}>
                      <CTableDataCell>{actualIndex + 1}</CTableDataCell>

                      <CTableDataCell>
                        <strong>{poll.question}</strong>
                      </CTableDataCell>

                      <CTableDataCell>{poll.options?.length || 0}</CTableDataCell>

                      <CTableDataCell>
                        <CBadge color={getStatusColor(status)}>{status}</CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        {poll.start_date ? new Date(poll.start_date).toLocaleString('en-IN') : '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {poll.end_date ? new Date(poll.end_date).toLocaleString('en-IN') : '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        <span
                          className={`badge ${poll.show_result ? 'bg-success' : 'bg-secondary'}`}
                        >
                          {poll.show_result ? 'Shown' : 'Hidden'}
                        </span>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="d-flex flex-wrap gap-2">
                          <CButton
                            size="sm"
                            color="warning"
                            className="rounded-pill px-3 fw-semibold"
                            onClick={() => handleEdit(poll)}
                          >
                            <CIcon icon={cilPencil} className="me-1" />
                            Edit
                          </CButton>
                          <CButton
                            size="sm"
                            color="danger"
                            className="rounded-pill px-3 fw-semibold"
                            onClick={() => handleDelete(poll)}
                          >
                            <CIcon icon={cilTrash} className="me-1" />
                            Delete
                          </CButton>

                          <CButton
                            size="sm"
                            color="primary"
                            className="rounded-pill px-3 fw-semibold"
                            onClick={() => openPollDetails(poll, 'results')}
                          >
                            <CIcon icon={cilChart} className="me-1" />
                            Results
                          </CButton>

                          <CButton
                            size="sm"
                            color="success"
                            className="rounded-pill px-3 fw-semibold"
                            onClick={() => openPollDetails(poll, 'voters')}
                          >
                            <CIcon icon={cilPeople} className="me-1" />
                            Voters
                          </CButton>
                        </div>
                      </CTableDataCell>

                      {/* <CTableDataCell>
                        <CButton
                          size="sm"
                          color="warning"
                          className="rounded-pill px-3 shadow-sm fw-semibold"
                          onClick={() => handleEdit(poll)}
                        >
                          <CIcon
                            icon={cilPencil}
                            style={{
                              marginRight: '5px',
                            }}
                          />
                          Edit
                        </CButton>
                      </CTableDataCell> */}
                    </CTableRow>
                  )
                })
              )}
            </CTableBody>
          </CTable>

          {/* PAGINATION */}

          {totalPages > 0 && (
            <div className="d-flex justify-content-end mt-3">
              <CPagination align="end">
                {[...Array(totalPages)].map((_, idx) => (
                  <CPaginationItem
                    key={idx + 1}
                    active={currentPage === idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </CPaginationItem>
                ))}
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* ==========================================
          CREATE / EDIT OFFCANVAS
      ========================================== */}

      <COffcanvas
        placement="end"
        visible={visible}
        onHide={() => {
          setVisible(false)
          setEditingPoll(null)
          resetForm()
        }}
        backdrop={true}
        style={{
          width: '500px',
        }}
      >
        <COffcanvasHeader className="bg-dark text-white fw-bold" closeButton>
          {editingPoll ? 'Update Poll' : 'Create Poll'}
        </COffcanvasHeader>

        <COffcanvasBody>
          <CForm onSubmit={savePoll}>
            {/* QUESTION */}

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Poll Question"
                  placeholder="Enter Poll Question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </CCol>
            </CRow>

            {/* OPTIONS */}

            <CRow className="mb-3">
              <CCol md={12}>
                <label className="fw-bold mb-2">Poll Options</label>

                {options.map((option, index) => (
                  <div key={index} className="d-flex mb-2">
                    <CFormInput
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      required
                    />

                    {options.length > 2 && (
                      <CButton
                        type="button"
                        color="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => removeOption(index)}
                      >
                        ✕
                      </CButton>
                    )}
                  </div>
                ))}

                <CButton type="button" color="secondary" size="sm" onClick={addOption}>
                  + Add Option
                </CButton>
              </CCol>
            </CRow>

            {/* DATE */}

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  type="datetime-local"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="datetime-local"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </CCol>
            </CRow>

            {/* SHOW RESULT */}

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormCheck
                  label="Show Result After Vote"
                  checked={showResult}
                  onChange={(e) => setShowResult(e.target.checked)}
                />
              </CCol>
            </CRow>

            {/* BUTTON */}

            <div className="d-flex justify-content-end">
              <CButton
                type="submit"
                color={editingPoll ? 'warning' : 'success'}
                className="rounded-pill px-4 shadow-sm fw-semibold"
                disabled={loading}
              >
                <i className={`bi ${editingPoll ? 'bi-arrow-repeat' : 'bi-check-circle'} me-2`}></i>

                {loading ? 'Saving...' : editingPoll ? 'Update Poll' : 'Save Poll'}
              </CButton>
            </div>
          </CForm>
        </COffcanvasBody>
      </COffcanvas>

      <CModal
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        size="xl"
        alignment="center"
        scrollable
      >
        <CModalHeader>
          <CModalTitle className="fw-bold">
            {detailsType === 'voters' ? 'Poll Voter Details' : 'Poll Results'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          {detailsLoading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3 mb-0">Loading poll details...</p>
            </div>
          ) : detailsData ? (
            <>
              <div className="p-3 mb-4 bg-light rounded-3">
                <h5 className="fw-bold mb-2">
                  {detailsData.poll?.question || detailsData.question}
                </h5>

                <div className="text-muted">
                  Total votes:{' '}
                  <strong>
                    {detailsType === 'voters'
                      ? (detailsData.totalVoters ?? 0)
                      : (detailsData.totalVotes ?? 0)}
                  </strong>
                </div>
              </div>

              {detailsType === 'voters' ? (
                <CTable responsive bordered hover striped>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Voter Name</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Phone</CTableHeaderCell>
                      <CTableHeaderCell>Selected Option</CTableHeaderCell>
                      <CTableHeaderCell>Voted At</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {detailsData.voters?.length ? (
                      detailsData.voters.map((voter, index) => (
                        <CTableRow key={voter.vote_id || voter.customer_id || index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{voter.name || 'Unknown voter'}</CTableDataCell>
                          <CTableDataCell>{voter.email || '-'}</CTableDataCell>
                          <CTableDataCell>{voter.phone || '-'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="primary">{voter.option_text || 'Unknown option'}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            {voter.voted_at
                              ? new Date(voter.voted_at).toLocaleString('en-IN')
                              : '-'}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={6} className="text-center py-4">
                          No votes have been submitted yet.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {detailsData.options?.map((option, index) => {
                    const votes = Number(option.votes || 0)
                    const percentage = Number(option.percentage || 0)

                    return (
                      <div key={index} className="border rounded-3 p-3">
                        <div className="d-flex justify-content-between gap-3 mb-2">
                          <strong>{option.text || `Option ${index + 1}`}</strong>
                          <span className="text-nowrap">
                            {votes} votes ({percentage}%)
                          </span>
                        </div>

                        <CProgress
                          height={10}
                          value={percentage}
                          color={index % 2 === 0 ? 'primary' : 'success'}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            <p className="text-center py-4 mb-0">No poll details available.</p>
          )}
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Polls
