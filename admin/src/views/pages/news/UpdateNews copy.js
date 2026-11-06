// import React, { useState, useEffect } from 'react'
// import { useForm } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'
// import setting from '../../../setting.json'

// import { useNavigate } from 'react-router-dom'

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
// import { useParams } from 'react-router-dom'
// import toast from 'react-hot-toast'
// // import { CKEditor } from 'ckeditor4-react'

// import { Editor } from '@tinymce/tinymce-react'

// const schema = yup.object().shape({
//   title: yup.string().required('Title is required'),
//   subtitle: yup.string().required('Subtitle is required'),
//   videoType: yup.string().required('Video source is required'),
//   type: yup.string().required('Video source is required'),
// })

// const UpdateNews = () => {
//   const { id } = useParams()

//   const navigate = useNavigate()

//   const [slugEdited, setSlugEdited] = useState(false)
//   const [editingNews, setEditingNews] = useState(null)
//   const [newsList, setNewsList] = useState([])
//   const [categoriesList, setCategoryList] = useState([])

//   const [content, setContent] = useState('')

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
//       categories: [],
//       videoType: '',
//       type: '',
//       slug: '',
//       youtubeUrl: '',
//       videoFile: null,
//       thumbnail: null,
//     },
//   })

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

//   const formDataValues = watch()

//   const toggleCategory = (id) => {
//     const alreadySelected = formDataValues.categories.includes(id)
//     const newCategories = alreadySelected
//       ? formDataValues.categories.filter((c) => c !== id)
//       : [...formDataValues.categories, id]
//     setValue('categories', newCategories)
//   }

//   const getAllCategory = async () => {
//     await fetch(setting.api + '/api/categories/getAllCategory', {
//       method: 'GET',
//       mode: 'cors',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
//       },
//     })
//       .then((response) => response.json())
//       .then((u) => {
//         if (u.status == false) {
//           secureLocalStorage.clear()
//           navigate('/login')
//         } else {
//           setCategoryList(u.data)
//           console.log(u.data)
//         }
//       })
//   }

//   useEffect(() => {
//     getAllCategory()
//   }, [])

//   const fetchNewsById = async () => {
//     try {
//       const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')
//       const token = loginInfo.token

//       const res = await fetch(`${setting.api}/api/news/id/${id}`, {
//         method: 'GET',
//         headers: {
//           Authorization: 'Bearer ' + token,
//         },
//       })

//       const result = await res.json()

//       if (!result.status) {
//         toast.error('News not found')

//         return
//       }

//       const selected = result.data

//       console.log('Selected News:', selected)

//       setEditingNews(selected)

//       reset({
//         title: selected.title || '',
//         slug: selected.slug || '',
//         subtitle: selected.subtitle || '',

//         type: selected.type ? String(selected.type) : '',
//         videoType: selected.videoType ? String(selected.videoType) : '',

//         youtubeUrl: selected.youtubeUrl || '',

//         categories: Array.isArray(selected.categories) ? selected.categories.map((c) => c._id) : [],

//         videoFile: null,
//         thumbnail: null,
//       })

//       if (selected.content) {
//         setContent(selected.content)
//       }

//       // if (selected.content) {
//       //   try {
//       //     const parsedContent =
//       //       typeof selected.content === 'string' ? JSON.parse(selected.content) : selected.content

//       //     setContent(parsedContent)
//       //   } catch (err) {
//       //     console.log('Content parse error:', err)
//       //     setContent({})
//       //   }
//       // }
//     } catch (error) {
//       console.error('Error fetching news:', error)
//     }
//   }

//   useEffect(() => {
//     if (id) {
//       fetchNewsById()
//     }
//   }, [id])

//   const updateNews = async (data) => {
//     const formData = new FormData()
//     formData.append('id', id)

//     formData.append('title', data.title)
//     formData.append('sub_title', data.subtitle)
//     formData.append('video_type', data.videoType)
//     formData.append('type', data.type)
//     formData.append('slug', data.slug)

//     formData.append('categories', JSON.stringify(data.categories))

//     if (data.videoType === '1') {
//       formData.append('youtube_url', data.youtubeUrl)
//     } else if (data.videoType === '2') {
//       formData.append('content', content)

//       if (data.thumbnail?.[0]) formData.append('thumbnail', data.thumbnail[0])
//     }

//     let endpoint = '/api/news/updateNews'

//     try {
//       const res = await fetch(setting.api + endpoint, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
//         },
//       })

//       const result = await res.json()
//       console.log('News API response:', result)

//       if (result.status) {
//         toast.success('News Updated Successfully!')
//         reset({
//           title: '',
//           slug: '',
//           subtitle: '',
//           categories: [],
//           videoType: '',
//           type: '',
//           youtubeUrl: '',
//           thumbnail: null,
//         })
//         setEditingNews(null)
//         navigate('/PublishedNews')
//       } else {
//         // alert(result.message || 'Failed to save news')
//         toast.error(result.message || 'Failed to update news')
//       }
//     } catch (error) {
//       toast.error(error.message || 'Something went wrong')
//     }
//   }

//   useEffect(() => {
//     if (editingNews?.content) {
//       setContent(editingNews.content)
//     }
//   }, [editingNews])

//   return (
//     <div className="d-flex flex-column flex-lg-row gap-4">
//       <CCol lg={formDataValues.videoType === '1' ? 8 : 12}>
//         <CCard className="shadow border-0 rounded-4">
//           <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
//             <h5 className="mb-0">Update News</h5>
//           </CCardHeader>

//           <CCardBody>
//             <CForm onSubmit={handleSubmit(updateNews)}>
//               <CRow className="mb-3">
//                 <CCol md={12}>
//                   <CFormInput
//                     type="text"
//                     label="Title"
//                     placeholder="Enter Title"
//                     {...register('title')}
//                     onChange={(e) => {
//                       setValue('title', e.target.value)
//                       setSlugEdited(false)
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
//                     placeholder="Update Slug"
//                     {...register('slug')}
//                     onChange={(e) => {
//                       setValue('slug', e.target.value)
//                       setSlugEdited(true)
//                     }}
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
//               </CRow>
//               <CRow>
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
//               </CRow>

//               <CRow className="mb-3 mt-2">
//                 <CCol md={6}>
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
//                 </CCol>

//                 <CCol md={6}>
//                   <CFormSelect
//                     label="News Type"
//                     {...register('videoType')}
//                     value={formDataValues.videoType}
//                     onChange={(e) => setValue('videoType', e.target.value)}
//                   >
//                     <option value="">Select Type</option>
//                     <option value="1">Video</option>
//                     <option value="2">Text</option>
//                   </CFormSelect>
//                   {errors.videoType && (
//                     <small className="text-danger">{errors.videoType.message}</small>
//                   )}
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
//                                                         .cke_notification_warning {
//                                                             display: none !important;
//                                                         }
//                                                         `}
//                         </style>

//                         {/* {editingNews && (
//                           <CKEditor
//                             key={editingNews._id}
//                             initData={editingNews.content}
//                             onChange={(event) => {
//                               const data = event.editor.getData()
//                               setContent(data)
//                             }}
//                             config={{
//                               height: 400,

//                               extraPlugins: 'font,colorbutton,justify',

//                               toolbar: [
//                                 {
//                                   name: 'styles',
//                                   items: ['Styles', 'Format', 'Font', 'FontSize'],
//                                 },
//                                 {
//                                   name: 'basicstyles',
//                                   items: ['Bold', 'Italic', 'Underline', 'Strike'],
//                                 },
//                                 {
//                                   name: 'colors',
//                                   items: ['TextColor', 'BGColor'],
//                                 },
//                                 {
//                                   name: 'paragraph',
//                                   items: [
//                                     'NumberedList',
//                                     'BulletedList',
//                                     '-',
//                                     'Outdent',
//                                     'Indent',
//                                     '-',
//                                     'JustifyLeft',
//                                     'JustifyCenter',
//                                     'JustifyRight',
//                                     'JustifyBlock',
//                                   ],
//                                 },
//                                 {
//                                   name: 'insert',
//                                   items: ['Image', 'Table'],
//                                 },
//                                 {
//                                   name: 'links',
//                                   items: ['Link', 'Unlink'],
//                                 },
//                                 {
//                                   name: 'document',
//                                   items: ['Source'],
//                                 },
//                               ],

//                               font_names:
//                                 'Arial/Arial, Helvetica, sans-serif;' +
//                                 'Times New Roman/Times New Roman, Times, serif;' +
//                                 'Verdana/Verdana, Geneva, sans-serif;' +
//                                 'Tahoma/Tahoma, Geneva, sans-serif;' +
//                                 'Georgia/Georgia, serif;',

//                               fontSize_sizes:
//                                 '8/8px;10/10px;12/12px;14/14px;16/16px;18/18px;20/20px;24/24px;28/28px;36/36px;48/48px;72/72px',
//                             }}
//                           />
//                         )} */}

//                         {/* {editingNews && (
//                           <CKEditor
//                             key={editingNews._id}
//                             editorUrl="https://cdn.ckeditor.com/4.22.1/full/ckeditor.js"
//                             initData={content}
//                             onChange={(event) => {
//                               const html = event.editor.getData()

//                               setContent(html)

//                               setValue('description', html, {
//                                 shouldValidate: true,
//                                 shouldDirty: true,
//                               })
//                             }}
//                             config={{
//                               versionCheck: false,
//                               height: 400,
//                               allowedContent: true,
//                               autoParagraph: false,
//                               removePlugins: 'resize,elementspath',
//                               extraPlugins: 'font,colorbutton,justify',
//                               disableNativeSpellChecker: false,
//                               toolbarCanCollapse: false,

//                               toolbar: [
//                                 {
//                                   name: 'styles',
//                                   items: ['Styles', 'Format', 'Font', 'FontSize'],
//                                 },
//                                 {
//                                   name: 'basicstyles',
//                                   items: ['Bold', 'Italic', 'Underline', 'Strike'],
//                                 },
//                                 {
//                                   name: 'colors',
//                                   items: ['TextColor', 'BGColor'],
//                                 },
//                                 {
//                                   name: 'paragraph',
//                                   items: [
//                                     'NumberedList',
//                                     'BulletedList',
//                                     'Outdent',
//                                     'Indent',
//                                     'JustifyLeft',
//                                     'JustifyCenter',
//                                     'JustifyRight',
//                                     'JustifyBlock',
//                                   ],
//                                 },
//                                 {
//                                   name: 'insert',
//                                   items: ['Image', 'Table'],
//                                 },
//                                 {
//                                   name: 'links',
//                                   items: ['Link', 'Unlink'],
//                                 },
//                                 {
//                                   name: 'document',
//                                   items: ['Source'],
//                                 },
//                               ],
//                             }}
//                           />
//                         )} */}

//                         {editingNews && (
//                           <Editor
//                             apiKey="okwya9fvn8y65h8ufs9cpsvbv2a4yo789vbfvbfr3rkfjp32"
//                             value={content}
//                             onEditorChange={(newValue) => {
//                               setContent(newValue)

//                               setValue('description', newValue, {
//                                 shouldValidate: true,
//                                 shouldDirty: true,
//                               })
//                             }}
//                             init={{
//                               height: 600,
//                               menubar: true,
//                               branding: false,

//                               plugins: [
//                                 'advlist',
//                                 'autolink',
//                                 'lists',
//                                 'link',
//                                 'image',
//                                 'charmap',
//                                 'preview',
//                                 'anchor',
//                                 'searchreplace',
//                                 'visualblocks',
//                                 'code',
//                                 'fullscreen',
//                                 'insertdatetime',
//                                 'media',
//                                 'table',
//                                 'wordcount',
//                               ],

//                               toolbar:
//                                 'undo redo | styles | bold italic underline | ' +
//                                 'alignleft aligncenter alignright alignjustify | ' +
//                                 'bullist numlist outdent indent | ' +
//                                 'link image media table | ' +
//                                 'code fullscreen',

//                               images_upload_handler: async (blobInfo) => {
//                                 const formData = new FormData()

//                                 formData.append('file', blobInfo.blob(), blobInfo.filename())

//                                 const response = await fetch(`${setting.api}/api/upload/image`, {
//                                   method: 'POST',
//                                   body: formData,
//                                 })

//                                 const result = await response.json()

//                                 if (!response.ok) {
//                                   throw new Error(result.message)
//                                 }

//                                 return result.location
//                               },
//                             }}
//                           />
//                         )}

//                         {errors.description && (
//                           <p className="text-danger small mt-1">{errors.description.message}</p>
//                         )}

//                         {/* <CCol md={12} className="mb-3">
//                           <CFormInput
//                             type="file"
//                             label="Thumbnail"
//                             accept="image/*"
//                             {...register('thumbnail')}
//                           />
//                         </CCol> */}

//                         <CCol md={12} className="mb-3">
//                           <CFormInput
//                             type="file"
//                             label="Thumbnail"
//                             accept="image/*"
//                             {...register('thumbnail')}
//                           />

//                           {/* Image Preview */}
//                           {formDataValues.thumbnail?.[0] ? (
//                             <div className="mt-3">
//                               <img
//                                 src={URL.createObjectURL(formDataValues.thumbnail[0])}
//                                 alt="Preview"
//                                 className="img-fluid rounded shadow"
//                                 style={{
//                                   maxHeight: '50px',
//                                   objectFit: 'cover',
//                                 }}
//                               />
//                             </div>
//                           ) : editingNews?.thumbnail ? (
//                             <div className="mt-3">
//                               <img
//                                 src={`${setting.api}/uploads/images/${editingNews.thumbnail}`}
//                                 alt="Current Thumbnail"
//                                 className="img-fluid rounded shadow"
//                                 style={{
//                                   maxHeight: '50px',
//                                   objectFit: 'cover',
//                                 }}
//                               />
//                             </div>
//                           ) : null}
//                         </CCol>
//                       </>
//                     )}
//                   </CCol>
//                 </>
//               )}

//               <div className="d-flex justify-content-end mt-4">
//                 <CButton color="primary" type="submit">
//                   {editingNews ? 'Update' : 'Publish'}
//                 </CButton>
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
//                     .filter((cat) => formDataValues.categories.includes(cat.id))
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
//                   <source src={URL.createObjectURL(formDataValues.videoFile[0])} />
//                 </video>
//               )}

//               {formDataValues.videoType === 'self' && formDataValues.thumbnail?.[0] && (
//                 <div className="mt-3">
//                   <strong>Thumbnail:</strong>
//                   <img
//                     src={URL.createObjectURL(formDataValues.thumbnail[0])}
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

// export default UpdateNews

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import setting from '../../../setting.json'

import { useNavigate } from 'react-router-dom'

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
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
// import { CKEditor } from 'ckeditor4-react'

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
})

const UpdateNews = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const [slugEdited, setSlugEdited] = useState(false)
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

  const getTranslationsPayload = (values, englishContent) => ({
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
    },
  })

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

  const formDataValues = watch()

  const toggleCategory = (id) => {
    const alreadySelected = formDataValues.categories.includes(id)
    const newCategories = alreadySelected
      ? formDataValues.categories.filter((c) => c !== id)
      : [...formDataValues.categories, id]
    setValue('categories', newCategories)
  }

  const getAllCategory = async () => {
    await fetch(setting.api + '/api/categories/getAllCategory', {
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
          secureLocalStorage.clear()
          navigate('/login')
        } else {
          setCategoryList(u.data)
          console.log(u.data)
        }
      })
  }

  useEffect(() => {
    getAllCategory()
  }, [])

  const fetchNewsById = async () => {
    try {
      const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')
      const token = loginInfo.token

      const res = await fetch(`${setting.api}/api/news/id/${id}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const result = await res.json()

      if (!result.status) {
        toast.error('News not found')

        return
      }

      const selected = result.data

      console.log('Selected News:', selected)

      setEditingNews(selected)

      reset({
        title: selected.title || '',
        slug: selected.slug || '',
        subtitle: selected.subtitle || '',

        type: selected.type ? String(selected.type) : '',
        videoType: selected.videoType ? String(selected.videoType) : '',

        youtubeUrl: selected.youtubeUrl || '',

        categories: Array.isArray(selected.categories) ? selected.categories.map((c) => c._id) : [],

        videoFile: null,
        thumbnail: null,
      })

      const englishContent = selected.translations?.en?.content || selected.content || ''

      setContent(
        typeof englishContent === 'string' ? englishContent : JSON.stringify(englishContent),
      )

      setTranslations({
        hi: {
          title: selected.translations?.hi?.title || '',
          subtitle: selected.translations?.hi?.subtitle || '',
          content:
            typeof selected.translations?.hi?.content === 'string'
              ? selected.translations.hi.content
              : selected.translations?.hi?.content
                ? JSON.stringify(selected.translations.hi.content)
                : '',
        },
        bn: {
          title: selected.translations?.bn?.title || '',
          subtitle: selected.translations?.bn?.subtitle || '',
          content:
            typeof selected.translations?.bn?.content === 'string'
              ? selected.translations.bn.content
              : selected.translations?.bn?.content
                ? JSON.stringify(selected.translations.bn.content)
                : '',
        },
        mr: {
          title: selected.translations?.mr?.title || '',
          subtitle: selected.translations?.mr?.subtitle || '',
          content:
            typeof selected.translations?.mr?.content === 'string'
              ? selected.translations.mr.content
              : selected.translations?.mr?.content
                ? JSON.stringify(selected.translations.mr.content)
                : '',
        },
        ta: {
          title: selected.translations?.ta?.title || '',
          subtitle: selected.translations?.ta?.subtitle || '',
          content:
            typeof selected.translations?.ta?.content === 'string'
              ? selected.translations.ta.content
              : selected.translations?.ta?.content
                ? JSON.stringify(selected.translations.ta.content)
                : '',
        },
      })

      // if (selected.content) {
      //   try {
      //     const parsedContent =
      //       typeof selected.content === 'string' ? JSON.parse(selected.content) : selected.content

      //     setContent(parsedContent)
      //   } catch (err) {
      //     console.log('Content parse error:', err)
      //     setContent({})
      //   }
      // }
    } catch (error) {
      console.error('Error fetching news:', error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchNewsById()
    }
  }, [id])

  const updateNews = async (data) => {
    const formData = new FormData()
    formData.append('id', id)

    formData.append('title', data.title)
    formData.append('sub_title', data.subtitle)
    formData.append('video_type', data.videoType)
    formData.append('type', data.type)
    formData.append('slug', data.slug)

    formData.append('categories', JSON.stringify(data.categories))
    formData.append('translations', JSON.stringify(getTranslationsPayload(data, content)))

    if (data.videoType === '1') {
      formData.append('youtube_url', data.youtubeUrl)
    } else if (data.videoType === '2') {
      formData.append('content', content)

      if (data.thumbnail?.[0]) formData.append('thumbnail', data.thumbnail[0])
    }

    let endpoint = '/api/news/updateNews'

    try {
      const res = await fetch(setting.api + endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
        },
      })

      const result = await res.json()
      console.log('News API response:', result)

      if (result.status) {
        toast.success('News Updated Successfully!')
        reset({
          title: '',
          slug: '',
          subtitle: '',
          categories: [],
          videoType: '',
          type: '',
          youtubeUrl: '',
          thumbnail: null,
        })
        setTranslations(emptyTranslations)
        setActiveTranslationLanguage('hi')
        setEditingNews(null)
        navigate('/PublishedNews')
      } else {
        // alert(result.message || 'Failed to save news')
        toast.error(result.message || 'Failed to update news')
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    if (editingNews?.content) {
      setContent(editingNews.content)
    }
  }, [editingNews])

  return (
    <div className="d-flex flex-column flex-lg-row gap-4">
      <CCol lg={formDataValues.videoType === '1' ? 8 : 12}>
        <CCard className="shadow border-0 rounded-4">
          <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
            <h5 className="mb-0">Update News</h5>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit(updateNews)}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormInput
                    type="text"
                    label="Title"
                    placeholder="Enter Title"
                    {...register('title')}
                    onChange={(e) => {
                      setValue('title', e.target.value)
                      setSlugEdited(false)
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
                    onChange={(e) => {
                      setValue('slug', e.target.value)
                      setSlugEdited(true)
                    }}
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
              </CRow>
              <CRow>
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
              </CRow>

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
                <CCol md={6}>
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
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    label="News Type"
                    {...register('videoType')}
                    value={formDataValues.videoType}
                    onChange={(e) => setValue('videoType', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="1">Video</option>
                    <option value="2">Text</option>
                  </CFormSelect>
                  {errors.videoType && (
                    <small className="text-danger">{errors.videoType.message}</small>
                  )}
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

                        {/* {editingNews && (
                          <CKEditor
                            key={editingNews._id}
                            initData={editingNews.content}
                            onChange={(event) => {
                              const data = event.editor.getData()
                              setContent(data)
                            }}
                            config={{
                              height: 400,

                              extraPlugins: 'font,colorbutton,justify',

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
                                  name: 'colors',
                                  items: ['TextColor', 'BGColor'],
                                },
                                {
                                  name: 'paragraph',
                                  items: [
                                    'NumberedList',
                                    'BulletedList',
                                    '-',
                                    'Outdent',
                                    'Indent',
                                    '-',
                                    'JustifyLeft',
                                    'JustifyCenter',
                                    'JustifyRight',
                                    'JustifyBlock',
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
                                {
                                  name: 'document',
                                  items: ['Source'],
                                },
                              ],

                              font_names:
                                'Arial/Arial, Helvetica, sans-serif;' +
                                'Times New Roman/Times New Roman, Times, serif;' +
                                'Verdana/Verdana, Geneva, sans-serif;' +
                                'Tahoma/Tahoma, Geneva, sans-serif;' +
                                'Georgia/Georgia, serif;',

                              fontSize_sizes:
                                '8/8px;10/10px;12/12px;14/14px;16/16px;18/18px;20/20px;24/24px;28/28px;36/36px;48/48px;72/72px',
                            }}
                          />
                        )} */}

                        {/* {editingNews && (
                          <CKEditor
                            key={editingNews._id}
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
                                  name: 'colors',
                                  items: ['TextColor', 'BGColor'],
                                },
                                {
                                  name: 'paragraph',
                                  items: [
                                    'NumberedList',
                                    'BulletedList',
                                    'Outdent',
                                    'Indent',
                                    'JustifyLeft',
                                    'JustifyCenter',
                                    'JustifyRight',
                                    'JustifyBlock',
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
                                {
                                  name: 'document',
                                  items: ['Source'],
                                },
                              ],
                            }}
                          />
                        )} */}

                        {editingNews && (
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
                                  throw new Error(result.message)
                                }

                                return result.location
                              },
                            }}
                          />
                        )}

                        {errors.description && (
                          <p className="text-danger small mt-1">{errors.description.message}</p>
                        )}

                        {/* <CCol md={12} className="mb-3">
                          <CFormInput
                            type="file"
                            label="Thumbnail"
                            accept="image/*"
                            {...register('thumbnail')}
                          />
                        </CCol> */}

                        <CCol md={12} className="mb-3">
                          <CFormInput
                            type="file"
                            label="Thumbnail"
                            accept="image/*"
                            {...register('thumbnail')}
                          />

                          {/* Image Preview */}
                          {formDataValues.thumbnail?.[0] ? (
                            <div className="mt-3">
                              <img
                                src={URL.createObjectURL(formDataValues.thumbnail[0])}
                                alt="Preview"
                                className="img-fluid rounded shadow"
                                style={{
                                  maxHeight: '50px',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                          ) : editingNews?.thumbnail ? (
                            <div className="mt-3">
                              <img
                                src={`${setting.api}/uploads/images/${editingNews.thumbnail}`}
                                alt="Current Thumbnail"
                                className="img-fluid rounded shadow"
                                style={{
                                  maxHeight: '50px',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                          ) : null}
                        </CCol>
                      </>
                    )}
                  </CCol>
                </>
              )}

              <div className="d-flex justify-content-end mt-4">
                <CButton color="primary" type="submit">
                  {editingNews ? 'Update' : 'Publish'}
                </CButton>
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
                    .filter((cat) => formDataValues.categories.includes(cat.id))
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
                  <source src={URL.createObjectURL(formDataValues.videoFile[0])} />
                </video>
              )}

              {formDataValues.videoType === 'self' && formDataValues.thumbnail?.[0] && (
                <div className="mt-3">
                  <strong>Thumbnail:</strong>
                  <img
                    src={URL.createObjectURL(formDataValues.thumbnail[0])}
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

export default UpdateNews
