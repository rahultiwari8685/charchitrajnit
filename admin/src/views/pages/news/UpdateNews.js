import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import setting from '../../../setting.json'

import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CCardHeader,
  CFormCheck,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'

import secureLocalStorage from 'react-secure-storage'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Editor } from '@tinymce/tinymce-react'

const schema = yup.object().shape({
  title: yup.string().required('Hindi Title is required'),

  subtitle: yup.string().required('Hindi Subtitle is required'),

  videoType: yup.string().required('News type is required'),

  type: yup.string().required('News status is required'),

  slug: yup.string().required('Slug is required'),
})

const UpdateNews = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const [editingNews, setEditingNews] = useState(null)

  const [categoriesList, setCategoryList] = useState([])

  const [content, setContent] = useState('')

  const [loading, setLoading] = useState(false)

  const [loginInfo, setLoginInfo] = useState(null)

  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),

    defaultValues: {
      title: '',
      subtitle: '',
      categories: [],
      videoType: '',
      type: '',
      slug: '',
      youtubeUrl: '',
      videoFile: null,
      thumbnail: null,
        thumbnailCaption: '',
    },
  })

  const formDataValues = watch()

  useEffect(() => {
    try {
      const storedLogin = secureLocalStorage.getItem('logininfo')

      if (storedLogin) {
        const parsedLogin = typeof storedLogin === 'string' ? JSON.parse(storedLogin) : storedLogin

        setLoginInfo(parsedLogin)
      }
    } catch (error) {
      console.error('Invalid login information:', error)

      secureLocalStorage.clear()

      navigate('/login')
    }
  }, [navigate])

  const getAllCategory = async () => {
    try {
      const token = loginInfo?.token

      if (!token) {
        return
      }

      const response = await fetch(`${setting.api}/api/categories/getAllCategory`, {
        method: 'GET',

        mode: 'cors',

        headers: {
          'Content-Type': 'application/json',

          Authorization: 'Bearer ' + token,
        },
      })

      const result = await response.json()

      if (result.status === false) {
        secureLocalStorage.clear()

        navigate('/login')

        return
      }

      setCategoryList(result.data || [])
    } catch (error) {
      console.error('Category fetch failed:', error)
    }
  }

  useEffect(() => {
    if (!loginInfo?.token) {
      return
    }

    getAllCategory()
  }, [loginInfo?.token])

  const toggleCategory = (categoryId) => {
    const currentCategories = formDataValues.categories || []

    const alreadySelected = currentCategories.includes(categoryId)

    const newCategories = alreadySelected
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId]

    setValue('categories', newCategories, {
      shouldDirty: true,
    })
  }

  const getYouTubeId = (url) => {
    try {
      const parsedUrl = new URL(url)

      if (parsedUrl.hostname === 'youtu.be') {
        return parsedUrl.pathname.slice(1)
      }

      if (parsedUrl.searchParams.has('v')) {
        return parsedUrl.searchParams.get('v')
      }

      if (parsedUrl.pathname.includes('/embed/')) {
        return parsedUrl.pathname.split('/embed/')[1]
      }

      return null
    } catch (error) {
      return null
    }
  }

  const fetchNewsById = async () => {
    try {
      if (!id) {
        return
      }

      const token = loginInfo?.token

      if (!token) {
        return
      }

      const response = await fetch(`${setting.api}/api/news/id/${id}?lang=hi`, {
        method: 'GET',

        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const result = await response.json()

      if (!result.status) {
        toast.error(result.message || 'News not found')

        return
      }

      const selected = result.data

      console.log('Hindi News:', selected)

      setEditingNews(selected)

      /*
       * Fill form with Hindi source.
       */

      reset({
        title: selected.title || '',

        subtitle: selected.subtitle || '',

        slug: selected.slug || '',

        type: selected.type !== undefined && selected.type !== null ? String(selected.type) : '',

        videoType:
          selected.videoType !== undefined && selected.videoType !== null
            ? String(selected.videoType)
            : '',

        youtubeUrl: selected.youtubeUrl || '',

        categories: Array.isArray(selected.categories)
          ? selected.categories.map((category) => category?._id || category?.id || category)
          : [],

        videoFile: null,

        thumbnail: null,
         thumbnailCaption: selected.thumbnailCaption || '',
      })

      /*
       * Because the API request uses lang=hi,
       * selected.content is Hindi content.
       */

      let hindiContent = selected.content || ''

      if (typeof hindiContent !== 'string') {
        try {
          hindiContent = JSON.stringify(hindiContent)
        } catch (error) {
          hindiContent = ''
        }
      }

      setContent(hindiContent)
    } catch (error) {
      console.error('Error fetching news:', error)

      toast.error('Failed to load news')
    }
  }

  useEffect(() => {
    if (!id) {
      return
    }

    if (!loginInfo?.token) {
      return
    }

    fetchNewsById()
  }, [id, loginInfo?.token])

  useEffect(() => {
    const file = formDataValues.thumbnail?.[0]

    if (!file) {
      setThumbnailPreview(null)

      return
    }

    const objectUrl = URL.createObjectURL(file)

    setThumbnailPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [formDataValues.thumbnail])

  const updateNews = async (data) => {
    if (loading) {
      return
    }

    if (!id) {
      toast.error('News ID is missing')

      return
    }

    if (!loginInfo?.token) {
      toast.error('Login session expired')

      navigate('/login')

      return
    }

    setLoading(true)

    try {
      const formData = new FormData()

      /*
       * News ID
       */

      formData.append('id', id)

      /*
       * Hindi source title
       */

      formData.append('title', data.title || '')

      /*
       * Hindi source subtitle
       */

      formData.append('sub_title', data.subtitle || '')

      /*
       * News type
       */

      formData.append('video_type', data.videoType || '')

      /*
       * Status
       */

      formData.append('type', data.type || '')

      /*
       * Slug
       */

      formData.append('slug', data.slug || '')

      /*
       * Categories
       */

      formData.append('categories', JSON.stringify(data.categories || []))
      formData.append('thumbnailCaption', data.thumbnailCaption || '')

      /*
       * Hindi content
       */

      if (data.videoType === '2') {
        formData.append('content', content || '')
      }

      /*
       * YouTube URL
       */

      if (data.videoType === '1') {
        formData.append('youtube_url', data.youtubeUrl || '')
      }

      /*
       * Hindi translation object.
       *
       * This tells the backend that Hindi
       * is the source language.
       *
       * Backend will regenerate the other
       * languages using Google Translate.
       */

      formData.append(
        'translations',
        JSON.stringify({
          hi: {
            title: data.title || '',

            subtitle: data.subtitle || '',

            content: data.videoType === '2' ? content || '' : '',
          },
        }),
      )

      /*
       * New thumbnail
       */

      if (data.thumbnail?.[0]) {
        formData.append('thumbnail', data.thumbnail[0])
      }

      /*
       * Update API
       */

      const response = await fetch(`${setting.api}/api/news/updateNews`, {
        method: 'POST',

        body: formData,

        headers: {
          Authorization: 'Bearer ' + loginInfo.token,
        },
      })

      const result = await response.json()

      console.log('Update News API response:', result)

      if (!result.status) {
        toast.error(result.message || 'Failed to update news')

        return
      }

      /*
       * Success
       */

      toast.success('News Updated Successfully!')

      /*
       * Navigate back.
       */

      navigate('/PublishedNews')
    } catch (error) {
      console.error('Update news error:', error)

      toast.error(error.message || 'Something went wrong while updating news')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex flex-column flex-lg-row gap-4">
      <CCol lg={formDataValues.videoType === '1' ? 8 : 12}>
        <CCard className="shadow border-0 rounded-4">
          <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
            <h5 className="mb-0">Update News</h5>
          </CCardHeader>

          <CCardBody>
            {/* <div className="alert alert-info mb-4">
              <strong>Automatic Translation:</strong> Hindi is the source language. English,
              Bengali, Marathi and Tamil translations are generated automatically when the news is
              updated.
            </div> */}

            <CForm onSubmit={handleSubmit(updateNews)}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormInput
                    type="text"
                    label="Hindi Title"
                    placeholder="Enter Hindi Title"
                    {...register('title')}
                    onChange={(event) => {
                      setValue('title', event.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                  />

                  {errors.title && <small className="text-danger">{errors.title.message}</small>}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Slug"
                    placeholder="Update Slug"
                    {...register('slug')}
                    onChange={(event) => {
                      setValue('slug', event.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                  />

                  {errors.slug && <small className="text-danger">{errors.slug.message}</small>}
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Hindi Subtitle"
                    placeholder="Enter Hindi Subtitle"
                    {...register('subtitle')}
                    onChange={(event) => {
                      setValue('subtitle', event.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                  />

                  {errors.subtitle && (
                    <small className="text-danger">{errors.subtitle.message}</small>
                  )}
                </CCol>
              </CRow>

              {/* ===================================================
                  CATEGORIES
              ==================================================== */}

              <CRow className="mb-3">
                <CCol md={12}>
                  <p className="mb-2">Select Categories</p>

                  <CDropdown>
                    <CDropdownToggle color="secondary">
                      {formDataValues.categories?.length > 0
                        ? categoriesList
                            .filter((category) => formDataValues.categories.includes(category._id))
                            .map((category) => category.name)
                            .join(', ')
                        : 'Select Categories'}
                    </CDropdownToggle>

                    <CDropdownMenu>
                      {categoriesList.length === 0 ? (
                        <CDropdownItem disabled>No Categories Found</CDropdownItem>
                      ) : (
                        categoriesList.map((category) => {
                          const isSelected = (formDataValues.categories || []).includes(
                            category._id,
                          )

                          return (
                            <CDropdownItem key={category._id}>
                              <CFormCheck
                                id={`cat-${category._id}`}
                                label={category.name}
                                checked={isSelected}
                                onChange={() => toggleCategory(category._id)}
                              />
                            </CDropdownItem>
                          )
                        })
                      )}
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
              </CRow>

              {/* ===================================================
                  NEWS STATUS / NEWS TYPE
              ==================================================== */}

              <CRow className="mb-3 mt-2">
                <CCol md={6}>
                  <CFormSelect
                    label="Type"
                    {...register('type')}
                    value={formDataValues.type}
                    onChange={(event) =>
                      setValue('type', event.target.value, {
                        shouldDirty: true,
                      })
                    }
                  >
                    <option value="">Select Type</option>

                    <option value="1">Published</option>

                    <option value="2">Draft</option>

                    <option value="3">Scheduled</option>
                  </CFormSelect>

                  {errors.type && <small className="text-danger">{errors.type.message}</small>}
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    label="News Type"
                    {...register('videoType')}
                    value={formDataValues.videoType}
                    onChange={(event) =>
                      setValue('videoType', event.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  >
                    <option value="">Select Type</option>

                    <option value="1">Youtube Video</option>

                    <option value="2">Text</option>
                  </CFormSelect>

                  {errors.videoType && (
                    <small className="text-danger">{errors.videoType.message}</small>
                  )}
                </CCol>
              </CRow>

              {/* ===================================================
                  YOUTUBE URL
              ==================================================== */}

              {formDataValues.videoType === '1' && (
                <CFormInput
                  type="url"
                  label="YouTube URL"
                  {...register('youtubeUrl')}
                  placeholder="https://youtube.com/..."
                  className="mb-4"
                />
              )}

              {/* ===================================================
                  HINDI CONTENT
              ==================================================== */}

              {formDataValues.videoType === '2' && (
                <>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Hindi Content</label>

                    <Editor
                      apiKey="iug8g892lljsn0xjpc2gsqmoazb2bvm0zwr3zocvqzelk9dt"
                      value={content}
                      onEditorChange={(newValue) => {
                        setContent(newValue)
                      }}
                      init={{
                        height: 600,

                        menubar: true,

                        branding: false,

                        plugins: [
                          'advlist',
                          'autolink',
                          'lists',
                          'link',
                          'image',
                          'charmap',
                          'preview',
                          'anchor',
                          'searchreplace',
                          'visualblocks',
                          'code',
                          'fullscreen',
                          'insertdatetime',
                          'media',
                          'table',
                          'wordcount',
                        ],

                        toolbar:
                          'undo redo | styles | bold italic underline | ' +
                          'alignleft aligncenter alignright alignjustify | ' +
                          'bullist numlist outdent indent | ' +
                          'link image media table | ' +
                          'code fullscreen',

                        images_upload_handler: async (blobInfo) => {
                          const formData = new FormData()

                          formData.append('file', blobInfo.blob(), blobInfo.filename())

                          const response = await fetch(`${setting.api}/api/upload/image`, {
                            method: 'POST',

                            body: formData,
                          })

                          const result = await response.json()

                          if (!response.ok) {
                            throw new Error(result.message || 'Upload failed')
                          }

                          return result.location
                        },

                        images_reuse_filename: true,
                      }}
                    />
                  </div>

                  {/* =================================================
                      THUMBNAIL
                  ================================================== */}

                  <CCol md={12} className="mb-4">
                    <CFormInput
                      type="file"
                      label="Thumbnail"
                      accept="image/*"
                      {...register('thumbnail')}
                    />
                    <CFormInput
  type="text"
  label="Thumbnail Caption"
  placeholder="Enter image caption"
  className="mt-3"
  {...register('thumbnailCaption')}
/>

                    {/* New thumbnail */}

                    {thumbnailPreview && (
                      <div className="mt-3">
                        <p className="small fw-semibold mb-2">New Thumbnail</p>

                        <img
                          src={thumbnailPreview}
                          alt="New Thumbnail"
                          className="img-fluid rounded shadow"
                          style={{
                            maxHeight: '150px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}

                    {/* Existing thumbnail */}

                    {!thumbnailPreview && editingNews?.thumbnail && (
                      <div className="mt-3">
                        <p className="small fw-semibold mb-2">Current Thumbnail</p>

                        <img
                          src={`${setting.api}/uploads/images/${editingNews.thumbnail}`}
                          alt="Current Thumbnail"
                          className="img-fluid rounded shadow"
                          style={{
                            maxHeight: '150px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}
                  </CCol>
                </>
              )}

              {/* ===================================================
                  ACTION BUTTON
              ==================================================== */}

              <div className="d-flex justify-content-end mt-4">
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update News'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* =============================================================
          LIVE PREVIEW
      ============================================================= */}

      {formDataValues.videoType === '1' && (
        <CCol lg={4}>
          <CCard className="shadow border-0 rounded-4 text-dark">
            <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
              <h5 className="mb-0">Live Preview</h5>
            </CCardHeader>

            <CCardBody>
              {/* Hindi title */}

              {formDataValues.title && (
                <p>
                  <strong>Hindi Title:</strong> {formDataValues.title}
                </p>
              )}

              {/* Categories */}

              {formDataValues.categories?.length > 0 && (
                <p>
                  <strong>Categories:</strong>{' '}
                  {categoriesList
                    .filter((category) => formDataValues.categories.includes(category._id))
                    .map((category) => category.name)
                    .join(', ')}
                </p>
              )}

              {/* YouTube preview */}

              {formDataValues.videoType === '1' &&
                formDataValues.youtubeUrl &&
                (() => {
                  const videoId = getYouTubeId(formDataValues.youtubeUrl)

                  if (!videoId) {
                    return <p className="text-danger">Invalid YouTube URL</p>
                  }

                  return (
                    <iframe
                      width="100%"
                      height="250"
                      className="rounded mb-3"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube Preview"
                      allowFullScreen
                    />
                  )
                })()}
            </CCardBody>
          </CCard>
        </CCol>
      )}
    </div>
  )
}

export default UpdateNews
