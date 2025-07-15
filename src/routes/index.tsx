import {lazy} from "react";
import isMobile from "@/utils/winUtils";
import NoPage from "@/components/404/NoPage";

const Home = lazy(() => import('../pages/Home'));
const Help = lazy(() => import('../pages/Help'));
const Blog = lazy(() => import('../pages/Blog'));
const SpecialChar = lazy(() => import('../pages/UtilsPage/SpecialChar'));
const GgComparator = lazy(() => import('../pages/UtilsPage/GgComparator'));
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
          path: '/utils-specialChar',
          element: <SpecialChar />,
          title: '仰晨工具-字母数字转特殊字符',
      },
      {
          path: '/utils-ggComparator',
          element: <GgComparator />,
          title: '仰晨工具-gg比价器',
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