import React, { useState, useEffect } from 'react'
import { cilUser, cilLockLocked } from '@coreui/icons'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CButton,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'

import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import CIcon from '@coreui/icons-react'
import toast from 'react-hot-toast'
import newsroomBg from '../../../assets/images/Bharat19_Admin.png'
import setting from '../../../setting.json'
import secureLocalStorage from 'react-secure-storage'

const schema = yup.object().shape({
  email: yup.string().email().required('Enter your valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password must be at least 1 character'),
})

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const login = async (data) => {
    console.log('Login data:', data)

    let lg = {
      email: data.email,
      password: data.password,
    }

    try {
      const response = await fetch(setting.api + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lg),
        mode: 'cors',
      })

      if (!response.ok) {
        throw new Error('Server error. Please try again.')
      }

      const dd = await response.json()

      console.log('API response:', dd)

      if (dd.result === 'success') {
        let loginData = {
          token: dd.token,
          role: dd.role,
          user: dd.user,
        }

        secureLocalStorage.setItem('logininfo', JSON.stringify(loginData))

        toast.success('Login Successful')

        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      } else {
        toast.error(dd.message || dd.reason || 'Invalid email or password')
      }
    } catch (error) {
      console.error('Login Error:', error)

      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.bg}>
      <div style={styles.overlay}></div>

      <CContainer className="min-vh-100 d-flex justify-content-center align-items-center">
        <CRow className="justify-content-center w-100">
          <CCol md={5} lg={4}>
            <CCard style={styles.card} className="border-0">
              <CCardBody>
                {/* Logo */}
                <div className="text-center mb-4">
                  <h1 style={styles.brand}>Bharat19Express</h1>
                  <div style={styles.divider}></div>
                  <p style={styles.subtitle}>News Admin Login</p>
                </div>

                <CForm onSubmit={handleSubmit(login)}>
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={styles.iconBox}>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      style={styles.input}
                      {...register('email')}
                    />
                  </CInputGroup>
                  {errors.email && <p style={styles.error}>{errors.email.message}</p>}

                  {/* <CInputGroup className="mb-3">
                    <CInputGroupText style={styles.iconBox}>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      style={styles.input}
                      {...register('password')}
                    />
                  </CInputGroup> */}

                  <CInputGroup className="mb-3">
                    <CInputGroupText style={styles.iconBox}>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>

                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      style={styles.input}
                      {...register('password')}
                    />

                    <CInputGroupText
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </CInputGroupText>
                  </CInputGroup>
                  {errors.password && <p style={styles.error}>{errors.password.message}</p>}

                  {/* <CButton type="submit" className="w-100 mt-3" style={styles.button}>
                    Sign In
                  </CButton> */}

                  <CButton
                    type="submit"
                    className="w-100 mt-3"
                    style={styles.button}
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

const styles = {
  bg: {
    background: `
    linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)),
    url(${newsroomBg})
  `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  },

  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  card: {
    padding: '2rem',
    borderRadius: '8px',
    background: 'rgba(20,20,20,0.85)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  brand: {
    fontWeight: 800,
    fontSize: '1.8rem',
    letterSpacing: '1px',
  },

  divider: {
    width: '40px',
    height: '3px',
    background: '#e50914',
    margin: '10px auto',
  },

  subtitle: {
    color: '#aaa',
    fontSize: '0.85rem',
  },

  input: {
    backgroundColor: 'transparent',
    border: '1px solid #444',
    color: '#fff',
  },

  iconBox: {
    backgroundColor: 'transparent',
    border: '1px solid #444',
    color: '#aaa',
  },

  button: {
    background: '#e50914',
    border: 'none',
    fontWeight: 'bold',
  },

  error: {
    color: '#ff6b6b',
    fontSize: '0.8rem',
  },
}

export default Login
