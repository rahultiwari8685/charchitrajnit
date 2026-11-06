// import React, { useEffect, useRef, useState } from 'react'
// import secureLocalStorage from 'react-secure-storage'

// const API = 'https://api.bharat19express.com'
// const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200 MB

// const ACCEPTED_TYPES = [
//   'image/jpeg',
//   'image/png',
//   'image/webp',
//   'image/avif',
//   'image/gif',
//   'video/mp4',
//   'video/webm',
//   'video/ogg',
//   'video/quicktime',
// ]

// export default function GalleryManager() {
//   // Gallery List state
//   const [galleryItems, setGalleryItems] = useState([])
//   const [fetchingList, setFetchingList] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 8

//   // Form / Edit state
//   const [editingItem, setEditingItem] = useState(null)
//   const [title, setTitle] = useState('')
//   const [file, setFile] = useState(null)
//   const [publish, setPublish] = useState(true)
//   const [loading, setLoading] = useState(false)
//   const [deletingId, setDeletingId] = useState(null)
//   const [progress, setProgress] = useState(0)
//   const [message, setMessage] = useState('')
//   const [messageType, setMessageType] = useState('')
//   const [dragging, setDragging] = useState(false)

//   const fileInputRef = useRef(null)
//   const xhrRef = useRef(null)
//   const objectUrlRef = useRef(null)

//   const isImage = file?.type.startsWith('image/')
//   const isVideo = file?.type.startsWith('video/')

//   // Helper to fetch token
//   const getAuthToken = () => {
//     try {
//       const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')
//       return loginInfo?.token || ''
//     } catch {
//       return ''
//     }
//   }

//   // --- Fetch List ---
//   const fetchGallery = async () => {
//     setFetchingList(true)
//     try {
//       const token = getAuthToken()
//       const res = await fetch(`${API}/api/gallery`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : '',
//         },
//       })
//       const data = await res.json()
//       if (data?.data && Array.isArray(data.data)) {
//         setGalleryItems(data.data)
//       } else if (Array.isArray(data)) {
//         setGalleryItems(data)
//       }
//     } catch (err) {
//       console.error('Failed to fetch gallery items:', err)
//     } finally {
//       setFetchingList(false)
//     }
//   }

//   useEffect(() => {
//     fetchGallery()

//     return () => {
//       if (objectUrlRef.current) {
//         URL.revokeObjectURL(objectUrlRef.current)
//       }
//       xhrRef.current = null
//     }
//   }, [])

//   function showMessage(text, type = 'error') {
//     setMessage(text)
//     setMessageType(type)
//   }

//   function selectFile(selectedFile) {
//     setMessage('')
//     setProgress(0)

//     if (!selectedFile) return

//     if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
//       showMessage(
//         'Unsupported file format. Please choose a JPG, PNG, WEBP, AVIF, GIF, MP4, WEBM, OGG or MOV file.',
//       )
//       return
//     }

//     if (selectedFile.size > MAX_FILE_SIZE) {
//       showMessage('File size must be 200 MB or less.')
//       return
//     }

//     if (objectUrlRef.current) {
//       URL.revokeObjectURL(objectUrlRef.current)
//     }

//     objectUrlRef.current = URL.createObjectURL(selectedFile)
//     setFile(selectedFile)
//   }

//   function removeFile() {
//     if (objectUrlRef.current) {
//       URL.revokeObjectURL(objectUrlRef.current)
//       objectUrlRef.current = null
//     }
//     setFile(null)
//     setProgress(0)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   function resetForm() {
//     setTitle('')
//     removeFile()
//     setPublish(true)
//     setEditingItem(null)
//     setMessage('')
//     setProgress(0)
//   }

//   function formatSize(bytes) {
//     if (!bytes) return ''
//     if (bytes < 1024 * 1024) {
//       return `${(bytes / 1024).toFixed(0)} KB`
//     }
//     return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
//   }

//   // --- Start Edit ---
//   const handleEdit = (item) => {
//     setEditingItem(item)
//     setTitle(item.title || '')
//     setPublish(item.isPublished === true || item.isPublished === 'true' || item.isPublished === 1)
//     removeFile()
//     setMessage('')
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }

//   // --- Delete Media ---
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this media item?')) return

//     setDeletingId(id)
//     try {
//       const token = getAuthToken()
//       const res = await fetch(`${API}/api/gallery/${id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: token ? `Bearer ${token}` : '',
//           'Content-Type': 'application/json',
//         },
//       })
//       const result = await res.json()

//       if (res.ok && result.success !== false && result.status !== false) {
//         if (editingItem?._id === id || editingItem?.id === id) {
//           resetForm()
//         }
//         await fetchGallery()
//       } else {
//         alert(result.message || 'Failed to delete gallery item.')
//       }
//     } catch (error) {
//       console.error('Error deleting media:', error)
//       alert('Network error while deleting.')
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   // --- Create / Update Submit ---
//   function handleSubmit(event) {
//     event.preventDefault()
//     setMessage('')
//     setProgress(0)

//     if (!title.trim()) {
//       showMessage('Please enter a title for this gallery item.')
//       return
//     }

//     if (!editingItem && !file) {
//       showMessage('Please select an image or video to upload.')
//       return
//     }

//     const formData = new FormData()
//     formData.append('title', title.trim())
//     formData.append('isPublished', String(publish))

//     if (file) {
//       formData.append('media', file)
//     }

//     setLoading(true)

//     const xhr = new XMLHttpRequest()
//     xhrRef.current = xhr

//     const isEdit = Boolean(editingItem)
//     const targetId = editingItem?._id || editingItem?.id
//     const endpoint = isEdit ? `${API}/api/gallery/${targetId}` : `${API}/api/gallery`
//     const method = isEdit ? 'PUT' : 'POST'

//     xhr.open(method, endpoint)

//     const token = getAuthToken()
//     if (token) {
//       xhr.setRequestHeader('Authorization', `Bearer ${token}`)
//     }

//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         setProgress(Math.round((event.loaded / event.total) * 100))
//       }
//     }

//     xhr.onload = () => {
//       setLoading(false)
//       xhrRef.current = null

//       let result
//       try {
//         result = JSON.parse(xhr.responseText)
//       } catch {
//         showMessage('The server returned an unexpected response. Please try again.')
//         return
//       }

//       if (
//         xhr.status < 200 ||
//         xhr.status >= 300 ||
//         result.success === false ||
//         result.status === false
//       ) {
//         showMessage(result.message || 'Operation failed. Please try again.')
//         return
//       }

//       setProgress(100)
//       showMessage(
//         isEdit ? 'Gallery item updated successfully!' : 'Media uploaded successfully!',
//         'success',
//       )

//       resetForm()
//       fetchGallery()
//     }

//     xhr.onerror = () => {
//       setLoading(false)
//       xhrRef.current = null
//       showMessage('Network error. Check your connection and try again.')
//     }

//     xhr.onabort = () => {
//       setLoading(false)
//       xhrRef.current = null
//       showMessage('Upload cancelled.')
//     }

//     xhr.ontimeout = () => {
//       setLoading(false)
//       xhrRef.current = null
//       showMessage('The request timed out. Please try again.')
//     }

//     xhr.timeout = 15 * 60 * 1000 // 15 mins
//     xhr.send(formData)
//   }

//   function cancelUpload() {
//     xhrRef.current?.abort()
//   }

//   // Pagination calculation
//   const totalPages = Math.ceil(galleryItems.length / itemsPerPage) || 1
//   const paginatedItems = galleryItems.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   )

//   return (
//     <div className="gm-page">
//       <style>{`
//         .gm-page {
//           --gm-primary: #c91f2c;
//           --gm-text: #182230;
//           --gm-muted: #667085;
//           --gm-border: #e4e7ec;
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 28px 20px 60px;
//           color: var(--gm-text);
//           font-family: Inter, system-ui, -apple-system, sans-serif;
//         }
//         .gm-page * { box-sizing: border-box; }
//         .gm-card {
//           background: #fff;
//           border: 1px solid var(--gm-border);
//           border-radius: 16px;
//           box-shadow: 0 4px 20px rgba(16,24,40,.04);
//           overflow: hidden;
//           margin-bottom: 35px;
//         }
//         .gm-card-head {
//           padding: 20px 24px;
//           border-bottom: 1px solid #eef0f3;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }
//         .gm-card-head h2 { margin: 0; font-size: 19px; font-weight: 750; }
//         .gm-card-head p { margin: 4px 0 0; color: var(--gm-muted); font-size: 13px; }
//         .gm-form { padding: 24px; }
//         .gm-field { margin-bottom: 22px; }
//         .gm-label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 700; color: #344054; }
//         .gm-required { color: var(--gm-primary); }
//         .gm-input {
//           width: 100%;
//           min-height: 44px;
//           padding: 10px 14px;
//           border: 1px solid #d0d5dd;
//           border-radius: 8px;
//           font-size: 14px;
//           outline: none;
//         }
//         .gm-input:focus { border-color: var(--gm-primary); box-shadow: 0 0 0 3px rgba(201,31,44,.1); }
//         .gm-drop {
//           min-height: 160px;
//           padding: 20px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           text-align: center;
//           border: 1.5px dashed #c8cdd5;
//           border-radius: 10px;
//           background: #fafbfc;
//           cursor: pointer;
//         }
//         .gm-drop:hover { border-color: var(--gm-primary); background: #fff7f7; }
//         .gm-file {
//           margin-top: 14px;
//           padding: 12px;
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           border: 1px solid var(--gm-border);
//           border-radius: 10px;
//         }
//         .gm-preview {
//           width: 76px;
//           height: 60px;
//           flex: 0 0 76px;
//           background: #f2f4f7;
//           border-radius: 6px;
//           overflow: hidden;
//         }
//         .gm-preview img, .gm-preview video { width: 100%; height: 100%; object-fit: cover; }
//         .gm-file-info { flex: 1; min-width: 0; }
//         .gm-file-name { font-size: 13px; font-weight: 700; word-break: break-all; margin-bottom: 4px; }
//         .gm-file-meta { font-size: 12px; color: var(--gm-muted); }
//         .gm-remove {
//           border: 1px solid #f0c6ca;
//           color: #b4232d;
//           background: #fff;
//           border-radius: 6px;
//           padding: 6px 12px;
//           font-size: 12px;
//           cursor: pointer;
//         }
//         .gm-publish {
//           display: flex;
//           align-items: flex-start;
//           gap: 12px;
//           padding: 14px;
//           border: 1px solid var(--gm-border);
//           border-radius: 8px;
//           background: #fcfcfd;
//         }
//         .gm-publish input { width: 17px; height: 17px; accent-color: var(--gm-primary); margin-top: 2px; }
//         .gm-publish label { cursor: pointer; }
//         .gm-publish strong { display: block; font-size: 13px; }
//         .gm-publish small { color: var(--gm-muted); font-size: 12px; }
//         .gm-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 22px; }
//         .gm-button {
//           min-height: 42px;
//           padding: 10px 20px;
//           border-radius: 8px;
//           font-size: 14px;
//           font-weight: 700;
//           cursor: pointer;
//         }
//         .gm-button-primary { border: 1px solid var(--gm-primary); background: var(--gm-primary); color: #fff; }
//         .gm-button-secondary { border: 1px solid var(--gm-border); background: #fff; color: #344054; }
//         .gm-button:disabled { opacity: .55; cursor: not-allowed; }
//         .gm-message {
//           margin-top: 18px;
//           padding: 12px 14px;
//           border-radius: 8px;
//           font-size: 13px;
//         }
//         .gm-message.success { background: #ecfdf3; color: #027a48; border: 1px solid #abefc6; }
//         .gm-message.error { background: #fff1f2; color: #b4232d; border: 1px solid #fecdd3; }
//         .gm-progress-track { width: 100%; height: 7px; background: #eaecf0; border-radius: 99px; overflow: hidden; margin: 8px 0; }
//         .gm-progress-fill { height: 100%; background: var(--gm-primary); }

//         /* Table styles */
//         .gm-table-wrap { overflow-x: auto; }
//         .gm-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
//         .gm-table th { background: #182230; color: #fff; padding: 12px 14px; font-weight: 600; }
//         .gm-table td { padding: 12px 14px; border-bottom: 1px solid var(--gm-border); vertical-align: middle; }
//         .gm-badge {
//           display: inline-block;
//           padding: 3px 8px;
//           border-radius: 12px;
//           font-size: 11px;
//           font-weight: 700;
//         }
//         .gm-badge-published { background: #ecfdf3; color: #027a48; }
//         .gm-badge-draft { background: #f2f4f7; color: #475467; }
//         .gm-btn-sm {
//           padding: 5px 12px;
//           border-radius: 6px;
//           font-size: 12px;
//           font-weight: 600;
//           cursor: pointer;
//           border: 1px solid transparent;
//           margin-right: 6px;
//         }
//         .gm-btn-edit { background: #fffaeb; color: #b54708; border-color: #fedf89; }
//         .gm-btn-delete { background: #fef3f2; color: #b4232d; border-color: #fecdca; }
//         .gm-pagination { display: flex; justify-content: flex-end; gap: 6px; padding: 16px 20px; }
//         .gm-page-btn {
//           min-width: 32px;
//           height: 32px;
//           padding: 0 6px;
//           border: 1px solid var(--gm-border);
//           background: #fff;
//           border-radius: 6px;
//           font-size: 12px;
//           cursor: pointer;
//         }
//         .gm-page-btn.active { background: var(--gm-primary); color: #fff; border-color: var(--gm-primary); }
//       `}</style>

//       {/* Upload & Edit Form */}
//       <section className="gm-card">
//         <div className="gm-card-head">
//           <div>
//             <h2>{editingItem ? 'Edit gallery item' : 'Add gallery media'}</h2>
//             <p>
//               {editingItem
//                 ? `Editing media ID: ${editingItem._id || editingItem.id}`
//                 : 'Upload images or videos to Bharat19Express.'}
//             </p>
//           </div>
//           {editingItem && (
//             <button type="button" className="gm-button gm-button-secondary" onClick={resetForm}>
//               Cancel Edit
//             </button>
//           )}
//         </div>

//         <form className="gm-form" onSubmit={handleSubmit}>
//           <div className="gm-field">
//             <label className="gm-label" htmlFor="gm-title">
//               Media title <span className="gm-required">*</span>
//             </label>
//             <input
//               id="gm-title"
//               className="gm-input"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g. Latest news coverage"
//               maxLength={200}
//               required
//               disabled={loading}
//             />
//           </div>

//           <div className="gm-field">
//             <span className="gm-label">
//               {editingItem ? 'Replace Media (Optional)' : 'Select Image or Video'}{' '}
//               {!editingItem && <span className="gm-required">*</span>}
//             </span>

//             <input
//               ref={fileInputRef}
//               id="gm-file"
//               type="file"
//               accept={ACCEPTED_TYPES.join(',')}
//               hidden
//               disabled={loading}
//               onChange={(e) => selectFile(e.target.files?.[0] || null)}
//             />

//             <label
//               htmlFor="gm-file"
//               className="gm-drop"
//               onDragOver={(e) => {
//                 e.preventDefault()
//                 if (!loading) setDragging(true)
//               }}
//               onDragLeave={() => setDragging(false)}
//               onDrop={(e) => {
//                 e.preventDefault()
//                 setDragging(false)
//                 if (!loading) selectFile(e.dataTransfer.files?.[0])
//               }}
//             >
//               <strong>{file ? 'File selected' : 'Drag and drop or click to browse'}</strong>
//               <small style={{ color: 'var(--gm-muted)', marginTop: 4 }}>
//                 {editingItem
//                   ? 'Leave blank to keep the current media file.'
//                   : 'JPG, PNG, WEBP, AVIF, GIF, MP4, WEBM, OGG, MOV (up to 200 MB)'}
//               </small>
//             </label>

//             {file && (
//               <div className="gm-file">
//                 <div className="gm-preview">
//                   {isImage ? (
//                     <img src={objectUrlRef.current || ''} alt="Preview" />
//                   ) : (
//                     <video src={objectUrlRef.current || ''} muted playsInline />
//                   )}
//                 </div>
//                 <div className="gm-file-info">
//                   <div className="gm-file-name">{file.name}</div>
//                   <div className="gm-file-meta">
//                     {isImage ? 'Image' : 'Video'} · {formatSize(file.size)}
//                   </div>
//                 </div>
//                 <button type="button" className="gm-remove" disabled={loading} onClick={removeFile}>
//                   Remove
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="gm-publish">
//             <input
//               id="gm-publish"
//               type="checkbox"
//               checked={publish}
//               disabled={loading}
//               onChange={(e) => setPublish(e.target.checked)}
//             />
//             <label htmlFor="gm-publish">
//               <strong>Publish immediately</strong>
//               <small>
//                 {publish ? 'Visible in public gallery immediately.' : 'Saved as draft.'}
//               </small>
//             </label>
//           </div>

//           {loading && (
//             <div style={{ marginTop: 18 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
//                 <span>Uploading…</span>
//                 <span>{progress}%</span>
//               </div>
//               <div className="gm-progress-track">
//                 <div className="gm-progress-fill" style={{ width: `${progress}%` }} />
//               </div>
//               <button
//                 type="button"
//                 className="gm-button gm-button-secondary"
//                 style={{ marginTop: 8 }}
//                 onClick={cancelUpload}
//               >
//                 Cancel
//               </button>
//             </div>
//           )}

//           {message && (
//             <div className={`gm-message ${messageType}`}>
//               <span>{message}</span>
//             </div>
//           )}

//           <div className="gm-actions">
//             <button
//               type="button"
//               className="gm-button gm-button-secondary"
//               disabled={loading}
//               onClick={resetForm}
//             >
//               Reset
//             </button>
//             <button type="submit" className="gm-button gm-button-primary" disabled={loading}>
//               {loading ? `Saving... ${progress}%` : editingItem ? 'Update Media' : 'Upload Media'}
//             </button>
//           </div>
//         </form>
//       </section>

//       {/* Gallery Media List Table */}
//       <section className="gm-card">
//         <div className="gm-card-head">
//           <div>
//             <h2>Existing Media Items</h2>
//             <p>Manage, edit, or remove media items from the database.</p>
//           </div>
//         </div>

//         <div className="gm-table-wrap">
//           <table className="gm-table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Preview</th>
//                 <th>Title</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fetchingList ? (
//                 <tr>
//                   <td colSpan={5} style={{ textAlign: 'center', padding: '30px' }}>
//                     Loading media...
//                   </td>
//                 </tr>
//               ) : paginatedItems.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     style={{ textAlign: 'center', padding: '30px', color: 'var(--gm-muted)' }}
//                   >
//                     No media items found.
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedItems.map((item, index) => {
//                   const mediaUrl = item.url || item.mediaUrl || item.filePath || ''
//                   const isItemVideo =
//                     item.mediaType?.includes('video') ||
//                     item.type?.includes('video') ||
//                     /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl)
//                   const isPublished =
//                     item.isPublished === true ||
//                     item.isPublished === 'true' ||
//                     item.isPublished === 1

//                   const itemId = item._id || item.id

//                   return (
//                     <tr key={itemId || index}>
//                       <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                       <td style={{ width: 80 }}>
//                         <div className="gm-preview" style={{ width: 60, height: 45 }}>
//                           {isItemVideo ? (
//                             <video src={mediaUrl} muted playsInline />
//                           ) : (
//                             <img
//                               src={mediaUrl || 'https://via.placeholder.com/60x45'}
//                               alt="Media"
//                             />
//                           )}
//                         </div>
//                       </td>
//                       <td style={{ fontWeight: 600 }}>{item.title}</td>
//                       <td>
//                         <span
//                           className={`gm-badge ${isPublished ? 'gm-badge-published' : 'gm-badge-draft'}`}
//                         >
//                           {isPublished ? 'Published' : 'Draft'}
//                         </span>
//                       </td>
//                       <td>
//                         <button
//                           type="button"
//                           className="gm-btn-sm gm-btn-edit"
//                           onClick={() => handleEdit(item)}
//                           disabled={loading || deletingId !== null}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           type="button"
//                           className="gm-btn-sm gm-btn-delete"
//                           onClick={() => handleDelete(itemId)}
//                           disabled={deletingId === itemId || loading}
//                         >
//                           {deletingId === itemId ? 'Deleting...' : 'Delete'}
//                         </button>
//                       </td>
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {totalPages > 1 && (
//           <div className="gm-pagination">
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i + 1}
//                 type="button"
//                 className={`gm-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
//                 onClick={() => setCurrentPage(i + 1)}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   )
// }

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

const API = 'https://api.bharat19express.com'
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
