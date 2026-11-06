import React, { useEffect, useState } from 'react'
import { CForm, CFormSelect, CButton, CRow, CCol } from '@coreui/react'
import { useForm } from 'react-hook-form'

import setting from '../../../setting.json'

const SubscriptionForm = ({ editSub, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm()
  const [customers, setCustomers] = useState([])
  const [plans, setPlans] = useState([])

  const API_URL = `${setting.api}/api/subscriptions`
  useEffect(() => {
    if (editSub) reset(editSub)

    const loadData = async () => {
      try {
        const [customerRes, planRes] = await Promise.all([
          fetch(`${setting.api}/api/customers`),
          fetch(`${setting.api}/api/plans/getAllPlan`),
        ])

        if (!customerRes.ok || !planRes.ok) {
          throw new Error('Failed to load data')
        }

        const customerData = await customerRes.json()
        const planData = await planRes.json()

        setCustomers(customerData.data || [])
        setPlans(planData.data || [])
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [editSub, reset])

  const submitForm = async (data) => {
    try {
      let response

      if (editSub) {
        response = await fetch(`${API_URL}/${editSub._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      }

      if (!response.ok) {
        throw new Error('Failed to save subscription')
      }

      const result = await response.json()
      console.log(result)

      onSuccess()
    } catch (error) {
      console.error('Error saving subscription:', error)
    }
  }

  return (
    <CForm onSubmit={handleSubmit(submitForm)}>
      <CRow>
        <CCol md={6}>
          <CFormSelect label="Customer" {...register('customer_id')} required>
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormSelect label="Plan" {...register('plan_id')} required>
            <option value="">Select Plan</option>
            {plans.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      <div className="mt-3">
        <CButton type="submit" color="success">
          {editSub ? 'Update Subscription' : 'Assign Subscription'}
        </CButton>
      </div>
    </CForm>
  )
}

export default SubscriptionForm
