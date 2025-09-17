import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import MainTemplate from "../templates/MainTemplate";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <MainTemplate></MainTemplate>,
            children: [
                {
                    path: "/",
                    element: <LandingPage></LandingPage>
                }
            ]
        }
    ],
    { basename: "/" }
)

export default router