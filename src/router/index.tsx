import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import MainTemplate from "../templates/MainTemplate";
import ReceiptPage from "../pages/ReceiptPage";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <MainTemplate></MainTemplate>,
            children: [
                {
                    path: "/",
                    element: <LandingPage></LandingPage>
                },
                {
                    path: "/receipt/:receipt_id",
                    element: <ReceiptPage></ReceiptPage>
                }
            ]
        }
    ],
    { basename: "/" }
)

export default router