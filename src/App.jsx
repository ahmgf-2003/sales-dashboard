import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Auth from "./contexts/Auth";
import "./App.css";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/" element={<Layout />} >
                    <Route index element={<Dashboard />} />
                </Route>
                <Route path="signin" element={<Signin />} />
            </>
        )
    )

    return (
        <Auth>
            <RouterProvider router={router} />
        </Auth>
)
}

export default App;
