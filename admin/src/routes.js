import React from 'react'
import GalleryManager from './views/pages/galleryManager/GalleryManager'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const News = React.lazy(() => import('./views/pages/news/News'))
const UpdateNews = React.lazy(() => import('./views/pages/news/UpdateNews'))
const PublishedNews = React.lazy(() => import('./views/pages/news/PublishedNews'))
const DraftNews = React.lazy(() => import('./views/pages/news/DraftNews'))
const DeletedNews = React.lazy(() => import('./views/pages/news/DeletedNews'))
const ChangePassword = React.lazy(() => import('./views/pages/changePassword/ChangePassword'))
const ScheduleNews = React.lazy(() => import('./views/pages/news/ScheduleNews'))

const Users = React.lazy(() => import('./views/pages/users/Users'))
const Profile = React.lazy(() => import('./views/pages/users/Profile'))
const Category = React.lazy(() => import('./views/pages/category/Category'))
const Advertisement = React.lazy(() => import('./views/pages/advertisement/Advertisement'))
const SiteSetting = React.lazy(() => import('./views/pages/siteSetting/SiteSetting'))

const Shorts = React.lazy(() => import('./views/pages/shorts/Shorts'))
const Magazine = React.lazy(() => import('./views/pages/magazine/Magazine'))
const Subscriptions = React.lazy(() => import('./views/pages/subscription/Subscriptions'))
const Polls = React.lazy(() => import('./views/pages/polls/Polls'))
const Subscriber = React.lazy(() => import('./views/pages/subscriber/Subscriber'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  { path: '/news', name: 'News', element: News },
  { path: '/UpdateNews/:id', name: 'Update News', element: UpdateNews },
  { path: '/PublishedNews', name: 'Published News', element: PublishedNews },
  { path: '/DraftNews', name: 'Draft News', element: DraftNews },
  { path: '/DeletedNews', name: 'Deleted News', element: DeletedNews },
  { path: '/ScheduleNews', name: 'Scheduled News', element: ScheduleNews },
  { path: '/siteSetting', name: 'Site Setting', element: SiteSetting },
  { path: '/gallery', name: 'Gallery', element: GalleryManager },
  { path: '/subscriber', name: 'Subscriber', element: Subscriber },
  // { path: '/plans', name: 'Plans', element: Plans },

  { path: '/subscription', name: 'Subscription', element: Subscriptions },
  { path: '/ChangePassword', name: 'Change Password', element: ChangePassword },
  { path: '/Users', name: 'Users', element: Users },
  { path: '/Category', name: 'Category', element: Category },
  { path: '/advertisement', name: 'Advertisement', element: Advertisement },
  { path: '/shorts', name: 'Shorts', element: Shorts },
  { path: '/magazine', name: 'Magazine', element: Magazine },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/polls', name: 'Polls', element: Polls },
]
export default routes
