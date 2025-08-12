import React from 'react';

const Home = () => (
    <div className="home"
        style={{
            backgroundImage: "url('/images/image.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            width : '80vw'
             padding: '2rem',  
            color: 'white',
            
        }}>
        <h1>Welcome to Neelu Beauty Parlour</h1>
        <h1>Your one-stop destination for makeup services and beauty training programs.</h1>

    </div>
);

export default Home;
