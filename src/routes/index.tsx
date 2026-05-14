import {lazy} from 'react';
import isMobile from '@/utils/winUtils';
import NoPage from '@/components/404/NoPage';

const Home = lazy(() => import('../pages/Home'));
const Help = lazy(() => import('../pages/Help'));
const Blog = lazy(() => import('../pages/Blog'));
const SeeTime = lazy(() => import('../pages/SeeTime'));
const Mobile = lazy(() => import('../pages/Mobile'));

export default isMobile() ?
  [
      {
          path: '/*',
          element: <Mobile />,
          title: '仰晨备忘',
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
