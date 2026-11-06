import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CFormLabel,
} from '@coreui/react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import secureLocalStorage from 'react-secure-storage'
import setting from '../../../setting.json'

const schema = yup.object().shape({
  siteName: yup.string().required('Site Name is required'),
  metaTitle: yup.string().required('Meta Title is required'),
  metaDescription: yup.string().required('Meta Description is required'),
})

const SiteSetting = () => {
  const [loading, setLoading] = useState(false)

  const [headerPreview, setHeaderPreview] = useState('')
  const [footerPreview, setFooterPreview] = useState('')
  const [faviconPreview, setFaviconPreview] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token

  useEffect(() => {
    getSiteSetting()
  }, [])

  const getSiteSetting = async () => {
    try {
      const res = await fetch(setting.api + '/api/site-settings', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const result = await res.json()

      if (result.success && result.data) {
        const data = result.data

        reset({
          siteName: data.siteName,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,

          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
          youtube: data.youtube,
          linkedin: data.linkedin,

          email: data.email,
          phone: data.phone,
          address: data.address,
          copyright: data.copyright,
        })

        if (data.headerLogo) {
          setHeaderPreview(`${setting.api}/uploads/images/${data.headerLogo}`)
        }

        if (data.footerLogo) {
          setFooterPreview(`${setting.api}/uploads/images/${data.footerLogo}`)
        }

        if (data.favicon) {
          setFaviconPreview(`${setting.api}/uploads/images/${data.favicon}`)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const saveSetting = async (data) => {
    setLoading(true)

    try {
      const formData = new FormData()

      formData.append('siteName', data.siteName)
      formData.append('metaTitle', data.metaTitle)
      formData.append('metaDescription', data.metaDescription)
      formData.append('metaKeywords', data.metaKeywords)

      formData.append('facebook', data.facebook)
      formData.append('instagram', data.instagram)
      formData.append('twitter', data.twitter)
      formData.append('youtube', data.youtube)
      formData.append('linkedin', data.linkedin)

      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('address', data.address)
      formData.append('copyright', data.copyright)

      if (data.headerLogo?.[0]) {
        formData.append('headerLogo', data.headerLogo[0])
      }

      if (data.footerLogo?.[0]) {
        formData.append('footerLogo', data.footerLogo[0])
      }

      if (data.favicon?.[0]) {
        formData.append('favicon', data.favicon[0])
      }

      const res = await fetch(setting.api + '/api/site-settings/save', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formData,
      })

      const result = await res.json()

      if (result.success) {
        toast.success('Site Setting Updated Successfully')
        getSiteSetting()
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard className="shadow border-0 rounded-4">
      <CCardHeader className="bg-dark text-white py-3">
        <h5 className="mb-0">
          <i className="bi bi-gear-fill me-2"></i>
          Site Settings
        </h5>
      </CCardHeader>

      <CCardBody>
        <CForm onSubmit={handleSubmit(saveSetting)}>
          {/* GENERAL */}

          <h5 className="mb-4 text-primary">General Information</h5>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput label="Site Name" {...register('siteName')} />
              <small className="text-danger">{errors.siteName?.message}</small>
            </CCol>

            <CCol md={6}>
              <CFormInput label="Meta Title" {...register('metaTitle')} />
              <small className="text-danger">{errors.metaTitle?.message}</small>
            </CCol>
          </CRow>

          <CRow className="mb-4">
            <CCol md={12}>
              <CFormTextarea rows={3} label="Meta Description" {...register('metaDescription')} />
              <small className="text-danger">{errors.metaDescription?.message}</small>
            </CCol>
          </CRow>

          <CRow className="mb-4">
            <CCol md={12}>
              <CFormTextarea
                rows={3}
                label="Meta Keywords"
                placeholder="news, india, politics"
                {...register('metaKeywords')}
              />
            </CCol>
          </CRow>

          <hr />

          <h5 className="mb-4 text-primary">Header Logo</h5>

          <CRow className="mb-4">
            <CCol md={6}>
              <CFormLabel>Header Logo</CFormLabel>

              <CFormInput
                type="file"
                accept="image/*"
                {...register('headerLogo')}
                onChange={(e) => {
                  const file = e.target.files[0]

                  if (file) {
                    setHeaderPreview(URL.createObjectURL(file))
                  }
                }}
              />
            </CCol>

            <CCol md={6}>
              {headerPreview && (
                <img
                  src={headerPreview}
                  style={{
                    width: 220,
                    borderRadius: 10,
                    border: '1px solid #ddd',
                  }}
                />
              )}
            </CCol>
          </CRow>

          <hr />

          <h5 className="mb-4 text-primary">Footer Logo</h5>

          <CRow className="mb-4">
            <CCol md={6}>
              <CFormLabel>Footer Logo</CFormLabel>

              <CFormInput
                type="file"
                accept="image/*"
                {...register('footerLogo')}
                onChange={(e) => {
                  const file = e.target.files[0]

                  if (file) {
                    setFooterPreview(URL.createObjectURL(file))
                  }
                }}
              />
            </CCol>

            <CCol md={6}>
              {footerPreview && (
                <img
                  src={footerPreview}
                  style={{
                    width: 220,
                    borderRadius: 10,
                    border: '1px solid #ddd',
                  }}
                />
              )}
            </CCol>
          </CRow>

          <hr />

          <h5 className="mb-4 text-primary">Favicon</h5>

          <CRow className="mb-5">
            <CCol md={6}>
              <CFormLabel>Favicon</CFormLabel>

              <CFormInput
                type="file"
                accept="image/*"
                {...register('favicon')}
                onChange={(e) => {
                  const file = e.target.files[0]

                  if (file) {
                    setFaviconPreview(URL.createObjectURL(file))
                  }
                }}
              />
            </CCol>

            <CCol md={6}>
              {faviconPreview && (
                <img
                  src={faviconPreview}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 8,
                    border: '1px solid #ddd',
                  }}
                />
              )}
            </CCol>
          </CRow>

          <hr />

          <h5 className="mb-4 text-primary">Social Media</h5>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                label="Facebook"
                placeholder="https://facebook.com/..."
                {...register('facebook')}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Instagram"
                placeholder="https://instagram.com/..."
                {...register('instagram')}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                label="Twitter (X)"
                placeholder="https://x.com/..."
                {...register('twitter')}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Youtube"
                placeholder="https://youtube.com/..."
                {...register('youtube')}
              />
            </CCol>
          </CRow>

          <CRow className="mb-5">
            <CCol md={12}>
              <CFormInput
                label="LinkedIn"
                placeholder="https://linkedin.com/..."
                {...register('linkedin')}
              />
            </CCol>
          </CRow>

          <hr />

          <h5 className="mb-4 text-primary">Contact Information</h5>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput label="Email" placeholder="info@example.com" {...register('email')} />
            </CCol>

            <CCol md={6}>
              <CFormInput label="Phone" placeholder="+91 9876543210" {...register('phone')} />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <CFormTextarea rows={3} label="Address" {...register('address')} />
            </CCol>
          </CRow>

          <CRow className="mb-5">
            <CCol md={12}>
              <CFormInput
                label="Copyright"
                placeholder="© 2026 Bharat 19 Express. All Rights Reserved."
                {...register('copyright')}
              />
            </CCol>
          </CRow>

          <div className="text-end">
            <CButton type="submit" color="success" disabled={loading} className="rounded-pill px-5">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Save Settings
                </>
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default SiteSetting
