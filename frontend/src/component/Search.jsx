import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Search = () => {
    const [keyword, setKeyword] = useState("")
    const navigate = useNavigate();
    const location = useLocation();
    const searchHandler = (e) => {
        e.preventDefault()
        navigate(`/search/${keyword}`)
    }

    const resetSearch = () => {
        setKeyword("");
    }
  
    useEffect(() => {
        if(location.pathname == '/') {
            resetSearch();
        }
    },[location.pathname])
    return (
        <form onSubmit={searchHandler}>
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                    onChange={(e) => setKeyword(e.target.value)}
                    value={keyword}
                />
                <div className="input-group-append">
                    <button id="search_btn" className="btn">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </form>

    )
}

export default Search;
