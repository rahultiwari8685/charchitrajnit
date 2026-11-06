import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilBan } from '@coreui/icons'

import setting from '../../../setting.json'

const PlanList = ({ onEdit }) => {
  const [plans, setPlans] = useState([])

  const loadPlans = async () => {
    try {
      const response = await fetch(`${setting.api}/api/plans/getAllPlans`)

      if (!response.ok) {
        throw new Error('Failed to fetch plans')
      }

      const data = await response.json()

      setPlans(data.data || [])
      console.log(data.data)
    } catch (error) {
      console.error('Error loading plans:', error)
    }
  }

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${setting.api}/api/plans/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      await loadPlans()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  useEffect(() => {
    loadPlans()
  }, [])

  return (
    <CTable responsive hover>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>SR.No</CTableHeaderCell>
          <CTableHeaderCell>Name</CTableHeaderCell>
          <CTableHeaderCell>Price</CTableHeaderCell>
          <CTableHeaderCell>Billing</CTableHeaderCell>
          <CTableHeaderCell>Report Limit</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>Action</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        {plans.map((plan, i) => (
          <CTableRow key={plan._id}>
            <CTableDataCell>{i + 1}</CTableDataCell>
            <CTableDataCell>{plan.name}</CTableDataCell>
            <CTableDataCell>₹{plan.price}</CTableDataCell>
            <CTableDataCell>{plan.billing_cycle}</CTableDataCell>
            <CTableDataCell>{plan.report_limit}</CTableDataCell>
            <CTableDataCell>
              <CBadge color={plan.is_active ? 'success' : 'secondary'}>
                {plan.is_active ? 'Active' : 'Inactive'}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton size="sm" color="info" className="me-2" onClick={() => onEdit(plan)}>
                <CIcon icon={cilPencil} />
              </CButton>
              <CButton size="sm" color="warning" onClick={() => toggleStatus(plan._id)}>
                <CIcon icon={cilBan} />
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default PlanList
