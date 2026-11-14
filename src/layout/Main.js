import React from "react";
import MovieList from "../components/MovieList";
import Preloader from "../components/Preloader";
import Search from "../components/Search";
import './Main.css';
 
class Main extends React.Component {
    state = {
        movies: [],
        loading: true,
        count: 0
    }
 
    componentDidMount() {
        fetch("https://www.omdbapi.com/?apikey=4eb9d7fd&s=matrix")
            .then(response => response.json())
            .then(data => this.setState({ 
                movies: data.Search || [], 
                loading: false, 
                count: data.totalResults || 0 
            }))
            .catch((err) => {
                console.error(err);
                this.setState({ loading: false });
            })
    }
 
    serchMovie = (str = "matrix", type = "all", page = 1) => {
        if (str.trim() === "") str = "matrix"; 
        this.setState({ loading: true });

        // Кодируем пробелы и символы, чтобы ссылка не ломалась
        const encodedStr = encodeURIComponent(str);
        
        fetch(`https://www.omdbapi.com/?apikey=4eb9d7fd&s=${encodedStr}${type !== "all" ? `&type=${type}` : ''}&page=${page}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ 
                    movies: data.Search || [], 
                    loading: false, 
                    // Если результаты есть - обновляем счетчик. Если нет - оставляем старый.
                    count: data.totalResults ? data.totalResults : this.state.count 
                })
            })
            .catch((err) => {
                console.error(err);
                this.setState({ loading: false });
            })
    }
 
    render() {
        const { movies, loading, count } = this.state;
 
        return (
            <div className="main">
                <div className="wrap">
                    <Search serchMovie={this.serchMovie} totalCount={count} />
                    {
                        loading ? <Preloader /> : (movies.length ? <MovieList movies={movies} /> : <h4>По вашему запросу ничего не найдено</h4>)
                    }
                </div>
            </div>
        )
    }
}
 
export default Main;