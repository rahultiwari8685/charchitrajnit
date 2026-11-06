import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
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
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { useForm, Controller } from 'react-hook-form'
import setting from '../../../setting.json'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import secureLocalStorage from 'react-secure-storage'
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  bio: yup.string().required('Bio is required'),
  email: yup.string().required('Phone is required'),
  // password: yup.string().required('Enter HSN Code'),
  password: yup.string().when('$isEditing', {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required('Password is required'),
  }),
  role: yup.string().required('Status is required'),
  user_status: yup.string().required('Status is required'),
  phone: yup.string().required('Status is required'),
  post_permission: yup.string().required('Status is required'),
  image: yup.file,
  isVerified: yup.boolean().default(false),
})

const Users = () => {
  const [userList, setUserList] = useState([])

  const [editingUser, setEditingUser] = useState(null)
  const [visible, setVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema, undefined, {
      context: { isEditing: Boolean(editingUser) },
    }),
    defaultValues: {
      isVerified: false,
    },
  })

  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name || '',
        email: editingUser.email || '',
        phone: editingUser.phone || '',
        password: '',
        role: editingUser.role || '',
        post_permission: editingUser.post_permission || '',
        user_status: editingUser.user_status || '',
        isVerified:
          editingUser.isVerified === true ||
          editingUser.isVerified === 'true' ||
          editingUser.isVerified === 1,
      })
    }
  }, [editingUser, reset])

  const allUserList = async () => {
    await fetch(setting.api + '/api/users/getAllUser', {
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
          // secureLocalStorage.clear();
          navigate('/login')
        } else {
          setUserList(u.data)
        }
      })
  }

  useEffect(() => {
    allUserList()
  }, [])

  // const saveUser = async (data) => {
  //   const formData = new FormData()
  //   formData.append('name', data.name)
  //   formData.append('bio', data.bio)
  //   formData.append('email', data.email)
  //   formData.append('phone', data.phone)
  //   formData.append('password', data.password)
  //   formData.append('role', data.role)
  //   formData.append('post_permission', data.post_permission)
  //   formData.append('user_status', data.user_status)

  //   if (data.image?.[0]) {
  //     formData.append('profileImage', data.image[0])
  //   }

  //   let endpoint = '/api/users/saveUser'
  //   let headers = {}

  //   if (editingUser) {
  //     endpoint = '/api/users/updateUser'
  //     formData.append('id', editingUser._id)

  //     headers = {
  //       Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
  //     }
  //   }

  //   try {
  //     const res = await fetch(setting.api + endpoint, {
  //       method: 'POST',
  //       body: formData,
  //       mode: 'cors',
  //       headers,
  //     })

  //     const result = await res.json()
  //     console.log('User API response:', result)

  //     if (result.status === true) {
  //       allUserList()
  //       reset()
  //       setEditingUser(null)
  //       setVisible(false)
  //     } else {
  //       alert(result.message || 'Failed to save user')
  //     }
  //   } catch (error) {
  //     console.error('Error saving user:', error)
  //   }
  // }

  const saveUser = async (data) => {
    if (saving) return

    setSaving(true)

    try {
      const formData = new FormData()

      formData.append('name', data.name)
      formData.append('bio', data.bio)
      formData.append('email', data.email)
      formData.append('phone', data.phone)

      if (data.password) {
        formData.append('password', data.password)
      }

      formData.append('role', data.role)
      formData.append('post_permission', data.post_permission)
      formData.append('user_status', data.user_status)
      formData.append('isVerified', String(data.isVerified === true))

      if (data.image?.[0]) {
        formData.append('profileImage', data.image[0])
      }

      let endpoint = '/api/users/saveUser'
      const headers = {}

      if (editingUser) {
        endpoint = '/api/users/updateUser'
        formData.append('id', editingUser._id)

        const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')

        headers.Authorization = 'Bearer ' + (loginInfo.token || '')
      }

      const res = await fetch(setting.api + endpoint, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers,
      })

      const result = await res.json()

      if (res.ok && (result.success === true || result.status === true)) {
        await allUserList()
        reset()
        setEditingUser(null)
        setVisible(false)
      } else {
        alert(result.message || 'Failed to save user')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Something went wrong while saving the user')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setVisible(true)
  }

  function handleDelete(id) {
    var ans = confirm('Are you sure For Delete?')
    console.log(ans)

    if (ans == true) {
      deleteUser(id)
    }
  }

  // const deleteUser = async (id) => {
  //   try {
  //     const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')

  //     const token = loginInfo?.token || ''

  //     const response = await fetch(`${setting.api}/api/users/deleteUser/${id}`, {
  //       method: 'POST',
  //       mode: 'cors',
  //       headers: {
  //         Authorization: 'Bearer ' + token,
  //         'Content-Type': 'application/json',
  //       },
  //     })

  //     const result = await response.json()

  //     if (!response.ok) {
  //       console.error('Delete failed:', result)
  //     } else {
  //       console.log('User deleted:', result)
  //       allUserList() // refresh
  //     }
  //   } catch (err) {
  //     console.error('Error deleting user:', err)
  //   }
  // }

  const deleteUser = async (id) => {
    if (deletingId !== null) return

    setDeletingId(id)

    try {
      const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')

      const response = await fetch(`${setting.api}/api/users/deleteUser/${id}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: 'Bearer ' + (loginInfo.token || ''),
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok || result.status === false) {
        alert(result.message || 'Failed to delete user')
        return
      }

      await allUserList()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Something went wrong while deleting the user')
    } finally {
      setDeletingId(null)
    }
  }

  const totalPages = Math.ceil(userList.length / itemsPerPage)
  const paginatedItems = userList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div>
      <CCard className="shadow border-0 rounded-4">
        <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-people-fill me-2 text-warning"></i> User
            </h5>
            <CButton
              color="light"
              variant="outline"
              className="fw-semibold px-3 shadow-sm rounded-pill"
              onClick={() => {
                setEditingUser(null)
                reset()
                setVisible(true)
              }}
            >
              <i className="bi bi-plus-circle me-2"></i> {userList ? 'Create User' : 'Update User'}
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <CTable striped responsive bordered hover>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Verification</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Role</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {paginatedItems.map((a, index) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index
                return (
                  <CTableRow key={a.id}>
                    <CTableDataCell>{actualIndex + 1}</CTableDataCell>
                    <CTableDataCell>{a.name}</CTableDataCell>
                    <CTableDataCell>
                      {a.isVerified === true ? (
                        <span className="badge bg-primary">
                          <i className="bi bi-patch-check-fill me-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Not Verified</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{a.phone}</CTableDataCell>
                    <CTableDataCell>{a.email}</CTableDataCell>

                    <CTableDataCell>
                      <span className="badge bg-dark">
                        {a.role === '1'
                          ? 'Admin'
                          : a.role === '2'
                            ? 'Editor'
                            : a.role === '3'
                              ? 'Correspondent'
                              : 'Subscriber'}
                      </span>
                    </CTableDataCell>

                    <CTableDataCell>
                      <span className="badge bg-dark">
                        {a.user_status === '1' ? 'Active' : 'Inactive'}
                      </span>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="warning"
                        className="rounded-pill px-3 shadow-sm fw-semibold"
                        onClick={() => handleEdit(a)}
                      >
                        <CIcon icon={cilPencil} style={{ marginRight: '5px' }} />
                        Edit
                      </CButton>{' '}
                      <CButton
                        size="sm"
                        color="danger"
                        className="rounded-pill px-3 shadow-sm fw-semibold"
                        onClick={() => handleDelete(a._id)}
                        disabled={deletingId !== null}
                      >
                        {deletingId === a._id ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <CIcon icon={cilTrash} style={{ marginRight: '5px' }} />
                            Delete
                          </>
                        )}
                      </CButton>
                      {/* <CButton
                        size="sm"
                        color="danger"
                        className="rounded-pill px-3 shadow-sm fw-semibold"
                        onClick={() => handleDelete(a._id)}
                      >
                        <CIcon icon={cilTrash} style={{ marginRight: '5px' }} />
                        Delete
                      </CButton> */}
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
          {editingUser ? 'Update User' : 'Create User'}
        </COffcanvasHeader>
        <COffcanvasBody>
          <CForm onSubmit={handleSubmit(saveUser)}>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  placeholder="Enter Name"
                  label="Full Name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <small className="text-danger">{errors.name.message}</small>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  placeholder="Enter Bio"
                  label="Bio"
                  {...register('bio', { required: 'Bio is required' })}
                />
                {errors.bio && <small className="text-danger">{errors.bio.message}</small>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  type="email"
                  label="Email"
                  placeholder="Enter Email"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <small className="text-danger">{errors.email.message}</small>}
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Phone"
                  placeholder="Enter Phone Number"
                  {...register('phone', { required: 'Phone is required' })}
                />
                {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  type="password"
                  label="Password"
                  placeholder="Enter Password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                {errors.password && (
                  <small className="text-danger">{errors.password.message}</small>
                )}
              </CCol>

              <CCol md={6}>
                <CFormSelect
                  label="Status"
                  {...register('user_status', { required: 'Status is required' })}
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">In-Active</option>
                </CFormSelect>
                {errors.user_status && (
                  <small className="text-danger">{errors.user_status.message}</small>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect label="Role" {...register('role', { required: 'Role is required' })}>
                  <option value="">Select Role</option>
                  <option value="1">Admin</option>
                  <option value="2">Editor</option>
                  <option value="3">Correspondent</option>
                  <option value="4">Subscriber</option>
                </CFormSelect>
                {errors.role && <small className="text-danger">{errors.role.message}</small>}
              </CCol>

              <CCol md={6}>
                <CFormSelect
                  label="Post Permission"
                  {...register('post_permission', { required: 'Permission is required' })}
                >
                  <option value="">Select</option>
                  <option value="1">Draft</option>
                  <option value="2">Publish</option>
                </CFormSelect>
                {errors.post_permission && (
                  <small className="text-danger">{errors.post_permission.message}</small>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  type="file"
                  label="Profile Image"
                  accept="image/*"
                  {...register('image')}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <div className="border rounded-3 p-3">
                  <div className="mb-3">
                    <div className="fw-semibold mb-1">Author Verification</div>
                    <small className="text-body-secondary">
                      Choose whether this author should display the blue verification tick.
                    </small>
                  </div>

                  <Controller
                    name="isVerified"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => {
                      const isVerified = field.value === true

                      return (
                        <div
                          className="d-flex gap-2 flex-wrap"
                          role="group"
                          aria-label="Author verification status"
                        >
                          <CButton
                            type="button"
                            color={isVerified ? 'primary' : 'secondary'}
                            variant={isVerified ? undefined : 'outline'}
                            className="rounded-pill px-3"
                            aria-pressed={isVerified}
                            onClick={() => field.onChange(true)}
                          >
                            <i className="bi bi-patch-check-fill me-2" />
                            Verified
                          </CButton>

                          <CButton
                            type="button"
                            color={!isVerified ? 'secondary' : 'secondary'}
                            variant={!isVerified ? undefined : 'outline'}
                            className="rounded-pill px-3"
                            aria-pressed={!isVerified}
                            onClick={() => field.onChange(false)}
                          >
                            <i className="bi bi-patch-minus me-2" />
                            Not Verified
                          </CButton>
                        </div>
                      )
                    }}
                  />
                </div>
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end">
              <CButton
                type="submit"
                color={editingUser ? 'warning' : 'success'}
                className="rounded-pill px-4 shadow-sm fw-semibold"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    {editingUser ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <i
                      className={`bi ${editingUser ? 'bi-arrow-repeat' : 'bi-check-circle'} me-2`}
                    />
                    {editingUser ? 'Update User' : 'Save User'}
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

export default Users
