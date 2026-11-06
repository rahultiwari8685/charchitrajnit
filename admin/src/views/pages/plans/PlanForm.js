import React, { useEffect, useState } from 'react'
import { CForm, CFormInput, CFormSelect, CButton, CRow, CCol, CBadge } from '@coreui/react'
import { useForm } from 'react-hook-form'

import setting from '../../../setting.json'

const PlanForm = ({ editPlan, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm()
  const [features, setFeatures] = useState([])
  const [featureInput, setFeatureInput] = useState('')

  // Load edit data
  useEffect(() => {
    if (editPlan) {
      reset(editPlan)
      setFeatures(editPlan.features || [])
    }
  }, [editPlan, reset])

  // Add feature
  const addFeature = () => {
    if (!featureInput.trim()) return
    setFeatures([...features, featureInput.trim()])
    setFeatureInput('')
  }

  // Remove feature
  const removeFeature = (index) => {
    const updated = [...features]
    updated.splice(index, 1)
    setFeatures(updated)
  }

  const submitForm = async (data) => {
    try {
      const payload = {
        name: data.name,
        price: Number(data.price),
        billing_cycle: data.billing_cycle,
        report_limit: data.report_limit,
        features: features,
      }

      const API_URL = `${setting.api}/api/plans/savePlan`

      let response

      if (editPlan) {
        response = await fetch(`${API_URL}/${editPlan._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save plan')
      }

      const result = await response.json()
      console.log(result)

      onSuccess()
    } catch (error) {
      console.error('Error saving plan:', error)
    }
  }

  return (
    <CForm onSubmit={handleSubmit(submitForm)}>
      <CRow>
        <CCol md={6} className="mt-3">
          <CFormInput
            label="Plan Name"
            placeholder="Enter Plan Name"
            {...register('name')}
            required
          />
        </CCol>

        <CCol md={6} className="mt-3">
          <CFormInput
            label="Price"
            type="number"
            placeholder="Enter Plan Price"
            {...register('price')}
            required
          />
        </CCol>

        <CCol md={6} className="mt-3">
          <CFormSelect label="Billing Cycle" {...register('billing_cycle')}>
            <option value="">Select</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </CFormSelect>
        </CCol>

        <CCol md={6} className="mt-3">
          <CFormInput
            label="Report Limit"
            placeholder="5 / unlimited"
            {...register('report_limit')}
          />
        </CCol>
      </CRow>

      <div className="mt-4">
        <label className="fw-bold mb-2">Plan Features</label>

        <div className="d-flex gap-2 mb-2">
          <CFormInput
            placeholder="Enter feature"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
          />
          <CButton type="button" color="primary" onClick={addFeature}>
            Add
          </CButton>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <CBadge
              key={index}
              color="info"
              className="p-2"
              style={{ cursor: 'pointer' }}
              onClick={() => removeFeature(index)}
            >
              {feature} ✕
            </CBadge>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <CButton type="submit" color="success">
          {editPlan ? 'Update Plan' : 'Create Plan'}
        </CButton>
      </div>
    </CForm>
  )
}

export default PlanForm
