import React, { useState,useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { useParams,Navigate } from "react-router-dom";
import Editor from "./Editor";

const EditPost = () => {

    const {id} = useParams();

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState("");
    const [coverImg,setCoverImg] = useState("");
    const [redirect,setRedirect] = useState(false);

    useEffect(()=>{
        fetch(`http://localhost:4000/post/${id}`).then(response=>{
            response.json().then(postInfo=>{
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
                setCoverImg(postInfo.coverImg);
            })
        })
    },[])

    const editPost = async(ev)=>{
        ev.preventDefault();
        const data = new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('id',id);
        if(files?.[0])
        {
            data.set('file',files?.[0]);
        }
        const response = await fetch(`http://localhost:4000/post`,{
            method:'PUT',
            body:data, 
            credentials:"include",
        });
        if(response.ok)
        {
            setRedirect(true);
        }
        
    }
    if(redirect){
        return <Navigate to={'/post/'+id}/>
    }
    return (
        <div>
          <form onSubmit={editPost}>
            <input
              type="titile"
              placeholder={`Title`}
              value={title}
              onChange={(ev) => {
                return setTitle(ev.target.value);
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
            <Editor onChange={setContent} value={content}/>
            <button style={{ marginTop: "5px" }}>Update Post</button>
          </form>
        </div>
      );
}

export default EditPost
