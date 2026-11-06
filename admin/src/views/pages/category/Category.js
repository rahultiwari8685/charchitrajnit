import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  CFormSelect,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { useForm } from 'react-hook-form'

import setting from '../../../setting.json'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import secureLocalStorage from 'react-secure-storage'
import { cilPen, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import toast from 'react-hot-toast'

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  parent: yup.string().required('Phone is required'),
  meta_title: yup.string().required('Meta Title is required'),
  meta_desc: yup.string().required('Meta Description is required'),
})

const Category = () => {
  const [category, setCategoryList] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

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

  const saveCategory = async (data) => {
    if (loading) return

    setLoading(true)
    const db = {
      name: data.name,
      parentCategory: data.parent,
      meta_title: data.meta_title,
      meta_desc: data.meta_desc,
      showInMenu: data.nav,
      position: Number(data.position || 0),
    }

    let endpoint = '/api/categories/saveCategory'

    if (editingCategory) {
      endpoint = '/api/categories/updateCategory'
      db.id = editingCategory._id
    }

    try {
      const res = await fetch(setting.api + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
        },
        body: JSON.stringify(db),
      })

      const result = await res.json()

      if (result.success) {
        toast.success(
          editingCategory ? 'Category Updated Successfully' : 'Category Created Successfully',
        )
        reset({
          name: '',
          parent: '0',
          meta_title: '',
          meta_desc: '',
          nav: '0',
          position: 0,
        })
        getAllCategory()
        setEditingCategory(null)
        setVisible(false)
      } else {
        toast.error(result.message || 'Failed to save category')
      }
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (cat) => {
    setEditingCategory(cat)
    setVisible(true)

    setValue('name', cat.name)
    setValue('parent', cat.parentCategory?._id || '0')
    setValue('meta_title', cat.meta_title || '')
    setValue('meta_desc', cat.meta_desc || '')
    setValue('nav', cat.showInMenu ? '1' : '0')
    setValue('position', cat.position || 0)
  }

  function handleDelete(id) {
    var ans = confirm('Are you sure For Delete?')
    console.log(ans)

    if (ans == true) {
      deleteCategory(id)
    }
  }

  const deleteCategory = async (id) => {
    try {
      setLoading(true)
      const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token

      const response = await fetch(`${setting.api}/api/categories/deleteCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()

      if (result.status) {
        toast.success('Category Deleted Successfully')

        setCategoryList((prev) => prev.filter((item) => item._id !== id))
      } else {
        toast.error(result.message || 'Delete failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(category.length / itemsPerPage)
  const paginatedItems = category.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div>
      <CCard className="shadow border-0 rounded-4">
        <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-tags-fill me-2 text-info"></i> Categories
            </h5>
            <CButton
              color="light"
              variant="outline"
              className="fw-semibold px-3 shadow-sm rounded-pill"
              onClick={() => {
                setVisible(true)
                setEditingCategory(null)
                reset({
                  name: '',
                  parent: '0',
                  meta_title: '',
                  meta_desc: '',
                  nav: '',
                })
              }}
            >
              <i className="bi bi-plus-circle me-2"></i> Add Category
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <CTable striped responsive bordered hover>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Parent Category</CTableHeaderCell>
                <CTableHeaderCell>Show in Menu</CTableHeaderCell>
                <CTableHeaderCell>Position</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {paginatedItems.map((cat, index) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index
                return (
                  <CTableRow key={cat.id}>
                    <CTableDataCell>{actualIndex + 1}</CTableDataCell>

                    <CTableDataCell>{cat?.name}</CTableDataCell>

                    <CTableDataCell>{cat.parentCategory?.name || '-'}</CTableDataCell>
                    <CTableDataCell>{cat.showInMenu ? 'Yes' : 'No'}</CTableDataCell>
                    <CTableDataCell>{cat.position || '-'}</CTableDataCell>

                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="warning"
                        className="rounded-pill px-3 shadow-sm fw-semibold"
                        onClick={() => handleEdit(cat)}
                      >
                        <CIcon icon={cilPencil} style={{ marginRight: '5px' }} /> Edit
                      </CButton>{' '}
                      <CButton
                        size="sm"
                        color="danger"
                        className="rounded-pill px-3 shadow-sm fw-semibold"
                        onClick={() => handleDelete(cat._id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CIcon icon={cilTrash} style={{ marginRight: '5px' }} />
                            Delete
                          </>
                        )}
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>

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
        </CCardBody>
      </CCard>

      <COffcanvas
        placement="end"
        visible={visible}
        onHide={() => setVisible(false)}
        backdrop={true}
      >
        <COffcanvasHeader className="bg-dark text-white fw-bold" closeButton>
          {editingCategory ? 'Update Category' : 'Add Category'}
        </COffcanvasHeader>
        <COffcanvasBody>
          <CForm onSubmit={handleSubmit(saveCategory)}>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  placeholder="Enter Category Name"
                  label="Category Name"
                  name="name"
                  {...register('name', { required: 'Name is required' })}
                  required
                />
                {errors.name && <small className="text-danger">{errors.name.message}</small>}
              </CCol>
            </CRow>
            {/* <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Slug"
                  placeholder="Enter Slug"
                  name="slug"
                  {...register('slug')}
                  required
                />
                {errors.slug && <small className="text-danger">{errors.slug.message}</small>}
              </CCol>
            </CRow> */}

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormSelect
                  label="Parent Category"
                  {...register('parent', { required: 'Parent Category is required' })}
                >
                  <option value="0">Select Parent Category</option>
                  <option value="65f2a1b3c4d5e6f789012345">As Parent</option>
                  {category && category.map((a, i) => <option value={a._id}>{a.name}</option>)}
                </CFormSelect>
                {errors.parent && <small className="text-danger">{errors.parent.message}</small>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  placeholder="Enter Meta Title"
                  label="Meta Title"
                  name="name"
                  {...register('meta_title', { required: 'Meta Title is required' })}
                  required
                />
                {errors.meta_title && (
                  <small className="text-danger">{errors.meta_title.message}</small>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  placeholder="Enter Meta Description"
                  label="Meta Description"
                  name="name"
                  {...register('meta_desc', { required: 'Meta Description is required' })}
                  required
                />
                {errors.meta_desc && (
                  <small className="text-danger">{errors.meta_desc.message}</small>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect
                  label="Show in Menu"
                  {...register('nav', { required: 'Menu is required' })}
                >
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </CFormSelect>
                {errors.nav && <small className="text-danger">{errors.nav.message}</small>}
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  label="Menu Position"
                  placeholder="Enter Position"
                  {...register('position')}
                />
                {errors.position && (
                  <small className="text-danger">{errors.position.message}</small>
                )}
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end">
              <CButton
                type="submit"
                color={editingCategory ? 'warning' : 'success'}
                className="rounded-pill px-4 shadow-sm fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    {editingCategory ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <i
                      className={`bi ${editingCategory ? 'bi-arrow-repeat' : 'bi-check-circle'} me-2`}
                    ></i>
                    {editingCategory ? 'Update Category' : 'Save Category'}
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

export default Category
