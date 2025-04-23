import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import classNames from 'classnames';
import { selectAll, fetchFilters, activeFilterChanged } from "./filtersSlice";
import { createSelector } from "@reduxjs/toolkit";
import store from "../../store";

import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
    const dispatch = useDispatch()
    const filters = selectAll(store.getState)
    const {filtersLoadingStatus, activeFilter} = useSelector(state => state.filters)

    useEffect(() => {
        dispatch(fetchFilters());
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>
    } else if (filtersLoadingStatus === "error") {
        return <option>Ошибка загрузки</option>
    }

    const renderFiltersList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }

        return arr.map(({name, label, className}) => {
            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            });

            return <button
                    key={name}
                    className={btnClass}
                    id={name}
                    onClick={() => dispatch(activeFilterChanged(name))}
                    >{label}</button>
        })
    }

    const element = renderFiltersList(filters)

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {element}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;