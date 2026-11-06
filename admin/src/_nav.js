import React from 'react'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'

import {
  cilSpeedometer,
  cilBullhorn,
  cilFolder,
  cilPeople,
  cilSettings,
  cilFile,
  cilMap,
  cilRss,
  cilNewspaper,
  cilPlus,
  cilCheckCircle,
  cilPencil,
  cilTrash,
  cilChart,
  cilCalendar,
  cilUser,
  cilTags,
} from '@coreui/icons'

export const adminNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'News',
    to: '/news',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add News',
        to: '/news',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add Short',
        to: '/shorts',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Published News',
        to: '/PublishedNews',
        icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Draft News',
        to: '/DraftNews',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Scheduled News',
        to: '/ScheduleNews',
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
      },
    ],
  },

  {
    component: CNavItem,
    name: 'Users',
    to: '/Users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Category',
    to: '/Category',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Advertisement',
    to: '/Advertisement',
    icon: <CIcon icon={cilBullhorn} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'E-Paper',
    to: '/magazine',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Gallery',
    to: '/gallery',
    icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Poll',
    to: '/polls',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Subscriber',
    to: '/subscriber',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'SiteSetting',
    to: '/siteSetting',
    icon: <CIcon icon={cilBullhorn} customClassName="nav-icon" />,
  },
]
export const editorNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'News',
    to: '/news',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add News',
        to: '/news',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Published News',
        to: '/PublishedNews',
        icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Draft News',
        to: '/DraftNews',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Scheduled News',
        to: '/ScheduleNews',
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
      },
    ],
  },

  {
    component: CNavItem,
    name: 'Category',
    to: '/Category',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Profile',
    to: '/Profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'E-Paper',
    to: '/magazine',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Poll',
    to: '/polls',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
]
export const correspondenceNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'News',
    to: '/news',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add News',
        to: '/news',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Published News',
        to: '/PublishedNews',
        icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Draft News',
        to: '/DraftNews',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Scheduled News',
        to: '/ScheduleNews',
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
      },
      // {
      //   component: CNavItem,
      //   name: 'Deleted News',
      //   to: '/DeletedNews',
      //   icon: <CIcon icon={cilTrash} customClassName="nav-icon" />,
      // },
    ],
  },

  {
    component: CNavItem,
    name: 'Profile',
    to: '/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]
export const subscriberNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'News',
    to: '/news',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Add News',
      //   to: '/news',
      //   icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      // },
      {
        component: CNavItem,
        name: 'Published News',
        to: '/PublishedNews',
        icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Draft News',
        to: '/DraftNews',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Scheduled News',
        to: '/ScheduleNews',
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
      },
      // {
      //   component: CNavItem,
      //   name: 'Deleted News',
      //   to: '/DeletedNews',
      //   icon: <CIcon icon={cilTrash} customClassName="nav-icon" />,
      // },
    ],
  },

  // {
  //   component: CNavItem,
  //   name: 'Users',
  //   to: '/Users',
  //   icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Category',
  //   to: '/Category',
  //   icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Profile',
    to: '/Profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]
