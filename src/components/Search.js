import React from "react";
import "./Search.css";
 
class Search extends React.Component {
    state = {
        search: "",
        type: "all",
        page: 1
    }
 
    startSearch = () => {
        this.setState({ page: 1 }, () => {
            this.props.serchMovie(this.state.search, this.state.type, this.state.page);
        });
    }
 
    handleKey = (event) => {
        if (event.key === 'Enter') {
            this.startSearch();
        }
    }
 
    handlerFilter = (event) => {
        this.setState(
            { type: event.target.dataset.type, page: 1 },
            () => { this.props.serchMovie(this.state.search, this.state.type, this.state.page) }
        );
    }
 
    prevPage = () => {
        if (this.state.page > 1) {
            this.setState(
                (prevState) => ({ page: prevState.page - 1 }),
                () => { this.props.serchMovie(this.state.search, this.state.type, this.state.page) }
            )
        }
    }
 
    nextPage = () => {
        let limit = 10;
        let safeCount = parseInt((this.props.totalCount || "0").toString().replace(/,/g, ''), 10);
        let totalPage = Math.ceil(safeCount / limit) || 1;
        
        if (this.state.page < totalPage) {
            this.setState(
                (prevState) => ({ page: prevState.page + 1 }),
                () => { this.props.serchMovie(this.state.search, this.state.type, this.state.page) }
            )
        }
    }

    // Обработчик клика по конкретной цифре
    goToPage = (pageNumber) => {
        this.setState(
            { page: pageNumber },
            () => { this.props.serchMovie(this.state.search, this.state.type, this.state.page) }
        )
    }
 
    render() {
        let limit = 10;
        let safeCount = parseInt((this.props.totalCount || "0").toString().replace(/,/g, ''), 10);
        let totalPage = Math.ceil(safeCount / limit) || 1;
    
        // Формируем массив цифр (показываем окно из 10 ближайших страниц, чтобы не ломать верстку)
        let num = [];
        let startPage = Math.max(1, this.state.page - 4);
        let endPage = Math.min(totalPage, startPage + 9);
        
        if (endPage - startPage < 9) {
            startPage = Math.max(1, endPage - 9);
        }

        for (let i = startPage; i <= endPage; i++) {
            num.push(i);
        }
    
        return (
            <>
                <div className="search">
                    <input
                        type="search"
                        placeholder="search"
                        value={this.state.search}
                        onChange={(e) => this.setState({ search: e.target.value })}
                        onKeyDown={this.handleKey}
                    />
                    <button className="btn" onClick={this.startSearch}>Search</button>
                </div>
                
                <div className="radio">
                    <label htmlFor="all">
                        <input type="radio" name="type" id="all" data-type="all" checked={this.state.type === "all"} onChange={this.handlerFilter} /> All
                    </label>
                    <label htmlFor="movie">
                        <input type="radio" name="type" id="movie" data-type="movie" checked={this.state.type === "movie"} onChange={this.handlerFilter} /> Movies only
                    </label>
                    <label htmlFor="series">
                        <input type="radio" name="type" id="series" data-type="series" checked={this.state.type === "series"} onChange={this.handlerFilter} /> Series only
                    </label>
                    <label htmlFor="game">
                        <input type="radio" name="type" id="game" data-type="game" checked={this.state.type === "game"} onChange={this.handlerFilter} /> Games only
                    </label>
                </div>
                
                {totalPage > 1 && (
                    <div className="navigation">
                        <button 
                            className="btn" 
                            onClick={this.prevPage} 
                            disabled={this.state.page === 1}
                            style={{opacity: this.state.page === 1 ? ".5" : "1"}}
                        >Prev</button>
 
                        <div className="items" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                            {num.map((el) => (
                                <button 
                                    className="btn" 
                                    key={el} 
                                    onClick={() => this.goToPage(el)}
                                    // Визуально выделяем ту страницу, на которой находимся сейчас
                                    style={{ 
                                        opacity: this.state.page === el ? "0.5" : "1",
                                        cursor: this.state.page === el ? "default" : "pointer"
                                    }}
                                >
                                    {el}
                                </button>
                            ))}
                        </div>
 
                        <button 
                            className="btn" 
                            onClick={this.nextPage}
                            disabled={this.state.page === totalPage}
                            style={{opacity: this.state.page === totalPage ? ".5" : "1"}}
                        >Next</button>
                    </div>
                )}
            </>
        )
    }
}
 
export default Search;