import React from 'react';
import Header from './components/Header';
import Viewer from './components/Viewer';

const App: React.FC = () => {
  return (
    <div>
      <Header></Header>
      <Viewer></Viewer>
    </div>
  );
};

export default App;

