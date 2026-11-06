import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CRow,
  CCol,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  CPagination,
  CPaginationItem,
} from '@coreui/react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import secureLocalStorage from 'react-secure-storage'
import setting from '../../../setting.json'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  position: yup.string().required('Position is required'),
  priority: yup.number().required(),
  redirectUrl: yup.string(),
  image: yup.mixed(),
})

const Advertisement = () => {
  const [advertisements, setAdvertisements] = useState([])
  const [editingAdvertisement, setEditingAdvertisement] = useState(null)
  const [visible, setVisible] = useState(false)
  const [preview, setPreview] = useState('')
  const [search, setSearch] = useState('')

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const imageDimensions = {
    homepage_top: { width: 640, height: 85 },
    homepage_middle: { width: 1200, height: 100 },
    homepage_bottom: { width: 670, height: 85 },

    article_top: { width: 900, height: 250 },
    article_middle: { width: 900, height: 250 },
    article_bottom: { width: 1200, height: 100 },

    sidebar: { width: 390, height: 312 },

    footer: { width: 1200, height: 200 },

    popup: { width: 600, height: 600 },
  }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const selectedPosition = watch('position')

  useEffect(() => {
    if (editingAdvertisement) {
      reset({
        title: editingAdvertisement.title,
        position: editingAdvertisement.position,
        priority: editingAdvertisement.priority,
        redirectUrl: editingAdvertisement.redirectUrl,
        status: editingAdvertisement.status,
      })

      setPreview(`${setting.api}/uploads/advertisements/${editingAdvertisement.image}`)
    }
  }, [editingAdvertisement])

  const getAdvertisements = async () => {
    try {
      const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token

      const res = await fetch(`${setting.api}/api/advertisements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (data.success) {
        setAdvertisements(data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAdvertisements()
  }, [])

  const validateImageDimensions = (file, position) => {
    return new Promise((resolve, reject) => {
      const required = imageDimensions[position]

      if (!required) {
        reject(new Error('Please select a valid advertisement position'))
        return
      }

      const image = new Image()
      const objectUrl = URL.createObjectURL(file)

      image.onload = () => {
        const { width, height } = image
        URL.revokeObjectURL(objectUrl)

        if (width !== required.width || height !== required.height) {
          reject(
            new Error(
              `Invalid image dimensions.\n` +
                `Required: ${required.width} × ${required.height}px\n` +
                `Selected: ${width} × ${height}px`,
            ),
          )
          return
        }

        resolve(true)
      }

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Unable to read image. Please select a valid image.'))
      }

      image.src = objectUrl
    })
  }

  const saveAdvertisement = async (data) => {
    if (saving) return

    try {
      const file = data.image?.[0]

      // Validate the image before uploading
      if (file) {
        const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

        if (file.size > MAX_SIZE) {
          alert('Image must be less than 2 MB')
          return
        }

        await validateImageDimensions(file, data.position)
      } else if (!editingAdvertisement) {
        alert('Please select an advertisement image')
        return
      }

      // Upload starts only after validation succeeds
      setSaving(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('position', data.position)
      formData.append('priority', data.priority)
      formData.append('redirectUrl', data.redirectUrl || '')
      formData.append('status', data.status)

      if (file) {
        formData.append('image', file)
      }

      const token = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')?.token

      const endpoint = editingAdvertisement
        ? `/api/advertisements/update/${editingAdvertisement._id}`
        : '/api/advertisements/create'

      const response = await axios({
        url: setting.api + endpoint,
        method: editingAdvertisement ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
        onUploadProgress: (event) => {
          if (event.total) {
            setUploadProgress(Math.round((event.loaded * 100) / event.total))
          }
        },
      })

      const result = response.data

      if (result.success) {
        await getAdvertisements()
        setVisible(false)
        reset()
        setPreview('')
        setEditingAdvertisement(null)
      } else {
        alert(result.message || 'Failed to save advertisement')
      }
    } catch (error) {
      console.error('Error saving advertisement:', error)

      alert(
        error.response?.data?.message ||
          error.message ||
          'Something went wrong while saving advertisement',
      )
    } finally {
      setSaving(false)
      setUploadProgress(0)
    }
  }

  // const saveAdvertisement = async (data) => {
  //   if (saving) return

  //   setSaving(true)
  //   setUploadProgress(0)

  //   try {
  //     const formData = new FormData()

  //     formData.append('title', data.title)
  //     formData.append('position', data.position)
  //     formData.append('priority', data.priority)
  //     formData.append('redirectUrl', data.redirectUrl || '')
  //     formData.append('status', data.status)

  //     if (data.image?.[0]) {
  //       formData.append('image', data.image[0])
  //     }

  //     const token = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')?.token

  //     const endpoint = editingAdvertisement
  //       ? `/api/advertisements/update/${editingAdvertisement._id}`
  //       : '/api/advertisements/create'

  //     const response = await axios({
  //       url: setting.api + endpoint,
  //       method: editingAdvertisement ? 'PUT' : 'POST',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       data: formData,
  //       onUploadProgress: (event) => {
  //         if (event.total) {
  //           const percent = Math.round((event.loaded * 100) / event.total)
  //           setUploadProgress(percent)
  //         }
  //       },
  //     })

  //     const result = response.data

  //     if (result.success) {
  //       await getAdvertisements()
  //       setVisible(false)
  //       reset()
  //       setPreview('')
  //       setEditingAdvertisement(null)
  //     } else {
  //       alert(result.message || 'Failed to save advertisement')
  //     }
  //   } catch (error) {
  //     console.error('Error saving advertisement:', error)
  //     alert(error.response?.data?.message || 'Something went wrong while saving advertisement')
  //   } finally {
  //     setSaving(false)
  //     setUploadProgress(0)
  //   }
  // }

  // const saveAdvertisement = async (data) => {
  //   const formData = new FormData()

  //   formData.append('title', data.title)
  //   formData.append('position', data.position)
  //   formData.append('priority', data.priority)
  //   formData.append('redirectUrl', data.redirectUrl)
  //   formData.append('status', data.status)

  //   if (data.image?.[0]) {
  //     formData.append('image', data.image[0])
  //   }

  //   const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token

  //   let endpoint = '/api/advertisements/create'

  //   if (editingAdvertisement) {
  //     endpoint = `/api/advertisements/update/${editingAdvertisement._id}`
  //   }

  //   const res = await fetch(setting.api + endpoint, {
  //     method: editingAdvertisement ? 'PUT' : 'POST',
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: formData,
  //   })

  //   const result = await res.json()

  //   if (result.success) {
  //     getAdvertisements()
  //     setVisible(false)
  //     reset()
  //     setPreview('')
  //     setEditingAdvertisement(null)
  //   }
  // }

  const handleEdit = (item) => {
    setEditingAdvertisement(item)
    setVisible(true)
  }

  // const handleDelete = async (id) => {
  //   if (!window.confirm('Delete Advertisement?')) return

  //   const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token

  //   await fetch(`${setting.api}/api/advertisements/delete/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })

  //   getAdvertisements()
  // }

  const handleDelete = async (id) => {
    if (deletingId !== null) return
    if (!window.confirm('Delete Advertisement?')) return

    setDeletingId(id)

    try {
      const token = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')?.token

      const response = await fetch(`${setting.api}/api/advertisements/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok || result.success === false) {
        alert(result.message || 'Failed to delete advertisement')
        return
      }

      await getAdvertisements()
    } catch (error) {
      console.error('Error deleting advertisement:', error)
      alert('Something went wrong while deleting advertisement')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = advertisements.filter(
    (x) =>
      x.title.toLowerCase().includes(search.toLowerCase()) ||
      x.position.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <>
      <CCard className="shadow border-0 rounded-4">
        <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📢 Advertisement Management</h5>

            <CButton
              color="light"
              variant="outline"
              className="rounded-pill px-4"
              onClick={() => {
                setEditingAdvertisement(null)
                setPreview('')
                reset()
                setVisible(true)
              }}
            >
              + Create Advertisement
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-4">
            <CCol md={4}>
              <CFormInput
                placeholder="Search Advertisement..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </CCol>
          </CRow>

          <CTable striped hover responsive bordered>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>

                <CTableHeaderCell>Image</CTableHeaderCell>

                <CTableHeaderCell>Title</CTableHeaderCell>

                <CTableHeaderCell>Position</CTableHeaderCell>

                <CTableHeaderCell>Priority</CTableHeaderCell>

                <CTableHeaderCell>Status</CTableHeaderCell>

                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>

                    <CTableDataCell>
                      <img
                        src={`${setting.api}/uploads/advertisements/${item.image}`}
                        width="90"
                        height="60"
                        alt=""
                        style={{
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                    </CTableDataCell>

                    <CTableDataCell>
                      <strong>{item.title}</strong>
                    </CTableDataCell>

                    <CTableDataCell>
                      <span className="badge bg-info">{item.position}</span>
                    </CTableDataCell>

                    <CTableDataCell>{item.priority}</CTableDataCell>

                    <CTableDataCell>
                      <span className={`badge ${item.status ? 'bg-success' : 'bg-danger'}`}>
                        {item.status ? 'Active' : 'Inactive'}
                      </span>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="warning"
                        className="me-2 rounded-pill"
                        onClick={() => handleEdit(item)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>

                      <CButton
                        size="sm"
                        color="danger"
                        className="rounded-pill"
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId !== null}
                      >
                        {deletingId === item._id ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            />
                            Deleting...
                          </>
                        ) : (
                          <CIcon icon={cilTrash} />
                        )}
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={7} className="text-center">
                    No Advertisement Found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          <div className="d-flex justify-content-end mt-4">
            <CPagination>
              {[...Array(totalPages)].map((_, i) => (
                <CPaginationItem
                  key={i}
                  active={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
            </CPagination>
          </div>
        </CCardBody>
      </CCard>

      {/* Offcanvas starts here */}

      <COffcanvas
        placement="end"
        visible={visible}
        onHide={() => setVisible(false)}
        backdrop={true}
      >
        <COffcanvasHeader closeButton>
          <strong>{editingAdvertisement ? 'Update Advertisement' : 'Create Advertisement'}</strong>
        </COffcanvasHeader>

        <COffcanvasBody>
          <CForm onSubmit={handleSubmit(saveAdvertisement)}>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  label="Advertisement Title"
                  placeholder="Enter Advertisement Title"
                  {...register('title')}
                />
                {errors.title && <small className="text-danger">{errors.title.message}</small>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  label="Redirect URL"
                  placeholder="https://pinkchoice.com/product/1"
                  {...register('redirectUrl')}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                {/* <CFormSelect label="Position" {...register('position')}> */}
                <CFormSelect
                  label="Position"
                  {...register('position')}
                  onChange={(e) => {
                    setValue('position', e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }}
                >
                  <option value="">Select Position</option>

                  <option value="homepage_top">Home Top</option>
                  <option value="homepage_middle">Home Middle</option>
                  <option value="homepage_bottom">Home Bottom</option>
                  <option value="article_top">Article Top</option>
                  <option value="article_middle">Article Middle</option>
                  <option value="article_bottom">Article Bottom</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                  <option value="popup">Popup</option>
                </CFormSelect>
                {/* 
                {selectedPosition && (
                  <div className="alert alert-info mt-2 py-2">
                    <strong>Required Image Size</strong>
                    <br />
                    Width :{imageDimensions[selectedPosition].width}px
                    <br />
                    Height :{imageDimensions[selectedPosition].height}px
                  </div>
                )} */}

                {errors.position && (
                  <small className="text-danger">{errors.position.message}</small>
                )}
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="number"
                  label="Priority"
                  placeholder="1"
                  {...register('priority')}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormSelect label="Status" {...register('status')}>
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={12}>
                <CFormLabel>Advertisement Image</CFormLabel>

                <CFormInput
                  type="file"
                  accept="image/*"
                  {...register('image')}
                  onChange={(e) => {
                    const file = e.target.files[0]

                    if (!file) return

                    const MAX_SIZE = 2 * 1024 * 1024 // 2MB

                    if (file.size > MAX_SIZE) {
                      alert('Image must be less than 2 MB')
                      e.target.value = ''
                      setPreview('')
                      return
                    }

                    const img = new Image()

                    img.onload = () => {
                      const required = imageDimensions[selectedPosition]

                      if (!required) {
                        setPreview(URL.createObjectURL(file))
                        return
                      }

                      if (img.width !== required.width || img.height !== required.height) {
                        alert(
                          `Invalid image size.
Required: ${required.width} × ${required.height}px
Selected: ${img.width} × ${img.height}px`,
                        )

                        e.target.value = ''
                        setPreview('')
                        return
                      }

                      setPreview(URL.createObjectURL(file))
                    }

                    img.src = URL.createObjectURL(file)
                  }}
                />

                {selectedPosition && (
                  <small className="text-primary d-block mt-2">
                    Required Size: {imageDimensions[selectedPosition].width} ×{' '}
                    {imageDimensions[selectedPosition].height}px
                    <br />
                    Max File Size: 2 MB
                  </small>
                )}
              </CCol>
            </CRow>

            {preview && (
              <div className="text-center mb-4">
                <img
                  src={preview}
                  alt=""
                  style={{
                    width: '100%',
                    maxHeight: '220px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                  }}
                />
              </div>
            )}

            {saving && (
              <div className="mt-3 mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <strong>
                    {uploadProgress >= 100
                      ? 'Processing advertisement...'
                      : 'Uploading advertisement...'}
                  </strong>
                  <strong>{uploadProgress}%</strong>
                </div>

                <div
                  className="progress"
                  style={{ height: '12px', borderRadius: '10px' }}
                  role="progressbar"
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    style={{
                      width: `${uploadProgress}%`,
                      transition: 'width 0.2s ease',
                    }}
                  />
                </div>

                <small className="text-muted d-block mt-2">
                  Please wait until the upload and save operation finishes.
                </small>
              </div>
            )}

            <div className="d-flex justify-content-end">
              <div className="d-flex justify-content-end">
                <CButton
                  color={editingAdvertisement ? 'warning' : 'success'}
                  type="submit"
                  className="rounded-pill px-4"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      {uploadProgress >= 100 ? 'Processing...' : `${uploadProgress}% Uploading...`}
                    </>
                  ) : editingAdvertisement ? (
                    'Update Advertisement'
                  ) : (
                    'Save Advertisement'
                  )}
                </CButton>
              </div>
            </div>
          </CForm>
        </COffcanvasBody>
      </COffcanvas>
    </>
  )
}

export default Advertisement
