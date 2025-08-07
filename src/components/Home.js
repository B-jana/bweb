import React from 'react';

const Home = () => (
    <div className="home"
        style={{
            backgroundImage: "url('/images/image.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',

            color: 'white',
            padding: '2rem',
        }}>
        <h1>Welcome to BeautifyMe</h1>
        <p>Your one-stop destination for makeup services and beauty training programs.</p>

    </div>
);

export default Home;
