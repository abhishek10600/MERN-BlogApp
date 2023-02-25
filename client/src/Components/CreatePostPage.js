import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "./Editor";

const CreatePostPage = () => {
  const [title, setTiltle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const createNewPost = async (ev) => {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    console.log(files);
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  };
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div>
      <form onSubmit={createNewPost}>
        <input
          type="titile"
          placeholder={`Title`}
          value={title}
          onChange={(ev) => {
            return setTiltle(ev.target.value);
          }}
        />
        <input
          type="summary"
          placeholder={`Summary`}
          value={summary}
          onChange={(ev) => {
            return setSummary(ev.target.value);
          }}
        />
        <input
          type="file"
          onChange={(ev) => {
            return setFiles(ev.target.files);
          }}
        />
        <Editor value={content} onChange={setContent}/>
        <button style={{ marginTop: "5px" }}>Create Post</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
