import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import LayoutTheme1 from "./component/Layout/LayoutTheme1";
import Trending from "./pages/home/trending";
import Sports from "./pages/home/sports";
import About from "./pages/home/about";
import Subscriber from "./pages/home/subscriber";
import Archive from "./pages/home/archive";
import Contact from "./pages/home/contact";
import Error from "./pages/home/404";
import Post1 from "./pages/home/post1";
import Post2 from "./pages/home/post2";
import Post3 from "./pages/home/post3";
import VideoPost1 from "./pages/home/video_post1";
import VideoPost2 from "./pages/home/video_post2";
import VideoPost3 from "./pages/home/video_post3";
import AudioPost1 from "./pages/home/audio_post1";
import AudioPost2 from "./pages/home/audio_post2";
import AudioPost3 from "./pages/home/audio_post3";
import LeftPost2 from "./pages/home/left_post2";
import LayoutTheme2 from "./component/Layout/LayoutTheme2";
import HomeTwo from "./pages/homeTwo";
import HomeTwoBusiness from "./pages/homeTwo/business";
import HomeTwoEntertainment from "./pages/homeTwo/entertainment";
import HomeTwoFeature from "./pages/homeTwo/Feature";
import HomeTwoTrending from "./pages/homeTwo/trending";
import HomeTwoSports from "./pages/homeTwo/sports";
import HomeTwoAbout from "./pages/homeTwo/about";
import HomeTwoArchive from "./pages/homeTwo/archive";
import HomeTwoContact from "./pages/homeTwo/contact";
import HomeTwoPost1 from "./pages/homeTwo/post1";
import HomeTwoPost2 from "./pages/homeTwo/post2";
import HomeTwoPost3 from "./pages/homeTwo/post3";
import HomeTwoVideoPost1 from "./pages/homeTwo/video_post1";
import HomeTwoVideoPost2 from "./pages/homeTwo/video_post2";
import HomeTwoVideoPost3 from "./pages/homeTwo/video_post3";
import HomeTwoAudioPost1 from "./pages/homeTwo/audio_post1";
import HomeTwoAudioPost2 from "./pages/homeTwo/audio_post2";
import HomeTwoAudioPost3 from "./pages/homeTwo/audio_post3";
import HomeTwoLeftPost2 from "./pages/homeTwo/left_post2";
import LayoutTheme3 from "./component/Layout/LayoutTheme3";
import HomeThree from "./pages/homeThree";
import HomeThreeBusiness from "./pages/homeThree/business";
import HomeThreeEntertainment from "./pages/homeThree/entertainment";
import HomeThreeFeature from "./pages/homeThree/Feature";
import HomeThreeTrending from "./pages/homeThree/trending";
import HomeThreeSports from "./pages/homeThree/sports";
import HomeThreeAbout from "./pages/homeThree/about";
import HomeThreeArchive from "./pages/homeThree/archive";
import HomeThreeContact from "./pages/homeThree/contact";
import HomeThreeError from "./pages/homeThree/404";
import HomeThreePost1 from "./pages/homeThree/post1";
import HomeThreePost2 from "./pages/homeThree/post2";
import HomeThreePost3 from "./pages/homeThree/post3";
import HomeThreeVideoPost1 from "./pages/homeThree/video_post1";
import HomeThreeVideoPost2 from "./pages/homeThree/video_post2";
import HomeThreeVideoPost3 from "./pages/homeThree/video_post3";
import HomeThreeAudioPost1 from "./pages/homeThree/audio_post1";
import HomeThreeAudioPost2 from "./pages/homeThree/audio_post2";
import HomeThreeAudioPost3 from "./pages/homeThree/audio_post3";
import HomeThreeLeftPost2 from "./pages/homeThree/left_post2";
import LayoutThemeDark from "./component/Layout/LayoutThemeDark";
import HomeDark from "./pages/homeDark";
import HomeDarkBusiness from "./pages/homeDark/business";
import HomeDarkEntertainment from "./pages/homeDark/entertainment";
import HomeDarkFeature from "./pages/homeDark/Feature";
import HomeDarkTrending from "./pages/homeDark/trending";
import HomeDarkSports from "./pages/homeDark/sports";
import HomeDarkAbout from "./pages/homeDark/about";
import HomeDarkArchive from "./pages/homeDark/archive";
import HomeDarkContact from "./pages/homeDark/contact";
import HomeDarkError from "./pages/homeDark/404";
import HomeDarkPost1 from "./pages/homeDark/post1";
import HomeDarkPost2 from "./pages/homeDark/post2";
import HomeDarkPost3 from "./pages/homeDark/post3";
import HomeDarkVideoPost1 from "./pages/homeDark/video_post1";
import HomeDarkVideoPost2 from "./pages/homeDark/video_post2";
import HomeDarkVideoPost3 from "./pages/homeDark/video_post3";
import HomeDarkAudioPost1 from "./pages/homeDark/audio_post1";
import HomeDarkAudioPost2 from "./pages/homeDark/audio_post2";
import HomeDarkAudioPost3 from "./pages/homeDark/audio_post3";
import HomeDarkLeftPost2 from "./pages/homeDark/left_post2";
import Category from "./pages/home/category";
import SubscriberLogin from "./pages/homeTwo/subscriberLogin";
import SubscriberRegister from "./pages/homeTwo/subscriberRegister";
import Epaper from "./pages/homeTwo/epaper/Epaper";
import EpaperReader from "./pages/homeTwo/epaper/EpaperReader";
import Gallery from "./pages/homeTwo/Gallery";
import Privacy from "./pages/homeTwo/privacy";
import SearchNews from "./pages/homeTwo/searchNews";
const router = createBrowserRouter([
  // {
  //   path: "/",
  //   Component: LayoutTheme1,
  //   children: [
  //     {
  //       index: true,
  //       element: <Home />,
  //     },
  //     {
  //       path: "/category/:categoryId",
  //       element: <Category />,
  //     },

  //     {
  //       path: "/trending",
  //       element: <Trending />,
  //     },
  //     {
  //       path: "/subscriber",
  //       element: <Subscriber />,
  //     },
  //     {
  //       path: "/sports",
  //       element: <Sports />,
  //     },
  //     {
  //       path: "/about",
  //       element: <About />,
  //     },
  //     {
  //       path: "/archive",
  //       element: <Archive />,
  //     },
  //     {
  //       path: "/contact",
  //       element: <Contact />,
  //     },
  //     {
  //       path: "/404",
  //       element: <Error />,
  //     },
  //     // {
  //     //   path: "/post1",
  //     //   element: <Post1 />,
  //     // },
  //     // {
  //     //   path: "/news/:slug",
  //     //   element: <Post1 />,
  //     // },

  //     {
  //       path: "/:categorySlug/:slug",
  //       element: <Post1 />,
  //     },
  //     {
  //       path: "/post2",
  //       element: <Post2 />,
  //     },
  //     {
  //       path: "/post3",
  //       element: <Post3 />,
  //     },
  //     {
  //       path: "/video_post1",
  //       element: <VideoPost1 />,
  //     },
  //     {
  //       path: "/video_post2",
  //       element: <VideoPost2 />,
  //     },
  //     {
  //       path: "/video_post3",
  //       element: <VideoPost3 />,
  //     },
  //     {
  //       path: "/audio_post1",
  //       element: <AudioPost1 />,
  //     },
  //     {
  //       path: "/audio_post2",
  //       element: <AudioPost2 />,
  //     },
  //     {
  //       path: "/audio_post3",
  //       element: <AudioPost3 />,
  //     },
  //     {
  //       path: "/left_post2",
  //       element: <LeftPost2 />,
  //     },
  //   ],
  // },
  {
    path: "/",
    Component: LayoutTheme2,
    children: [
      {
        index: true,
        element: <HomeTwo />,
      },
      {
        path: "category/:categoryId",
        element: <Category />,
      },
      { path: "/login", element: <SubscriberLogin /> },
      { path: "/register", element: <SubscriberRegister /> },
      { path: "/search", element: <SearchNews /> },
      { path: "/epaper", element: <Epaper /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/epaper/read/:id", element: <EpaperReader /> },
      {
        path: "business",
        element: <HomeTwoBusiness />,
      },
      {
        path: "entertainment",
        element: <HomeTwoEntertainment />,
      },
      {
        path: "features",
        element: <HomeTwoFeature />,
      },
      {
        path: "trending",
        element: <HomeTwoTrending />,
      },
      {
        path: "sports",
        element: <HomeTwoSports />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "archive",
        element: <HomeTwoArchive />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      // {
      //   path: "post1",
      //   element: <HomeTwoPost1 />,
      // },

      {
        path: "/:categorySlug/:slug",
        element: <Post1 />,
      },
      {
        path: "post2",
        element: <HomeTwoPost2 />,
      },
      {
        path: "post3",
        element: <HomeTwoPost3 />,
      },
      {
        path: "video_post1",
        element: <HomeTwoVideoPost1 />,
      },
      {
        path: "video_post2",
        element: <HomeTwoVideoPost2 />,
      },
      {
        path: "video_post3",
        element: <HomeTwoVideoPost3 />,
      },
      {
        path: "audio_post1",
        element: <HomeTwoAudioPost1 />,
      },
      {
        path: "audio_post2",
        element: <HomeTwoAudioPost2 />,
      },
      {
        path: "audio_post3",
        element: <HomeTwoAudioPost3 />,
      },
      {
        path: "left_post2",
        element: <HomeTwoLeftPost2 />,
      },
    ],
  },
  // {
  //   path: "/",
  //   Component: LayoutTheme3,
  //   children: [
  //     {
  //       index: true,
  //       element: <HomeThree />,
  //     },
  //     {
  //       path: "business",
  //       element: <HomeThreeBusiness />,
  //     },
  //     {
  //       path: "entertainment",
  //       element: <HomeThreeEntertainment />,
  //     },
  //     {
  //       path: "features",
  //       element: <HomeThreeFeature />,
  //     },
  //     {
  //       path: "trending",
  //       element: <HomeThreeTrending />,
  //     },
  //     {
  //       path: "sports",
  //       element: <HomeThreeSports />,
  //     },
  //     {
  //       path: "about",
  //       element: <HomeThreeAbout />,
  //     },
  //     {
  //       path: "archive",
  //       element: <HomeThreeArchive />,
  //     },
  //     {
  //       path: "contact",
  //       element: <HomeThreeContact />,
  //     },
  //     {
  //       path: "404",
  //       element: <HomeThreeError />,
  //     },
  //     {
  //       path: "post1",
  //       element: <HomeThreePost1 />,
  //     },
  //     {
  //       path: "post2",
  //       element: <HomeThreePost2 />,
  //     },
  //     {
  //       path: "post3",
  //       element: <HomeThreePost3 />,
  //     },
  //     {
  //       path: "video_post1",
  //       element: <HomeThreeVideoPost1 />,
  //     },
  //     {
  //       path: "video_post2",
  //       element: <HomeThreeVideoPost2 />,
  //     },
  //     {
  //       path: "video_post3",
  //       element: <HomeThreeVideoPost3 />,
  //     },
  //     {
  //       path: "audio_post1",
  //       element: <HomeThreeAudioPost1 />,
  //     },
  //     {
  //       path: "audio_post2",
  //       element: <HomeThreeAudioPost2 />,
  //     },
  //     {
  //       path: "audio_post3",
  //       element: <HomeThreeAudioPost3 />,
  //     },
  //     {
  //       path: "left_post2",
  //       element: <HomeThreeLeftPost2 />,
  //     },
  //   ],
  // },
  // {
  //   path: "/",
  //   Component: LayoutThemeDark1,
  //   children: [
  //     {
  //       index: true,
  //       element: <HomeDark />,
  //     },
  //     {
  //       path: "business",
  //       element: <HomeDarkBusiness />,
  //     },
  //     {
  //       path: "entertainment",
  //       element: <HomeDarkEntertainment />,
  //     },
  //     {
  //       path: "features",
  //       element: <HomeDarkFeature />,
  //     },
  //     {
  //       path: "trending",
  //       element: <HomeDarkTrending />,
  //     },
  //     {
  //       path: "sports",
  //       element: <HomeDarkSports />,
  //     },
  //     {
  //       path: "about",
  //       element: <HomeDarkAbout />,
  //     },
  //     {
  //       path: "archive",
  //       element: <HomeDarkArchive />,
  //     },
  //     {
  //       path: "contact",
  //       element: <HomeDarkContact />,
  //     },
  //     {
  //       path: "404",
  //       element: <HomeDarkError />,
  //     },
  //     {
  //       path: "post1",
  //       element: <HomeDarkPost1 />,
  //     },
  //     {
  //       path: "post2",
  //       element: <HomeDarkPost2 />,
  //     },
  //     {
  //       path: "post3",
  //       element: <HomeDarkPost3 />,
  //     },
  //     {
  //       path: "video_post1",
  //       element: <HomeDarkVideoPost1 />,
  //     },
  //     {
  //       path: "video_post2",
  //       element: <HomeDarkVideoPost2 />,
  //     },
  //     {
  //       path: "video_post3",
  //       element: <HomeDarkVideoPost3 />,
  //     },
  //     {
  //       path: "audio_post1",
  //       element: <HomeDarkAudioPost1 />,
  //     },
  //     {
  //       path: "audio_post2",
  //       element: <HomeDarkAudioPost2 />,
  //     },
  //     {
  //       path: "audio_post3",
  //       element: <HomeDarkAudioPost3 />,
  //     },
  //     {
  //       path: "left_post2",
  //       element: <HomeDarkLeftPost2 />,
  //     },
  //   ],
  // },
  // {
  //   path: "*",
  //   element: <Error />,
  // },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
