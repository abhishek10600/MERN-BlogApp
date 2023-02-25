import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../Contexts/UserContext';

const PostPage = () => {
    const [postInfo,setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const {id} = useParams();
    useEffect(()=>{
        fetch(`http://localhost:4000/post/${id}`)
        .then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo);
            });
        })
    },[]);
    if(!postInfo){
        return "";

    }
  return (
    <div>
      <img src={`http://localhost:4000/${postInfo.coverImg}`} alt="" />
      <h1>{postInfo.title}</h1>
      {userInfo.id === postInfo.author._id && (
        <div>
            <Link to={`/edit/${postInfo._id}`}>Edit Post</Link>
        </div>
      )};
      <div dangerouslySetInnerHTML={{__html:postInfo.content}}>
      </div>
    </div>
  )
}

export default PostPage
