import React from 'react';
import Header from '../components/Header';
import Steps from '../components/Steps';
import Description from '../components/Description';
import ImageGenerator from '../components/ImageGenerator';

const Home = () => {
  return (
    <div>
      <Header />
      <ImageGenerator />
      <Steps />
      <Description />
      
    </div>
  );
};

export default Home;
