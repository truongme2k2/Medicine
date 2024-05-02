import React,  { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar'; // Đường dẫn tới file NavigationBar.js
import Categories from './Categories'; // Đường dẫn tới file Categories.js
import Products from './Products'; // Đường dẫn tới file Products.js

function Home() {
    const [categoryId, setCategoryId] = useState(null);

    const handleCategoryClick = (category_id) => {
        // Cập nhật category_id khi người dùng nhấp vào một danh mục
        setCategoryId(category_id);
    };

    return (
        <div>
            <NavigationBar />
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <Categories onCategoryClick={handleCategoryClick}/>
                    </div>
                    <div className="col-md-9">
                        <Products categoryId={categoryId}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
