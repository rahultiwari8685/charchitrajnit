import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormInput,
  CFormCheck,
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
  CSpinner,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilCloudUpload } from '@coreui/icons'
import secureLocalStorage from 'react-secure-storage'

const API = 'https://api.charchitrajnit.com'
const MAX_FILE_SIZE = 200 * 1024 * 1024
const ITEMS_PER_PAGE = 10
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]

export default function GalleryManager() {
  const [galleryItems, setGalleryItems] = useState([])
  const [fetchingList, setFetchingList] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [publish, setPublish] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('danger')
  const [dragging, setDragging] = useState(false)

  const fileInputRef = useRef(null)
  const xhrRef = useRef(null)
  const objectUrlRef = useRef(null)

  const token = useMemo(() => {
    try {
      return JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')?.token || ''
    } catch {
      return ''
    }
  }, [])

  const isImage = Boolean(file?.type?.startsWith('image/'))
  const isVideo = Boolean(file?.type?.startsWith('video/'))

  const showMessage = (text, type = 'danger') => {
    setMessage(text)
    setMessageType(type)
  }

  const getItemId = (item) => item?._id || item?.id

  const fetchGallery = useCallback(async () => {
    setFetchingList(true)
    try {
      const response = await fetch(`${API}/api/gallery`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to load gallery.')
      }

      const rows = Array.isArray(result) ? result : result.data
      if (!Array.isArray(rows)) {
        throw new Error(result.message || 'Unexpected gallery API response.')
      }

      setGalleryItems(rows)
      setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE))))
    } catch (error) {
      console.error('Failed to fetch gallery:', error)
      showMessage(error.message || 'Failed to load gallery.')
    } finally {
      setFetchingList(false)
    }
  }, [token])

  useEffect(() => {
    fetchGallery()
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      xhrRef.current = null
    }
  }, [fetchGallery])

  const removeFile = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const resetForm = () => {
    setTitle('')
    removeFile()
    setPublish(true)
    setEditingItem(null)
    setMessage('')
    setProgress(0)
  }

  const openCreate = () => {
    resetForm()
    setVisible(true)
  }

  const handleEdit = (item) => {
    resetForm()
    setEditingItem(item)
    setTitle(item.title || '')
    setPublish(
      item.isPublished === true ||
        item.isPublished === 'true' ||
        item.isPublished === 1 ||
        item.isPublished === '1',
    )
    setVisible(true)
    setMessage('')
  }

  const selectFile = (selectedFile) => {
    setMessage('')
    if (!selectedFile) return

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      showMessage('Unsupported format. Choose JPG, PNG, WEBP, AVIF, GIF, MP4, WEBM, OGG, or MOV.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      showMessage('File size must be 200 MB or less.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = URL.createObjectURL(selectedFile)
    setFile(selectedFile)
  }

  const formatSize = (bytes) => {
    if (!bytes) return ''
    return bytes < 1024 * 1024
      ? `${Math.round(bytes / 1024)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (saving) return
    setMessage('')
    setProgress(0)

    if (!title.trim()) {
      showMessage('Please enter a title.')
      return
    }
    if (!editingItem && !file) {
      showMessage('Please select an image or video.')
      return
    }
    if (file && (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE)) {
      showMessage('Please select a supported file no larger than 200 MB.')
      return
    }

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('isPublished', String(publish))
    if (file) formData.append('media', file)

    const isEditing = Boolean(editingItem)
    const itemId = getItemId(editingItem)
    if (isEditing && !itemId) {
      showMessage('Cannot update this item because its ID is missing.')
      return
    }

    const xhr = new XMLHttpRequest()
    xhrRef.current = xhr
    setSaving(true)

    xhr.open(
      isEditing ? 'PUT' : 'POST',
      isEditing ? `${API}/api/gallery/${itemId}` : `${API}/api/gallery`,
    )
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.timeout = 15 * 60 * 1000

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100))
    }

    xhr.onload = async () => {
      setSaving(false)
      xhrRef.current = null
      let result
      try {
        result = JSON.parse(xhr.responseText)
      } catch {
        showMessage('The server returned an unexpected response.')
        return
      }

      if (
        xhr.status < 200 ||
        xhr.status >= 300 ||
        result.success === false ||
        result.status === false
      ) {
        showMessage(result.message || (isEditing ? 'Failed to update media.' : 'Upload failed.'))
        return
      }

      showMessage(
        isEditing ? 'Gallery item updated successfully.' : 'Media uploaded successfully.',
        'success',
      )
      resetForm()
      setVisible(false)
      await fetchGallery()
    }

    xhr.onerror = () => {
      setSaving(false)
      xhrRef.current = null
      showMessage('Network error. Please check your connection.')
    }
    xhr.onabort = () => {
      setSaving(false)
      xhrRef.current = null
      showMessage('Request cancelled.')
    }
    xhr.ontimeout = () => {
      setSaving(false)
      xhrRef.current = null
      showMessage('The request timed out. Please try again.')
    }
    xhr.send(formData)
  }

  const cancelRequest = () => xhrRef.current?.abort()

  const handleDelete = async (item) => {
    const id = getItemId(item)
    if (!id || deletingId) return
    if (
      !window.confirm(`Delete "${item.title || 'this media item'}"? This action cannot be undone.`)
    )
      return

    setDeletingId(id)
    setMessage('')
    try {
      const response = await fetch(`${API}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (!response.ok || result.success === false || result.status === false) {
        throw new Error(result.message || 'Failed to delete gallery item.')
      }

      if (getItemId(editingItem) === id) {
        resetForm()
        setVisible(false)
      }
      showMessage('Gallery item deleted successfully.', 'success')
      await fetchGallery()
    } catch (error) {
      console.error('Delete gallery item failed:', error)
      showMessage(error.message || 'Network error while deleting.')
    } finally {
      setDeletingId(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(galleryItems.length / ITEMS_PER_PAGE))
  const paginatedItems = galleryItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const mediaUrl = (item) => item.url || item.mediaUrl || item.filePath || item.media || ''
  const isVideoItem = (item) => {
    const url = mediaUrl(item)
    return (
      item.mediaType?.includes('video') ||
      item.type?.includes('video') ||
      /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
    )
  }
  const isPublishedItem = (item) =>
    item.isPublished === true ||
    item.isPublished === 'true' ||
    item.isPublished === 1 ||
    item.isPublished === '1'

  return (
    <div className="container-fluid py-3">
      {message && (
        <div className={`alert alert-${messageType} alert-dismissible`} role="alert">
          {message}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setMessage('')}
          />
        </div>
      )}

      <CCard className="shadow border-0 rounded-4 mb-4">
        <CCardHeader className="bg-dark text-white fw-bold px-4 py-3">
          <div className="d-flex justify-content-between align-items-center gap-3">
            <h5 className="mb-0">
              <i className="bi bi-images me-2 text-warning" /> Gallery Media
            </h5>
            <CButton
              color="light"
              variant="outline"
              className="fw-semibold rounded-pill"
              onClick={openCreate}
            >
              <CIcon icon={cilPlus} className="me-1" /> Add Media
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <CTable striped responsive bordered hover align="middle">
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Preview</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: 190 }}>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {fetchingList ? (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center py-4">
                    <CSpinner size="sm" className="me-2" /> Loading gallery...
                  </CTableDataCell>
                </CTableRow>
              ) : paginatedItems.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center text-body-secondary py-4">
                    No gallery media found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                paginatedItems.map((item, index) => {
                  const id = getItemId(item)
                  const url = mediaUrl(item)
                  const video = isVideoItem(item)
                  const published = isPublishedItem(item)
                  return (
                    <CTableRow key={id || index}>
                      <CTableDataCell>
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div
                          style={{
                            width: 76,
                            height: 56,
                            overflow: 'hidden',
                            borderRadius: 7,
                            background: '#f2f4f7',
                          }}
                        >
                          {url ? (
                            video ? (
                              <video
                                src={url}
                                muted
                                playsInline
                                preload="metadata"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <img
                                src={url}
                                alt={item.title || 'Gallery media'}
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            )
                          ) : (
                            <span className="small text-muted">No preview</span>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="fw-semibold">
                        {item.title || 'Untitled'}
                      </CTableDataCell>
                      <CTableDataCell>{video ? 'Video' : 'Image'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={published ? 'success' : 'secondary'}>
                          {published ? 'Published' : 'Draft'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          color="warning"
                          className="rounded-pill px-3 shadow-sm fw-semibold me-2 mb-1"
                          onClick={() => handleEdit(item)}
                          disabled={saving || deletingId !== null}
                        >
                          <CIcon icon={cilPencil} className="me-1" /> Edit
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          className="rounded-pill px-3 shadow-sm fw-semibold mb-1"
                          onClick={() => handleDelete(item)}
                          disabled={saving || deletingId !== null}
                        >
                          {deletingId === id ? (
                            <>
                              <CSpinner size="sm" className="me-1" /> Deleting...
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilTrash} className="me-1" /> Delete
                            </>
                          )}
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              )}
            </CTableBody>
          </CTable>

          {totalPages > 1 && (
            <div className="d-flex justify-content-end mt-3">
              <CPagination align="end" className="mb-0">
                {Array.from({ length: totalPages }, (_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      <COffcanvas
        placement="end"
        visible={visible}
        onHide={() => {
          if (!saving) {
            setVisible(false)
            resetForm()
          }
        }}
        backdrop="static"
        scroll={false}
        style={{ width: 'min(560px, 100vw)' }}
      >
        <COffcanvasHeader className="bg-dark text-white fw-bold" closeButton={!saving}>
          {editingItem ? 'Update Gallery Media' : 'Add Gallery Media'}
        </COffcanvasHeader>
        <COffcanvasBody>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              label="Media Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter media title"
              maxLength={200}
              required
              disabled={saving}
              className="mb-3"
            />

            {editingItem && (
              <div className="mb-3 p-3 border rounded-3">
                <div className="fw-semibold mb-2">Current media</div>
                {mediaUrl(editingItem) ? (
                  isVideoItem(editingItem) ? (
                    <video
                      src={mediaUrl(editingItem)}
                      controls
                      style={{ maxWidth: '100%', maxHeight: 180 }}
                    />
                  ) : (
                    <img
                      src={mediaUrl(editingItem)}
                      alt={editingItem.title || 'Current media'}
                      style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain' }}
                    />
                  )
                ) : (
                  <small className="text-body-secondary">No current media URL found.</small>
                )}
              </div>
            )}

            <div className="mb-3">
              <CFormInput
                ref={fileInputRef}
                type="file"
                label={editingItem ? 'Replace Media (Optional)' : 'Select Image or Video'}
                accept={ACCEPTED_TYPES.join(',')}
                disabled={saving}
                onChange={(e) => selectFile(e.target.files?.[0] || null)}
              />
              <small className="text-body-secondary">
                {editingItem ? 'Leave empty to keep the current media.' : 'Required for new items.'}{' '}
                Maximum size: 200 MB.
              </small>
            </div>

            {file && (
              <div className="d-flex align-items-center gap-3 border rounded-3 p-2 mb-3">
                <div
                  style={{
                    width: 84,
                    height: 64,
                    flex: '0 0 84px',
                    overflow: 'hidden',
                    borderRadius: 6,
                    background: '#f2f4f7',
                  }}
                >
                  {isImage ? (
                    <img
                      src={objectUrlRef.current || ''}
                      alt="Selected preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <video
                      src={objectUrlRef.current || ''}
                      muted
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="flex-grow-1 text-break">
                  <div className="fw-semibold small">{file.name}</div>
                  <small className="text-body-secondary">
                    {isImage ? 'Image' : isVideo ? 'Video' : 'Media'} · {formatSize(file.size)}
                  </small>
                </div>
                <CButton
                  type="button"
                  size="sm"
                  color="danger"
                  variant="outline"
                  disabled={saving}
                  onClick={removeFile}
                >
                  Remove
                </CButton>
              </div>
            )}

            <div className="border rounded-3 p-3 mb-3">
              <CFormCheck
                id="gallery-publish"
                checked={publish}
                disabled={saving}
                onChange={(e) => setPublish(e.target.checked)}
                label="Publish immediately"
              />
              <small className="text-body-secondary d-block mt-1">
                {publish
                  ? 'This item will be visible in the public gallery.'
                  : 'This item will be saved as a draft.'}
              </small>
            </div>

            {saving && (
              <div className="mb-3" role="status">
                <div className="d-flex justify-content-between small mb-1">
                  <span>{editingItem ? 'Updating media...' : 'Uploading media...'}</span>
                  <span>{progress}%</span>
                </div>
                <div className="progress" style={{ height: 7 }}>
                  <div className="progress-bar bg-danger" style={{ width: `${progress}%` }} />
                </div>
                <CButton
                  type="button"
                  size="sm"
                  color="secondary"
                  variant="outline"
                  className="mt-2"
                  onClick={cancelRequest}
                >
                  Cancel request
                </CButton>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              <CButton
                type="button"
                color="secondary"
                variant="outline"
                className="rounded-pill px-3"
                disabled={saving}
                onClick={() => {
                  resetForm()
                  setVisible(false)
                }}
              >
                Cancel
              </CButton>
              <CButton
                type="submit"
                color={editingItem ? 'warning' : 'success'}
                className="rounded-pill px-4 fw-semibold"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    {editingItem ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <CIcon icon={editingItem ? cilPencil : cilCloudUpload} className="me-2" />
                    {editingItem ? 'Update Media' : 'Upload Media'}
                  </>
                )}
              </CButton>
            </div>
          </CForm>
        </COffcanvasBody>
      </COffcanvas>
    </div>
  )
}
