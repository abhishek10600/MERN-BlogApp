import "./App.css";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Components/Home";
import CreatePostPage from "./Components/CreatePostPage";
import PostPage from "./Components/PostPage";
import EditPost from "./Components/EditPost";
import { UserContextProvider } from "./Contexts/UserContext";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/create" element={<CreatePostPage />} />
          <Route exact path="/post/:id" element={<PostPage />} />
          <Route exact path="/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
