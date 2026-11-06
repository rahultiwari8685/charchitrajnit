import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a rel="noopener noreferrer">
          Version 1.0
        </a>

      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://techaiindia.com/" target="_blank" rel="noopener noreferrer">
          TechAi India
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
