import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeOpen, cilFactory, cilPen, cilShieldAlt, cilUser } from '@coreui/icons'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import { editorNav, adminNav, correspondenceNav, subscriberNav } from '../_nav'
import secureLocalStorage from 'react-secure-storage'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const userRole = JSON.parse(secureLocalStorage.getItem('logininfo')).role

  console.log('User role from storage:', userRole)

  let navigation = []
  let panelTitle = 'Panel'
  let panelIcon = cilUser
  switch (userRole) {
    case '1':
      navigation = adminNav
      panelTitle = 'Admin Panel'
      panelIcon = cilShieldAlt

      break
    case '2':
      navigation = editorNav
      panelTitle = 'Editor Panel'
      panelIcon = cilPen
      break
    case '3':
      navigation = correspondenceNav
      panelTitle = 'Correspondence'
      panelIcon = cilEnvelopeOpen
      break
    case '4':
      navigation = subscriberNav
      panelTitle = 'Subscriber'
      panelIcon = cilEnvelopeOpen
      break
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom px-3 py-0 d-flex align-items-center justify-content-between bg-dark shadow-sm">
        <div className="d-flex align-items-center gap-2">
          <CIcon icon={panelIcon} size="md" className="text-primary" />
          <span
            className="text-white"
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '1px',
              fontFamily: 'Segoe UI, sans-serif',
              textTransform: 'uppercase',
            }}
          >
            {panelTitle}
          </span>
        </div>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
