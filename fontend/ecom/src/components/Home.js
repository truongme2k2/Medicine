import React from 'react';
import NavigationBar from './NavigationBar'; // Đường dẫn tới file NavigationBar.js
import Categories from './Categories'; // Đường dẫn tới file Categories.js
import Products from './Products'; // Đường dẫn tới file Products.js

function Home() {
    return (
        <div>
            <NavigationBar />
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <Categories />
                    </div>
                    <div className="col-md-9">
                        <Products />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
