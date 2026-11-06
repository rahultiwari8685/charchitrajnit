// import React, { useState, useEffect } from 'react'
// import { useForm } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'
// import setting from '../../../setting.json'

// import {
//   CCard,
//   CCardBody,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CRow,
//   CCol,
//   CCardHeader,
//   CFormCheck,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem,
// } from '@coreui/react'
// import secureLocalStorage from 'react-secure-storage'
// import { useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast'
// import { Editor } from '@tinymce/tinymce-react'

// const schema = yup.object().shape({
//   title: yup.string().required('Title is required'),
//   subtitle: yup.string().required('Subtitle is required'),
//   videoType: yup.string().required('Video source is required'),
//   type: yup.string().required('Video source is required'),
//   description: yup.string().required('Description is required'),
//   slug: yup.string().required('Slug is required'),
//   thumbnail: yup.mixed().when('videoType', {
//     is: '2',
//     then: (schema) =>
//       schema
//         .test('required', 'Thumbnail is required', (value) => value && value.length > 0)
//         .test('fileSize', 'Image size must be less than 1 MB', (value) => {
//           if (!value || value.length === 0) return true
//           return value[0].size <= 1024 * 1024
//         }),
//     otherwise: (schema) => schema.notRequired(),
//   }),
// })

// const News = () => {
//   // const [slugEdited, setSlugEdited] = useState(false)
//   const [editingNews, setEditingNews] = useState(null)
//   const [newsList, setNewsList] = useState([])
//   const [categoriesList, setCategoryList] = useState([])

//   const [content, setContent] = useState('')

//   const [draftSaved, setDraftSaved] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const navigate = useNavigate()
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       title: '',
//       subtitle: '',
//       description: '',
//       slug: '',
//       categories: [],
//       videoType: '',
//       type: '2',
//       youtubeUrl: '',
//       videoFile: null,
//       thumbnail: null,
//       scheduledAt: '',
//     },
//   })

//   const formDataValues = watch()

//   const [thumbnailPreview, setThumbnailPreview] = useState(null)
//   const [videoPreview, setVideoPreview] = useState(null)

//   useEffect(() => {
//     if (!formDataValues.thumbnail?.[0]) {
//       setThumbnailPreview(null)
//       return
//     }

//     const objectUrl = URL.createObjectURL(formDataValues.thumbnail[0])

//     setThumbnailPreview(objectUrl)

//     return () => {
//       URL.revokeObjectURL(objectUrl)
//     }
//   }, [formDataValues.thumbnail])

//   useEffect(() => {
//     if (!formDataValues.videoFile?.[0]) {
//       setVideoPreview(null)
//       return
//     }

//     const objectUrl = URL.createObjectURL(formDataValues.videoFile[0])

//     setVideoPreview(objectUrl)

//     return () => {
//       URL.revokeObjectURL(objectUrl)
//     }
//   }, [formDataValues.videoFile])

//   useEffect(() => {
//     if (formDataValues.type !== '2') return

//     if (!formDataValues.title && !formDataValues.subtitle) {
//       return
//     }

//     const timeout = setTimeout(async () => {
//       try {
//         const formData = new FormData()

//         formData.append('title', formDataValues.title || '')
//         formData.append('subtitle', formDataValues.subtitle || '')
//         formData.append('videoType', formDataValues.videoType || '')
//         formData.append('type', '2')
//         formData.append('author', author)
//         formData.append('slug', formDataValues.slug || '')
//         formData.append('categories', JSON.stringify(formDataValues.categories || []))

//         // formData.append('content', typeof content === 'string' ? content : JSON.stringify(content))
//         formData.append('content', content)

//         // ✅ Auto-save thumbnail
//         if (formDataValues.thumbnail?.[0]) {
//           formData.append('thumbnail', formDataValues.thumbnail[0])
//         }

//         const res = await fetch(`${setting.api}/api/news/auto-save`, {
//           method: 'POST',
//           body: formData,
//         })

//         const result = await res.json()

//         if (result.status) {
//           if (result.data?._id) {
//             setEditingNews(result.data)
//           }

//           setDraftSaved(true)

//           setTimeout(() => {
//             setDraftSaved(false)
//           }, 2000)

//           console.log('Draft auto-saved')
//         }
//       } catch (error) {
//         console.error('Auto save failed', error)
//       }
//     }, 10000)

//     return () => clearTimeout(timeout)
//   }, [formDataValues, content])

//   const toggleCategory = (id) => {
//     const alreadySelected = formDataValues.categories.includes(id)
//     const newCategories = alreadySelected
//       ? formDataValues.categories.filter((c) => c !== id)
//       : [...formDataValues.categories, id]
//     setValue('categories', newCategories)
//   }

//   const getAllCategory = async () => {
//     try {
//       const response = await fetch(setting.api + '/api/categories/getAllCategory', {
//         method: 'GET',
//         mode: 'cors',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + loginInfo?.token,
//         },
//       })

//       const u = await response.json()

//       if (u.status === false) {
//         secureLocalStorage.clear()
//         navigate('/login')
//       } else {
//         setCategoryList(u.data || [])
//       }
//     } catch (error) {
//       console.error('Category fetch failed', error)
//     }
//   }

//   useEffect(() => {
//     getAllCategory()
//   }, [])

//   const getYouTubeId = (url) => {
//     try {
//       const parsedUrl = new URL(url)
//       if (parsedUrl.hostname === 'youtu.be') {
//         return parsedUrl.pathname.slice(1)
//       }
//       if (parsedUrl.searchParams.has('v')) {
//         return parsedUrl.searchParams.get('v')
//       }
//       if (parsedUrl.pathname.includes('/embed/')) {
//         return parsedUrl.pathname.split('/embed/')[1]
//       }
//     } catch (e) {
//       return null
//     }
//     return null
//   }

//   let loginInfo = null

//   try {
//     const storedLogin = secureLocalStorage.getItem('logininfo')

//     if (storedLogin) {
//       loginInfo = typeof storedLogin === 'string' ? JSON.parse(storedLogin) : storedLogin
//     }
//   } catch (error) {
//     console.error('Invalid logininfo in storage', error)
//   }

//   const author = loginInfo?.user?.id

//   const saveNews = async (data) => {
//     if (loading) return

//     setLoading(true)

//     if (data.type === '3' && !data.scheduledAt) {
//       toast.error('Please select schedule date & time')
//       setLoading(false)
//       return
//     }

//     const formData = new FormData()
//     formData.append('title', data.title)
//     formData.append('sub_title', data.subtitle)
//     formData.append('video_type', data.videoType)
//     formData.append('type', data.type)
//     formData.append('slug', data.slug)
//     formData.append('author', author)

//     formData.append('scheduledAt', data.scheduledAt || '')

//     formData.append('categories', JSON.stringify(data.categories))

//     if (data.videoType === '1') {
//       formData.append('youtube_url', data.youtubeUrl)
//     } else if (data.videoType === '2') {
//       formData.append('content', content)

//       if (data.thumbnail?.[0]) formData.append('thumbnail', data.thumbnail[0])
//     }

//     let endpoint = '/api/news/saveNews'

//     if (editingNews?._id) {
//       endpoint = '/api/news/updateNews'
//       formData.append('id', editingNews._id)
//     }

//     try {
//       const res = await fetch(setting.api + endpoint, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           Authorization: 'Bearer ' + loginInfo?.token,
//           // Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
//         },
//       })

//       const result = await res.json()
//       console.log('News API response:', result)

//       if (result.status) {
//         // ✅ store draft id
//         if (result.data?._id) {
//           setEditingNews(result.data)
//         }

//         secureLocalStorage.removeItem('newsDraft')
//         localStorage.removeItem('newsDraft')
//         toast.success(
//           data.type === '3'
//             ? 'News Scheduled Successfully!'
//             : data.type === '2'
//               ? 'Draft Saved Successfully!'
//               : 'News Published Successfully!',
//         )

//         reset({
//           title: '',
//           slug: '',
//           subtitle: '',
//           categories: [],
//           videoType: '2',
//           type: '2',

//           youtubeUrl: '',
//           thumbnail: null,
//         })
//         setContent('')
//         setEditingNews(null)
//         navigate('/PublishedNews')
//       } else {
//         toast.error(result.message || 'Failed to save news')
//       }
//     } catch (error) {
//       toast.error(error.message || 'Something went wrong while saving news')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="d-flex flex-column flex-lg-row gap-4">
//       <CCol lg={formDataValues.videoType === '1' ? 8 : 12}>
//         <CCard className="shadow border-0 rounded-4">
//           <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
//             <h5 className="mb-0">Create News</h5>
//           </CCardHeader>

//           <CCardBody>
//             <CForm onSubmit={handleSubmit(saveNews)}>
//               <CRow className="mb-3">
//                 <CCol md={12}>
//                   <CFormInput
//                     type="text"
//                     label="Title"
//                     placeholder="Enter Title"
//                     {...register('title')}
//                     onChange={(e) => {
//                       setValue('title', e.target.value)
//                       // setSlugEdited(false)
//                     }}
//                   />
//                   {errors.title && <small className="text-danger">{errors.title.message}</small>}
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormInput
//                     type="text"
//                     label="Slug"
//                     placeholder="Enter Slug"
//                     {...register('slug')}
//                   />
//                   {errors.slug && <small className="text-danger">{errors.slug.message}</small>}
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormInput
//                     type="text"
//                     label="Subtitle"
//                     placeholder="Enter SubTitle"
//                     {...register('subtitle')}
//                   />
//                   {errors.subtitle && (
//                     <small className="text-danger">{errors.subtitle.message}</small>
//                   )}
//                 </CCol>

//                 <CCol md={6}>
//                   <p className="mb-2 ">Select Categories</p>
//                   <CDropdown>
//                     <CDropdownToggle color="secondary">
//                       {formDataValues.categories.length > 0
//                         ? categoriesList
//                             .filter((cat) => formDataValues.categories.includes(cat._id))
//                             .map((cat) => cat.name)
//                             .join(', ')
//                         : 'Select Categories'}
//                     </CDropdownToggle>
//                     <CDropdownMenu>
//                       {categoriesList.map((cat) => {
//                         const isSelected = formDataValues.categories.includes(cat._id)
//                         return (
//                           <CDropdownItem key={cat._id}>
//                             <CFormCheck
//                               id={`cat-${cat._id}`}
//                               label={cat.name}
//                               checked={isSelected}
//                               onChange={() => toggleCategory(cat._id)}
//                             />
//                           </CDropdownItem>
//                         )
//                       })}
//                     </CDropdownMenu>
//                   </CDropdown>
//                 </CCol>
//               </CRow>

//               {/* <CRow>
//                 <CCol md={12}>
//                   <p className="mb-2 ">Select Categories</p>
//                   <CDropdown>
//                     <CDropdownToggle color="secondary">
//                       {formDataValues.categories.length > 0
//                         ? categoriesList
//                             .filter((cat) => formDataValues.categories.includes(cat._id))
//                             .map((cat) => cat.name)
//                             .join(', ')
//                         : 'Select Categories'}
//                     </CDropdownToggle>
//                     <CDropdownMenu>
//                       {categoriesList.map((cat) => {
//                         const isSelected = formDataValues.categories.includes(cat._id)
//                         return (
//                           <CDropdownItem key={cat._id}>
//                             <CFormCheck
//                               id={`cat-${cat._id}`}
//                               label={cat.name}
//                               checked={isSelected}
//                               onChange={() => toggleCategory(cat._id)}
//                             />
//                           </CDropdownItem>
//                         )
//                       })}
//                     </CDropdownMenu>
//                   </CDropdown>
//                 </CCol>
//               </CRow> */}

//               <CRow className="mb-3 mt-2">
//                 {/* <CCol md={6}>
//                   <CFormSelect
//                     label="Type"
//                     {...register('type')}
//                     value={formDataValues.type}
//                     onChange={(e) => setValue('type', e.target.value)}
//                   >
//                     <option value="">Select Type</option>
//                     <option value="1">Published</option>
//                     <option value="2">Draft</option>
//                   </CFormSelect>
//                   {errors.type && <small className="text-danger">{errors.type.message}</small>}
//                 </CCol> */}

//                 <CCol md={6}>
//                   <CFormSelect
//                     label="News Type"
//                     {...register('videoType')}
//                     value={formDataValues.videoType}
//                     onChange={(e) => setValue('videoType', e.target.value)}
//                   >
//                     <option value="">Select Type</option>
//                     <option value="1">Youtube Video</option>
//                     <option value="2">Text</option>
//                   </CFormSelect>
//                   {errors.videoType && (
//                     <small className="text-danger">{errors.videoType.message}</small>
//                   )}
//                 </CCol>

//                 <CCol md={6}>
//                   <CFormInput
//                     type="datetime-local"
//                     label="Schedule Publish"
//                     {...register('scheduledAt')}
//                   />
//                 </CCol>
//               </CRow>

//               {formDataValues.videoType === '1' && (
//                 <CFormInput
//                   type="url"
//                   label="YouTube URL"
//                   {...register('youtubeUrl')}
//                   placeholder="https://youtube.com/..."
//                 />
//               )}

//               {formDataValues.videoType === '2' && (
//                 <>
//                   <CCol md={12} className="mb-2">
//                     {formDataValues.videoType === '2' && (
//                       <>
//                         {/* <div
//                           style={{
//                             width: '100%',
//                             height: '250px',
//                             margin: '0 auto',

//                             padding: '10px',
//                             borderRadius: '8px',
//                             overflowY: 'auto',
//                           }}
//                         >
//                           <label className="fw-semibold mb-2">Description</label>
//                           <EditorJSComponent data={content} onChange={setContent} />
//                         </div> */}

//                         <style>
//                           {`
//                                 .cke_notification_warning {
//                                     display: none !important;
//                                 }
//                                 `}
//                         </style>

//                         {/* <CKEditor
//                           editorUrl="https://cdn.ckeditor.com/4.22.1/full/ckeditor.js"
//                           initData={content}
//                           onChange={(event) => {
//                             const html = event.editor.getData()

//                             setContent(html)

//                             setValue('description', html, {
//                               shouldValidate: true,
//                               shouldDirty: true,
//                             })
//                           }}
//                           config={{
//                             versionCheck: false,
//                             height: 400,
//                             allowedContent: true,
//                             autoParagraph: false,
//                             removePlugins: 'resize,elementspath',
//                             extraPlugins: 'font,colorbutton,justify',
//                             disableNativeSpellChecker: false,
//                             toolbarCanCollapse: false,

//                             toolbar: [
//                               {
//                                 name: 'styles',
//                                 items: ['Styles', 'Format', 'Font', 'FontSize'],
//                               },
//                               {
//                                 name: 'basicstyles',
//                                 items: ['Bold', 'Italic', 'Underline', 'Strike'],
//                               },
//                               {
//                                 name: 'paragraph',
//                                 items: [
//                                   'NumberedList',
//                                   'BulletedList',
//                                   'JustifyLeft',
//                                   'JustifyCenter',
//                                   'JustifyRight',
//                                 ],
//                               },
//                               {
//                                 name: 'insert',
//                                 items: ['Image', 'Table'],
//                               },
//                               {
//                                 name: 'links',
//                                 items: ['Link', 'Unlink'],
//                               },
//                             ],
//                           }}
//                         /> */}

//                         {/* <CKEditor
//                           editorUrl="https://cdn.ckeditor.com/4.22.1/full/ckeditor.js"
//                           initData={content}
//                           onChange={(event) => {
//                             const html = event.editor.getData()

//                             setContent(html)

//                             setValue('description', html, {
//                               shouldValidate: true,
//                               shouldDirty: true,
//                             })
//                           }}
//                           config={{
//                             versionCheck: false,
//                             height: 500,
//                             allowedContent: true,

//                             uploadUrl: `${setting.api}/api/upload/ckeditor`,
//                             filebrowserUploadUrl: `${setting.api}/api/upload/ckeditor`,
//                             filebrowserUploadMethod: 'form',

//                             toolbar: [
//                               {
//                                 name: 'clipboard',
//                                 items: [
//                                   'Undo',
//                                   'Redo',
//                                   'Cut',
//                                   'Copy',
//                                   'Paste',
//                                   'PasteText',
//                                   'PasteFromWord',
//                                 ],
//                               },
//                               {
//                                 name: 'styles',
//                                 items: ['Format', 'Font', 'FontSize'],
//                               },
//                               {
//                                 name: 'basicstyles',
//                                 items: [
//                                   'Bold',
//                                   'Italic',
//                                   'Underline',
//                                   'Strike',
//                                   'Subscript',
//                                   'Superscript',
//                                   'RemoveFormat',
//                                 ],
//                               },
//                               {
//                                 name: 'paragraph',
//                                 items: [
//                                   'NumberedList',
//                                   'BulletedList',
//                                   'Outdent',
//                                   'Indent',
//                                   'Blockquote',
//                                   'JustifyLeft',
//                                   'JustifyCenter',
//                                   'JustifyRight',
//                                   'JustifyBlock',
//                                 ],
//                               },
//                               {
//                                 name: 'insert',
//                                 items: [
//                                   'UploadImage',
//                                   'Image',
//                                   'Table',
//                                   'HorizontalRule',
//                                   'SpecialChar',
//                                 ],
//                               },
//                               {
//                                 name: 'links',
//                                 items: ['Link', 'Unlink', 'Anchor'],
//                               },
//                               {
//                                 name: 'document',
//                                 items: ['Source', 'Maximize'],
//                               },
//                             ],
//                           }}

//                         /> */}

//                         <Editor
//                           apiKey="okwya9fvn8y65h8ufs9cpsvbv2a4yo789vbfvbfr3rkfjp32"
//                           value={content}
//                           onEditorChange={(newValue) => {
//                             setContent(newValue)

//                             setValue('description', newValue, {
//                               shouldValidate: true,
//                               shouldDirty: true,
//                             })
//                           }}
//                           init={{
//                             height: 600,

//                             menubar: true,

//                             branding: false,

//                             plugins: [
//                               'advlist',
//                               'autolink',
//                               'lists',
//                               'link',
//                               'image',
//                               'charmap',
//                               'preview',
//                               'anchor',
//                               'searchreplace',
//                               'visualblocks',
//                               'code',
//                               'fullscreen',
//                               'insertdatetime',
//                               'media',
//                               'table',
//                               'wordcount',
//                             ],

//                             toolbar:
//                               'undo redo | styles | bold italic underline | ' +
//                               'alignleft aligncenter alignright alignjustify | ' +
//                               'bullist numlist outdent indent | ' +
//                               'link image media table | ' +
//                               'code fullscreen',

//                             images_upload_handler: async (blobInfo) => {
//                               const formData = new FormData()

//                               formData.append('file', blobInfo.blob(), blobInfo.filename())

//                               const response = await fetch(`${setting.api}/api/upload/image`, {
//                                 method: 'POST',
//                                 body: formData,
//                               })

//                               const result = await response.json()

//                               if (!response.ok) {
//                                 throw new Error(result.message || 'Upload failed')
//                               }

//                               return result.location
//                             },

//                             images_reuse_filename: true,
//                           }}
//                         />

//                         {errors.description && (
//                           <p className="text-danger small mt-1">{errors.description.message}</p>
//                         )}

//                         <CCol md={12} className="mb-3">
//                           <CFormInput
//                             type="file"
//                             label="Thumbnail"
//                             accept="image/*"
//                             {...register('thumbnail')}
//                           />
//                           {errors.thumbnail && (
//                             <small className="text-danger">{errors.thumbnail.message}</small>
//                           )}
//                         </CCol>
//                       </>
//                     )}
//                   </CCol>
//                 </>
//               )}

//               {draftSaved && <p className="text-success small mt-3">Draft auto-saved</p>}

//               <div className="d-flex justify-content-end mt-4">
//                 {/* <CButton
//                   color="primary"
//                   type="button"
//                   disabled={loading}
//                   onClick={() => {
//                     setValue('type', '1')
//                     handleSubmit(saveNews)()
//                   }}
//                 >
//                   {loading ? 'Saving...' : 'Publish'}
//                 </CButton> */}

//                 <div className="d-flex gap-2 justify-content-end">
//                   <CButton
//                     color="warning"
//                     type="button"
//                     onClick={() => {
//                       setValue('type', '2')
//                       handleSubmit(saveNews)()
//                     }}
//                   >
//                     Save Draft
//                   </CButton>

//                   <CButton
//                     color="info"
//                     type="button"
//                     onClick={() => {
//                       setValue('type', '3')
//                       handleSubmit(saveNews)()
//                     }}
//                   >
//                     Schedule
//                   </CButton>

//                   <CButton
//                     color="primary"
//                     type="button"
//                     onClick={() => {
//                       setValue('type', '1')
//                       handleSubmit(saveNews)()
//                     }}
//                   >
//                     Publish Now
//                   </CButton>
//                 </div>
//               </div>
//             </CForm>
//           </CCardBody>
//         </CCard>
//       </CCol>

//       {formDataValues.videoType === '1' && (
//         <CCol lg={4}>
//           <CCard className="shadow border-0 rounded-4 text-dark">
//             <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
//               <h5 className="mb-0">Live Preview</h5>
//             </CCardHeader>

//             <CCardBody>
//               {formDataValues.title && (
//                 <p>
//                   <strong>Title:</strong> {formDataValues.title}
//                 </p>
//               )}
//               {formDataValues.categories?.length > 0 && (
//                 <p>
//                   <strong>Categories:</strong>{' '}
//                   {categoriesList
//                     .filter((cat) => formDataValues.categories.includes(cat._id))
//                     .map((cat) => cat.name)
//                     .join(', ')}
//                 </p>
//               )}

//               {formDataValues.videoType === '1' &&
//                 formDataValues.youtubeUrl &&
//                 (() => {
//                   const videoId = getYouTubeId(formDataValues.youtubeUrl)
//                   return videoId ? (
//                     <iframe
//                       width="100%"
//                       height="250"
//                       className="rounded mb-3"
//                       src={`https://www.youtube.com/embed/${videoId}`}
//                       title="YouTube Preview"
//                       allowFullScreen
//                     ></iframe>
//                   ) : (
//                     <p className="text-danger">Invalid YouTube URL</p>
//                   )
//                 })()}

//               {formDataValues.videoType === '2' && formDataValues.videoFile?.[0] && (
//                 <video width="100%" height="auto" className="rounded" controls>
//                   <source src={videoPreview} />
//                   {/* <source src={URL.createObjectURL(formDataValues.videoFile[0])} /> */}
//                 </video>
//               )}

//               {formDataValues.videoType === '2' && formDataValues.thumbnail?.[0] && (
//                 <div className="mt-3">
//                   <strong>Thumbnail:</strong>
//                   <img
//                     src={thumbnailPreview}
//                     alt="Thumbnail"
//                     className="img-fluid rounded mt-2"
//                     style={{ maxHeight: '150px', objectFit: 'cover' }}
//                   />
//                 </div>
//               )}
//             </CCardBody>
//           </CCard>
//         </CCol>
//       )}
//     </div>
//   )
// }

// export default News

import React, { useState, useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Editor } from '@tinymce/tinymce-react'

const TRANSLATION_LANGUAGES = [
  { code: 'hi', label: 'Hindi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'mr', label: 'Marathi' },
  { code: 'ta', label: 'Tamil' },
]

const emptyTranslations = {
  hi: { title: '', subtitle: '', content: '' },
  bn: { title: '', subtitle: '', content: '' },
  mr: { title: '', subtitle: '', content: '' },
  ta: { title: '', subtitle: '', content: '' },
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  subtitle: yup.string().required('Subtitle is required'),
  videoType: yup.string().required('Video source is required'),
  type: yup.string().required('Video source is required'),
  description: yup.string().required('Description is required'),
  slug: yup.string().required('Slug is required'),
  thumbnail: yup.mixed().when('videoType', {
    is: '2',
    then: (schema) =>
      schema
        .test('required', 'Thumbnail is required', (value) => value && value.length > 0)
        .test('fileSize', 'Image size must be less than 1 MB', (value) => {
          if (!value || value.length === 0) return true
          return value[0].size <= 1024 * 1024
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
})

const News = () => {
  // const [slugEdited, setSlugEdited] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [newsList, setNewsList] = useState([])
  const [categoriesList, setCategoryList] = useState([])

  const [content, setContent] = useState('')
  const [translations, setTranslations] = useState(emptyTranslations)
  const [activeTranslationLanguage, setActiveTranslationLanguage] = useState('hi')

  const updateTranslation = (language, field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value,
      },
    }))
  }

  const getTranslationsPayload = (values = formDataValues, englishContent = content) => ({
    en: {
      title: values.title || '',
      subtitle: values.subtitle || '',
      content: englishContent || '',
    },
    hi: translations.hi,
    bn: translations.bn,
    mr: translations.mr,
    ta: translations.ta,
  })

  const [draftSaved, setDraftSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
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
      description: '',
      slug: '',
      categories: [],
      videoType: '',
      type: '2',
      youtubeUrl: '',
      videoFile: null,
      thumbnail: null,
      scheduledAt: '',
    },
  })

  const formDataValues = watch()

  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)

  useEffect(() => {
    if (!formDataValues.thumbnail?.[0]) {
      setThumbnailPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(formDataValues.thumbnail[0])

    setThumbnailPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [formDataValues.thumbnail])

  useEffect(() => {
    if (!formDataValues.videoFile?.[0]) {
      setVideoPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(formDataValues.videoFile[0])

    setVideoPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [formDataValues.videoFile])

  useEffect(() => {
    if (formDataValues.type !== '2') return

    if (!formDataValues.title && !formDataValues.subtitle) {
      return
    }

    const timeout = setTimeout(async () => {
      try {
        const formData = new FormData()

        formData.append('title', formDataValues.title || '')
        formData.append('subtitle', formDataValues.subtitle || '')
        formData.append('videoType', formDataValues.videoType || '')
        formData.append('type', '2')
        formData.append('author', author)
        formData.append('slug', formDataValues.slug || '')
        formData.append('categories', JSON.stringify(formDataValues.categories || []))

        // formData.append('content', typeof content === 'string' ? content : JSON.stringify(content))
        formData.append('content', content)
        formData.append(
          'translations',
          JSON.stringify(getTranslationsPayload(formDataValues, content)),
        )

        // ✅ Auto-save thumbnail
        if (formDataValues.thumbnail?.[0]) {
          formData.append('thumbnail', formDataValues.thumbnail[0])
        }

        const res = await fetch(`${setting.api}/api/news/auto-save`, {
          method: 'POST',
          body: formData,
        })

        const result = await res.json()

        if (result.status) {
          if (result.data?._id) {
            setEditingNews(result.data)
          }

          setDraftSaved(true)

          setTimeout(() => {
            setDraftSaved(false)
          }, 2000)

          console.log('Draft auto-saved')
        }
      } catch (error) {
        console.error('Auto save failed', error)
      }
    }, 10000)

    return () => clearTimeout(timeout)
  }, [formDataValues, content, translations])

  const toggleCategory = (id) => {
    const alreadySelected = formDataValues.categories.includes(id)
    const newCategories = alreadySelected
      ? formDataValues.categories.filter((c) => c !== id)
      : [...formDataValues.categories, id]
    setValue('categories', newCategories)
  }

  const getAllCategory = async () => {
    try {
      const response = await fetch(setting.api + '/api/categories/getAllCategory', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + loginInfo?.token,
        },
      })

      const u = await response.json()

      if (u.status === false) {
        secureLocalStorage.clear()
        navigate('/login')
      } else {
        setCategoryList(u.data || [])
      }
    } catch (error) {
      console.error('Category fetch failed', error)
    }
  }

  useEffect(() => {
    getAllCategory()
  }, [])

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
    } catch (e) {
      return null
    }
    return null
  }

  let loginInfo = null

  try {
    const storedLogin = secureLocalStorage.getItem('logininfo')

    if (storedLogin) {
      loginInfo = typeof storedLogin === 'string' ? JSON.parse(storedLogin) : storedLogin
    }
  } catch (error) {
    console.error('Invalid logininfo in storage', error)
  }

  const author = loginInfo?.user?.id

  const saveNews = async (data) => {
    if (loading) return

    setLoading(true)

    if (data.type === '3' && !data.scheduledAt) {
      toast.error('Please select schedule date & time')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('sub_title', data.subtitle)
    formData.append('video_type', data.videoType)
    formData.append('type', data.type)
    formData.append('slug', data.slug)
    formData.append('author', author)

    formData.append('scheduledAt', data.scheduledAt || '')

    formData.append('categories', JSON.stringify(data.categories))
    formData.append('translations', JSON.stringify(getTranslationsPayload(data, content)))

    if (data.videoType === '1') {
      formData.append('youtube_url', data.youtubeUrl)
    } else if (data.videoType === '2') {
      formData.append('content', content)

      if (data.thumbnail?.[0]) formData.append('thumbnail', data.thumbnail[0])
    }

    let endpoint = '/api/news/saveNews'

    if (editingNews?._id) {
      endpoint = '/api/news/updateNews'
      formData.append('id', editingNews._id)
    }

    try {
      const res = await fetch(setting.api + endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: 'Bearer ' + loginInfo?.token,
          // Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
        },
      })

      const result = await res.json()
      console.log('News API response:', result)

      if (result.status) {
        // ✅ store draft id
        if (result.data?._id) {
          setEditingNews(result.data)
        }

        secureLocalStorage.removeItem('newsDraft')
        localStorage.removeItem('newsDraft')
        toast.success(
          data.type === '3'
            ? 'News Scheduled Successfully!'
            : data.type === '2'
              ? 'Draft Saved Successfully!'
              : 'News Published Successfully!',
        )

        reset({
          title: '',
          slug: '',
          subtitle: '',
          categories: [],
          videoType: '2',
          type: '2',

          youtubeUrl: '',
          thumbnail: null,
        })
        setContent('')
        setTranslations(emptyTranslations)
        setActiveTranslationLanguage('hi')
        setEditingNews(null)
        navigate('/PublishedNews')
      } else {
        toast.error(result.message || 'Failed to save news')
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong while saving news')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex flex-column flex-lg-row gap-4">
      <CCol lg={formDataValues.videoType === '1' ? 8 : 12}>
        <CCard className="shadow border-0 rounded-4">
          <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
            <h5 className="mb-0">Create News</h5>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit(saveNews)}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormInput
                    type="text"
                    label="Title"
                    placeholder="Enter Title"
                    {...register('title')}
                    onChange={(e) => {
                      setValue('title', e.target.value)
                      // setSlugEdited(false)
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
                    placeholder="Enter Slug"
                    {...register('slug')}
                  />
                  {errors.slug && <small className="text-danger">{errors.slug.message}</small>}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Subtitle"
                    placeholder="Enter SubTitle"
                    {...register('subtitle')}
                  />
                  {errors.subtitle && (
                    <small className="text-danger">{errors.subtitle.message}</small>
                  )}
                </CCol>

                <CCol md={6}>
                  <p className="mb-2 ">Select Categories</p>
                  <CDropdown>
                    <CDropdownToggle color="secondary">
                      {formDataValues.categories.length > 0
                        ? categoriesList
                            .filter((cat) => formDataValues.categories.includes(cat._id))
                            .map((cat) => cat.name)
                            .join(', ')
                        : 'Select Categories'}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {categoriesList.map((cat) => {
                        const isSelected = formDataValues.categories.includes(cat._id)
                        return (
                          <CDropdownItem key={cat._id}>
                            <CFormCheck
                              id={`cat-${cat._id}`}
                              label={cat.name}
                              checked={isSelected}
                              onChange={() => toggleCategory(cat._id)}
                            />
                          </CDropdownItem>
                        )
                      })}
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
              </CRow>

              {/* <CRow>
                <CCol md={12}>
                  <p className="mb-2 ">Select Categories</p>
                  <CDropdown>
                    <CDropdownToggle color="secondary">
                      {formDataValues.categories.length > 0
                        ? categoriesList
                            .filter((cat) => formDataValues.categories.includes(cat._id))
                            .map((cat) => cat.name)
                            .join(', ')
                        : 'Select Categories'}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {categoriesList.map((cat) => {
                        const isSelected = formDataValues.categories.includes(cat._id)
                        return (
                          <CDropdownItem key={cat._id}>
                            <CFormCheck
                              id={`cat-${cat._id}`}
                              label={cat.name}
                              checked={isSelected}
                              onChange={() => toggleCategory(cat._id)}
                            />
                          </CDropdownItem>
                        )
                      })}
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
              </CRow> */}

              <CCard className="border rounded-3 mb-4">
                <CCardHeader className="fw-bold">News Translations</CCardHeader>
                <CCardBody>
                  <p className="text-muted small mb-3">
                    English uses the main Title, Subtitle and Content fields. Add translations for
                    Hindi, Bengali, Marathi and Tamil here.
                  </p>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {TRANSLATION_LANGUAGES.map((language) => (
                      <CButton
                        key={language.code}
                        type="button"
                        size="sm"
                        color={
                          activeTranslationLanguage === language.code ? 'primary' : 'secondary'
                        }
                        variant={
                          activeTranslationLanguage === language.code ? undefined : 'outline'
                        }
                        onClick={() => setActiveTranslationLanguage(language.code)}
                      >
                        {language.label}
                      </CButton>
                    ))}
                  </div>

                  <CFormInput
                    type="text"
                    label={`Title (${
                      TRANSLATION_LANGUAGES.find((item) => item.code === activeTranslationLanguage)
                        ?.label
                    })`}
                    value={translations[activeTranslationLanguage]?.title || ''}
                    onChange={(e) =>
                      updateTranslation(activeTranslationLanguage, 'title', e.target.value)
                    }
                    className="mb-3"
                  />

                  <CFormInput
                    type="text"
                    label={`Subtitle (${
                      TRANSLATION_LANGUAGES.find((item) => item.code === activeTranslationLanguage)
                        ?.label
                    })`}
                    value={translations[activeTranslationLanguage]?.subtitle || ''}
                    onChange={(e) =>
                      updateTranslation(activeTranslationLanguage, 'subtitle', e.target.value)
                    }
                    className="mb-3"
                  />

                  <label className="form-label fw-semibold">
                    Content (
                    {
                      TRANSLATION_LANGUAGES.find((item) => item.code === activeTranslationLanguage)
                        ?.label
                    }
                    )
                  </label>

                  <Editor
                    apiKey="okwya9fvn8y65h8ufs9cpsvbv2a4yo789vbfvbfr3rkfjp32"
                    value={translations[activeTranslationLanguage]?.content || ''}
                    onEditorChange={(newValue) =>
                      updateTranslation(activeTranslationLanguage, 'content', newValue)
                    }
                    init={{
                      height: 400,
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
                        'bullist numlist outdent indent | link image media table | ' +
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
                    }}
                  />
                </CCardBody>
              </CCard>

              <CRow className="mb-3 mt-2">
                {/* <CCol md={6}>
                  <CFormSelect
                    label="Type"
                    {...register('type')}
                    value={formDataValues.type}
                    onChange={(e) => setValue('type', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="1">Published</option>
                    <option value="2">Draft</option>
                  </CFormSelect>
                  {errors.type && <small className="text-danger">{errors.type.message}</small>}
                </CCol> */}

                <CCol md={6}>
                  <CFormSelect
                    label="News Type"
                    {...register('videoType')}
                    value={formDataValues.videoType}
                    onChange={(e) => setValue('videoType', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="1">Youtube Video</option>
                    <option value="2">Text</option>
                  </CFormSelect>
                  {errors.videoType && (
                    <small className="text-danger">{errors.videoType.message}</small>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="datetime-local"
                    label="Schedule Publish"
                    {...register('scheduledAt')}
                  />
                </CCol>
              </CRow>

              {formDataValues.videoType === '1' && (
                <CFormInput
                  type="url"
                  label="YouTube URL"
                  {...register('youtubeUrl')}
                  placeholder="https://youtube.com/..."
                />
              )}

              {formDataValues.videoType === '2' && (
                <>
                  <CCol md={12} className="mb-2">
                    {formDataValues.videoType === '2' && (
                      <>
                        {/* <div
                          style={{
                            width: '100%',
                            height: '250px',
                            margin: '0 auto',

                            padding: '10px',
                            borderRadius: '8px',
                            overflowY: 'auto',
                          }}
                        >
                          <label className="fw-semibold mb-2">Description</label>
                          <EditorJSComponent data={content} onChange={setContent} />
                        </div> */}

                        <style>
                          {`
                                .cke_notification_warning {
                                    display: none !important;
                                }
                                `}
                        </style>

                        {/* <CKEditor
                          editorUrl="https://cdn.ckeditor.com/4.22.1/full/ckeditor.js"
                          initData={content}
                          onChange={(event) => {
                            const html = event.editor.getData()

                            setContent(html)

                            setValue('description', html, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }}
                          config={{
                            versionCheck: false,
                            height: 400,
                            allowedContent: true,
                            autoParagraph: false,
                            removePlugins: 'resize,elementspath',
                            extraPlugins: 'font,colorbutton,justify',
                            disableNativeSpellChecker: false,
                            toolbarCanCollapse: false,

                            toolbar: [
                              {
                                name: 'styles',
                                items: ['Styles', 'Format', 'Font', 'FontSize'],
                              },
                              {
                                name: 'basicstyles',
                                items: ['Bold', 'Italic', 'Underline', 'Strike'],
                              },
                              {
                                name: 'paragraph',
                                items: [
                                  'NumberedList',
                                  'BulletedList',
                                  'JustifyLeft',
                                  'JustifyCenter',
                                  'JustifyRight',
                                ],
                              },
                              {
                                name: 'insert',
                                items: ['Image', 'Table'],
                              },
                              {
                                name: 'links',
                                items: ['Link', 'Unlink'],
                              },
                            ],
                          }}
                        /> */}

                        {/* <CKEditor
                          editorUrl="https://cdn.ckeditor.com/4.22.1/full/ckeditor.js"
                          initData={content}
                          onChange={(event) => {
                            const html = event.editor.getData()

                            setContent(html)

                            setValue('description', html, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }}
                          config={{
                            versionCheck: false,
                            height: 500,
                            allowedContent: true,

                            uploadUrl: `${setting.api}/api/upload/ckeditor`,
                            filebrowserUploadUrl: `${setting.api}/api/upload/ckeditor`,
                            filebrowserUploadMethod: 'form',

                            toolbar: [
                              {
                                name: 'clipboard',
                                items: [
                                  'Undo',
                                  'Redo',
                                  'Cut',
                                  'Copy',
                                  'Paste',
                                  'PasteText',
                                  'PasteFromWord',
                                ],
                              },
                              {
                                name: 'styles',
                                items: ['Format', 'Font', 'FontSize'],
                              },
                              {
                                name: 'basicstyles',
                                items: [
                                  'Bold',
                                  'Italic',
                                  'Underline',
                                  'Strike',
                                  'Subscript',
                                  'Superscript',
                                  'RemoveFormat',
                                ],
                              },
                              {
                                name: 'paragraph',
                                items: [
                                  'NumberedList',
                                  'BulletedList',
                                  'Outdent',
                                  'Indent',
                                  'Blockquote',
                                  'JustifyLeft',
                                  'JustifyCenter',
                                  'JustifyRight',
                                  'JustifyBlock',
                                ],
                              },
                              {
                                name: 'insert',
                                items: [
                                  'UploadImage',
                                  'Image',
                                  'Table',
                                  'HorizontalRule',
                                  'SpecialChar',
                                ],
                              },
                              {
                                name: 'links',
                                items: ['Link', 'Unlink', 'Anchor'],
                              },
                              {
                                name: 'document',
                                items: ['Source', 'Maximize'],
                              },
                            ],
                          }}
                        
                        /> */}

                        <Editor
                          apiKey="okwya9fvn8y65h8ufs9cpsvbv2a4yo789vbfvbfr3rkfjp32"
                          value={content}
                          onEditorChange={(newValue) => {
                            setContent(newValue)

                            setValue('description', newValue, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
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

                        {errors.description && (
                          <p className="text-danger small mt-1">{errors.description.message}</p>
                        )}

                        <CCol md={12} className="mb-3">
                          <CFormInput
                            type="file"
                            label="Thumbnail"
                            accept="image/*"
                            {...register('thumbnail')}
                          />
                          {errors.thumbnail && (
                            <small className="text-danger">{errors.thumbnail.message}</small>
                          )}
                        </CCol>
                      </>
                    )}
                  </CCol>
                </>
              )}

              {draftSaved && <p className="text-success small mt-3">Draft auto-saved</p>}

              <div className="d-flex justify-content-end mt-4">
                {/* <CButton
                  color="primary"
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setValue('type', '1')
                    handleSubmit(saveNews)()
                  }}
                >
                  {loading ? 'Saving...' : 'Publish'}
                </CButton> */}

                <div className="d-flex gap-2 justify-content-end">
                  <CButton
                    color="warning"
                    type="button"
                    onClick={() => {
                      setValue('type', '2')
                      handleSubmit(saveNews)()
                    }}
                  >
                    Save Draft
                  </CButton>

                  <CButton
                    color="info"
                    type="button"
                    onClick={() => {
                      setValue('type', '3')
                      handleSubmit(saveNews)()
                    }}
                  >
                    Schedule
                  </CButton>

                  <CButton
                    color="primary"
                    type="button"
                    onClick={() => {
                      setValue('type', '1')
                      handleSubmit(saveNews)()
                    }}
                  >
                    Publish Now
                  </CButton>
                </div>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {formDataValues.videoType === '1' && (
        <CCol lg={4}>
          <CCard className="shadow border-0 rounded-4 text-dark">
            <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
              <h5 className="mb-0">Live Preview</h5>
            </CCardHeader>

            <CCardBody>
              {formDataValues.title && (
                <p>
                  <strong>Title:</strong> {formDataValues.title}
                </p>
              )}
              {formDataValues.categories?.length > 0 && (
                <p>
                  <strong>Categories:</strong>{' '}
                  {categoriesList
                    .filter((cat) => formDataValues.categories.includes(cat._id))
                    .map((cat) => cat.name)
                    .join(', ')}
                </p>
              )}

              {formDataValues.videoType === '1' &&
                formDataValues.youtubeUrl &&
                (() => {
                  const videoId = getYouTubeId(formDataValues.youtubeUrl)
                  return videoId ? (
                    <iframe
                      width="100%"
                      height="250"
                      className="rounded mb-3"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube Preview"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <p className="text-danger">Invalid YouTube URL</p>
                  )
                })()}

              {formDataValues.videoType === '2' && formDataValues.videoFile?.[0] && (
                <video width="100%" height="auto" className="rounded" controls>
                  <source src={videoPreview} />
                  {/* <source src={URL.createObjectURL(formDataValues.videoFile[0])} /> */}
                </video>
              )}

              {formDataValues.videoType === '2' && formDataValues.thumbnail?.[0] && (
                <div className="mt-3">
                  <strong>Thumbnail:</strong>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    className="img-fluid rounded mt-2"
                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      )}
    </div>
  )
}

export default News
