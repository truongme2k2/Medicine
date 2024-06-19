import React, { useState } from 'react';
import Categories from '../Categories/Categories';
import NavigationBar from '../NavigationBar/NavigationBar';
import './Home.css';
import Products from '../Products/Products';
import SearchResult from '../SearchResult/SearchResult'; // Import SearchResult component
import { min } from 'date-fns';

function Home() {
    const [categoryId, setCategoryId] = useState(null);
    const [typeId, setTypeId] = useState(null);
    const [searchResult, setSearchResult] = useState(null); 
    const [minPrice, setMinPrice] = useState(null)
    const [maxPrice, setMaxPrice] = useState(null)

    const handleCategoryClick = (category_id) => {
        setCategoryId(category_id);
    };

    const handleTypeClick = (TypeId) => {
        setTypeId(TypeId);
    };

    const handlePriceRangeClick = (priceRange) => {
        if (priceRange =='under_100000'){
            setMinPrice(1)
            setMaxPrice(100000)
        }
        if (priceRange =='100000_to_300000'){
            setMinPrice(100000)
            setMaxPrice(300000)
        }
        if (priceRange =='300000_to_500000'){
            setMinPrice(300000)
            setMaxPrice(500000)
        }
        if (priceRange =='over_500000'){
            setMinPrice(500000)
            setMaxPrice(5000000)
        }

    };  

    return (
        <div style={{backgroundColor: "var(--color-gray)"}}>
            <NavigationBar handleSearchResult={setSearchResult} /> 
            <div className="container">
                <div className="row" style={{margin:"20px 0px"}}>
                    <div className="col-md-3 fillter-product" style={{paddingTop:"10px"}}>
                        <Categories onCategoryClick={handleCategoryClick} onTypeClick={handleTypeClick} onPriceRangeClick={handlePriceRangeClick} />
                    </div>
                    <div className="col-md-9 list-all-product">
                        {searchResult ? (
                            <SearchResult searchResult={searchResult} />
                        ) : (
                            <Products categoryId={categoryId} typeId={typeId} minPrice={minPrice} maxPrice={maxPrice}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
