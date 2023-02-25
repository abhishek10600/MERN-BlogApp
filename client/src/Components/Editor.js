import React from 'react'
import ReactQuill from "react-quill";



const Editor = ({value,onChange}) => {
    const modules = {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { indent: "" }],
          ["link", "image"],
          ["clean"],
        ],
      };
      const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
      ];
    
  return (
    <ReactQuill
              value={value}
              theme={'snow'}
              onChange={onChange}
              modules={modules}
              formats={formats}
            />
  )
}

export default Editor
