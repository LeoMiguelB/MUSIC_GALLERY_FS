import { useEffect, useState } from "react";
import "./filter.css"

import { useDispatch, useSelector } from "react-redux";

import { changeActiveFilter } from "./playerSlice";

const Filter = () => {

    const dispatch = useDispatch();

    // make this global so that we can filter in the main instead within the filter
    // const [activeFilter, setActiveFilter] = useState("all");

    const activeFilter = useSelector(state => state.player.activeFilter);

    return (
        <div className="filter-container">
            <button className={activeFilter === "all" ? "active" : ""} onClick={() => dispatch(changeActiveFilter("all"))}>All</button>
            <button className={activeFilter === "loop" ? "active" : ""} onClick={() => dispatch(changeActiveFilter("loop"))}>Loop</button>
            <button className={activeFilter === "midi" ? "active" : ""} onClick={() => dispatch(changeActiveFilter("midi"))}>Midi</button>
        </div>
    )
}

export default Filter;