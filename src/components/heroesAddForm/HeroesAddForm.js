import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useHttp } from "../../hooks/http.hook";
import { heroCreate } from "../../components/heroesList/heroesSlice";
import { selectAll } from "../heroesFilters/filtersSlice";
import store from "../../store";

const HeroesAddForm = () => {
    const {filtersLoadingStatus} = useSelector(state => state.filters)
    const filters = selectAll(store.getState())
    const [heroName, setHeroName] = useState('')
    const [heroDesr, setHeroDesr] = useState('')
    const [heroElem, setHeroElem] = useState('')

    const dispatch = useDispatch()
    const {request} = useHttp()

    const onSubmitHero = (e) => {
        e.preventDefault()

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDesr,
            element: heroElem
        }

        request("http://localhost:3001/heroes", 'POST', JSON.stringify(newHero))
            .then(dispatch(heroCreate(newHero)))
            .catch(err => console.log(err))

        setHeroName('')
        setHeroDesr('')
        setHeroElem('')
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                if (name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHero}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    value={heroDesr}
                    onChange={(e) => setHeroDesr(e.target.value)}
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    onChange={(e) => setHeroElem(e.target.value)}
                    value={heroElem}
                    name="element">
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;