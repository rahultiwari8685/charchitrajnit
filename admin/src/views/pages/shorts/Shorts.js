import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormLabel,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CRow,
  CCol,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  CPagination,
  CPaginationItem,
  CImage,
} from '@coreui/react'

import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import * as yup from 'yup'

import secureLocalStorage from 'react-secure-storage'

import setting from '../../../setting.json'

import CIcon from '@coreui/icons-react'

import { cilPencil, cilTrash } from '@coreui/icons'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),

  subtitle: yup.string(),

  author: yup.string().required('Author required'),

  categories: yup.string().required('Category required'),

  status: yup.string().required(),

  thumbnail: yup.mixed(),

  video: yup.mixed(),
})

const Shorts = () => {
  const [shorts, setShorts] = useState([])

  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])

  const [visible, setVisible] = useState(false)

  const [editing, setEditing] = useState(null)

  const [thumbnailPreview, setThumbnailPreview] = useState('')

  const [videoPreview, setVideoPreview] = useState('')

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  const {
    register,

    handleSubmit,

    reset,

    setValue,

    watch,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')

  const token = loginInfo?.token || ''
  useEffect(() => {
    getShorts()
    getAuthors()
    getCategories()
  }, [])

  useEffect(() => {
    console.log(authors)
  }, [authors])

  const getShorts = async () => {
    const res = await fetch(
      setting.api + '/api/shorts/list',

      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )

    const data = await res.json()

    if (data.status) {
      setShorts(data.data)
    }
  }

  const getCategories = async () => {
    const res = await fetch(setting.api + '/api/categories/getAllCategory')

    const data = await res.json()

    if (data.success) {
      setCategories(data.data)
    }
  }

  const getAuthors = async () => {
    const res = await fetch(setting.api + '/api/users/getAllUser', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })

    const data = await res.json()

    console.log(data)

    if (data.success) {
      setAuthors(data.data)
    }
  }

  const editShort = (item) => {
    setEditing(item)

    setValue('id', item._id)
    setValue('title', item.title)
    setValue('subtitle', item.subtitle)
    setValue('author', item.author?._id)
    setValue('categories', item.categories?.[0]?._id)
    setValue('status', item.status)

    if (item.thumbnail) {
      setThumbnailPreview(`${setting.api}/uploads/images/${item.thumbnail}`)
    }

    if (item.video) {
      setVideoPreview(`${setting.api}/uploads/videos/${item.video}`)
    }

    setVisible(true)
  }

  const onSubmit = async (values) => {
    try {
      setLoading(true)

      const formData = new FormData()

      formData.append('title', values.title)
      if (editing) {
        formData.append('id', values.id)
      }
      formData.append('subtitle', values.subtitle)
      formData.append('author', values.author)
      formData.append('status', values.status)

      formData.append('categories', JSON.stringify([values.categories]))

      if (values.thumbnail) {
        formData.append('thumbnail', values.thumbnail)
      }

      if (values.video) {
        formData.append('video', values.video)
      }

      setUploadProgress(0)

      const response = await axios({
        url: editing ? setting.api + '/api/shorts/update' : setting.api + '/api/shorts/create',
        method: 'POST',
        data: formData,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)

            setUploadProgress(percent)
          }
        },
      })

      const data = response.data

      // const response = await fetch(
      //   editing ? setting.api + '/api/shorts/update' : setting.api + '/api/shorts/create',
      //   {
      //     method: 'POST',
      //     headers: {
      //       Authorization: 'Bearer ' + token,
      //     },
      //     body: formData,
      //   },
      // )

      // const data = await response.json()

      if (data.status) {
        toast.success(data.message)

        setVisible(false)

        reset()

        setThumbnailPreview('')

        setVideoPreview('')

        setEditing(null)

        getShorts()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)

      alert('Something went wrong.')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const deleteShort = async (id) => {
    if (!window.confirm('Delete this Short?')) {
      return
    }

    try {
      const response = await fetch(setting.api + '/api/shorts/' + id, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const data = await response.json()

      if (data.status) {
        toast.success(data.message)

        getShorts()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const filteredShorts = shorts.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredShorts.length / itemsPerPage)

  const paginatedItems = filteredShorts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )
  return (
    <>
      <CCard className="shadow border-0 rounded-4">
        <CCardHeader className="bg-dark text-white px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-camera-reels-fill text-danger me-2"></i>
              🎬 Shorts Management
            </h5>

            <CButton
              color="light"
              className="rounded-pill px-4"
              onClick={() => {
                reset({
                  id: '',
                  title: '',
                  subtitle: '',
                  author: '',
                  categories: '',
                  status: '1',
                })
                setEditing(null)
                setThumbnailPreview('')
                setVideoPreview('')
                setVisible(true)
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Shorts
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <CFormInput
            placeholder="Search Shorts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <CRow className="mb-4">
            <CCol md={4}>
              <CCard>
                <CCardBody>
                  <h6>Total Shorts</h6>

                  <h2>{shorts.length}</h2>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol md={4}>
              <CCard>
                <CCardBody>
                  <h6>Total Views</h6>

                  <h2>
                    {shorts.reduce(
                      (a, b) => a + b.views,

                      0,
                    )}
                  </h2>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CTable striped hover responsive bordered>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>

                <CTableHeaderCell>Thumbnail</CTableHeaderCell>

                <CTableHeaderCell>Title</CTableHeaderCell>

                <CTableHeaderCell>Category</CTableHeaderCell>

                <CTableHeaderCell>Author</CTableHeaderCell>

                <CTableHeaderCell>Views</CTableHeaderCell>
                <CTableHeaderCell>Video</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>

                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {paginatedItems.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="text-center">
                    No Shorts Found
                  </CTableDataCell>
                </CTableRow>
              )}
              {paginatedItems.map((item, index) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index

                return (
                  <CTableRow key={item._id}>
                    <CTableDataCell>{actualIndex + 1}</CTableDataCell>

                    <CTableDataCell>
                      <CImage
                        rounded
                        width={90}
                        height={60}
                        src={
                          item.thumbnail
                            ? `${setting.api}/uploads/images/${item.thumbnail}`
                            : '/no-image.png'
                        }
                      />
                    </CTableDataCell>

                    <CTableDataCell>
                      <strong>{item.title}</strong>
                    </CTableDataCell>

                    <CTableDataCell>
                      <span className="badge bg-primary">{item.categories?.[0]?.name}</span>
                    </CTableDataCell>

                    <CTableDataCell>{item.author?.name}</CTableDataCell>

                    <CTableDataCell>{item.views}</CTableDataCell>
                    <CTableDataCell>
                      <video
                        width="120"
                        height="70"
                        controls
                        src={`${setting.api}/uploads/videos/${item.video}`}
                      />
                    </CTableDataCell>

                    <CTableDataCell>
                      <span
                        className={item.status == 1 ? 'badge bg-success' : 'badge bg-secondary'}
                      >
                        {item.status == 1 ? 'Published' : 'Draft'}
                      </span>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="warning"
                        className="rounded-pill me-2"
                        onClick={() => editShort(item)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>

                      <CButton size="sm" color="danger" onClick={() => deleteShort(item._id)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>

          <div className="d-flex justify-content-end">
            <CPagination>
              {Array.from({ length: totalPages }, (_, i) => (
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

          <COffcanvas
            placement="end"
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: '700px' }}
          >
            <COffcanvasHeader>
              <h4>{editing ? 'Edit Short' : 'Create Short'}</h4>
            </COffcanvasHeader>

            <COffcanvasBody>
              <CForm>
                <CRow>
                  <CFormInput type="hidden" {...register('id')} />
                  <CCol md={12}>
                    <CFormLabel>Title</CFormLabel>

                    <CFormInput {...register('title')} placeholder="Enter Title" />

                    <small className="text-danger">{errors.title?.message}</small>
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={12}>
                    <CFormLabel>Subtitle</CFormLabel>

                    <CFormTextarea
                      rows={3}
                      {...register('subtitle')}
                      placeholder="Enter Subtitle"
                    />
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormLabel>Category</CFormLabel>

                    <CFormSelect {...register('categories')}>
                      <option value="">Select Category</option>

                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel>Author</CFormLabel>

                    <CFormSelect {...register('author')}>
                      <option value="">Select Author</option>

                      {authors.map((author) => (
                        <option key={author._id} value={author._id}>
                          {author.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormLabel>Status</CFormLabel>

                    <CFormSelect {...register('status')}>
                      <option value="1">Published</option>

                      <option value="0">Draft</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mt-4">
                  <CCol md={12}>
                    <CFormLabel>Thumbnail</CFormLabel>

                    <CFormInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]

                        setValue('thumbnail', file)

                        if (file) {
                          setThumbnailPreview(URL.createObjectURL(file))
                        }
                      }}
                    />
                  </CCol>
                </CRow>

                {thumbnailPreview && (
                  <div className="mt-3">
                    <CImage
                      rounded
                      fluid
                      src={thumbnailPreview}
                      style={{
                        height: 180,

                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}

                <CRow className="mt-4">
                  <CCol md={12}>
                    <CFormLabel>Short Video (MP4)</CFormLabel>

                    <CFormInput
                      type="file"
                      accept="video/mp4"
                      onChange={(e) => {
                        const file = e.target.files[0]

                        setValue('video', file)

                        if (file) {
                          setVideoPreview(URL.createObjectURL(file))
                        }
                      }}
                    />
                  </CCol>
                </CRow>

                {videoPreview && (
                  <div className="mt-3">
                    <video width="100%" height="300" controls src={videoPreview} />
                  </div>
                )}

                {loading && (
                  <div className="mt-4 mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <strong>
                        {uploadProgress < 100 ? 'Uploading Short...' : 'Processing...'}
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
                        className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                        style={{
                          width: `${uploadProgress}%`,
                          transition: 'width 0.2s ease',
                        }}
                      />
                    </div>

                    <small className="text-muted d-block mt-2">
                      Please wait until the video upload finishes.
                    </small>
                  </div>
                )}

                <div className="mt-4">
                  <CButton color="secondary" onClick={() => setVisible(false)} disabled={loading}>
                    Cancel
                  </CButton>
                  <CButton
                    color="primary"
                    className="ms-3"
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editing ? 'Update Short' : 'Create Short'}
                  </CButton>
                </div>
              </CForm>
            </COffcanvasBody>
          </COffcanvas>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Shorts
