import { ThemeProvider } from "@/ThemeProvider";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { HashRouter, Routes, Route } from "react-router-dom";
import BlogPost from "./views/BlogPost";
import BlogList from "./views/BlogList";
import WorkSpace from "./views/WorkSpace";

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="jackw-ui-theme">
            <HashRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<BlogList />} />
                        <Route path="/post/:id" element={<BlogPost />} />
                        <Route path="/workspace" element={<WorkSpace />} />
                    </Routes>
                </Layout>
                <Toaster />
            </HashRouter>
        </ThemeProvider>
    );
}

export default App;
