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
  CSpinner,
} from '@coreui/react'

import secureLocalStorage from 'react-secure-storage'
import setting from '../../../setting.json'
import toast from 'react-hot-toast'
const Profile = () => {
  const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')

  const userId = loginInfo?.user?.id

  const [user, setUser] = useState(null)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const getProfile = async () => {
    try {
      const res = await fetch(`${setting.api}/api/users/getUserById/${userId}`, {
        headers: {
          Authorization: `Bearer ${loginInfo.token}`,
        },
      })

      const result = await res.json()

      if (result.status) {
        setUser(result.data)
      }
    } catch (error) {
      console.error('Profile Error:', error)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const updateProfile = async () => {
    try {
      setLoading(true)

      const formData = new FormData()

      formData.append('id', user._id)
      formData.append('name', user.name || '')
      formData.append('bio', user.bio || '')
      formData.append('email', user.email || '')
      formData.append('phone', user.phone || '')

      formData.append('role', user.role || '')
      formData.append('post_permission', user.post_permission || '')
      formData.append('user_status', user.user_status || '1')

      // Keep password empty
      formData.append('password', '')

      if (image) {
        formData.append('profileImage', image)
      }

      const res = await fetch(`${setting.api}/api/users/updateUser`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loginInfo.token}`,
        },
        body: formData,
      })

      const result = await res.json()

      if (result.success) {
        toast.success('Profile updated successfully')
        getProfile()
      } else {
        toast.error(result.message || 'Update failed')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center mt-5">
        <CSpinner />
      </div>
    )
  }

  return (
    <CCard className="shadow border-0 rounded-4">
      <CCardHeader className="bg-dark text-white">
        <h5 className="mb-0">My Profile</h5>
      </CCardHeader>

      <CCardBody>
        <CForm>
          <CRow className="mb-4">
            <CCol md={12} className="text-center">
              {user.profileImage && (
                <img
                  src={`${setting.api}/uploads/images/${user.profileImage}`}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                  }}
                />
              )}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                label="Name"
                name="name"
                value={user.name || ''}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Email"
                name="email"
                value={user.email || ''}
                onChange={handleChange}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                label="Phone"
                name="phone"
                value={user.phone || ''}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput label="Bio" name="bio" value={user.bio || ''} onChange={handleChange} />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                label="Role"
                value={
                  user.role === '1'
                    ? 'Admin'
                    : user.role === '2'
                      ? 'Editor'
                      : user.role === '3'
                        ? 'Correspondent'
                        : 'Subscriber'
                }
                readOnly
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="file"
                label="Profile Image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </CCol>
          </CRow>

          <div className="text-end">
            <CButton color="primary" onClick={updateProfile} disabled={loading}>
              {loading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default Profile
