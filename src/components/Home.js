import React from 'react';

const Home = () => (
    <div className="home"
        style={{
            backgroundImage: "url('/images/image.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
      color: 'white',
      padding: '2rem',
      boxSizing: 'border-box',
        }}>
        <h1>Welcome to BeautifyMe</h1>
        <p>Your one-stop destination for makeup services and beauty training programs.</p>

    </div>
);

export default Home;
