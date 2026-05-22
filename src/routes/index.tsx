import {lazy} from 'react';
import isMobile from '@/utils/winUtils';
import NoPage from '@/components/404/NoPage';

const Home = lazy(() => import('../pages/Home'));
const Help = lazy(() => import('../pages/Help'));
const Blog = lazy(() => import('../pages/Blog'));
const SeeTime = lazy(() => import('../pages/SeeTime'));
const MobileLayout = lazy(() => import('../pages/Mobile'));
const MobileAuth = lazy(() => import('../pages/Mobile/layout/Auth'));
const MobileFallback = lazy(() => import('../pages/Mobile/layout/Fallback'));
const MobileMemos = lazy(() => import('../pages/Mobile/pages/Memos'));
const MobileBlog = lazy(() => import('../pages/Mobile/pages/Blog'));
const MobileMe = lazy(() => import('../pages/Mobile/pages/Me'));

export default isMobile() ?
  [
      {
          path: '/',
          element: <MobileLayout />,
          title: '仰晨备忘',
          children: [
              {
                  element: <MobileAuth />,
                  children: [
                      {
                          index: true,
                          element: <MobileMemos />,
                          title: '仰晨备忘',
                      },
                      {
                          path: 'me',
                          element: <MobileMe />,
                          title: '个人中心',
                      },
                  ],
              },
              {
                  path: 'blog',
                  element: <MobileBlog />,
                  title: '仰晨-博客',
              },
              {
                  path: '*',
                  element: <MobileFallback />,
                  title: '未知页面',
              },
          ],
      },
  ]
  :
  [
      {
          path: '/',
          element: <Home />,
          title: 'Open备忘第一页',
      },
      {
          path: '/help',
          element: <Help />,
          title: '仰晨-帮助页',
      },
      {
          path: '/blog',
          element: <Blog />,
          title: '仰晨-博客',
      },
      {
          path: '/seeTime',
          element: <SeeTime />,
          title: '看时间',
      },
      {
          path: '/*',
          element: <NoPage />,
          title: '未知页面',
      },
  ];
