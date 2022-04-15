import React from 'react';
import Particles from 'react-tsparticles';
import options from '../utils/particles-config';

const ParticlesComponent = () => {
  return (
    <div>
      <Particles
        id='tsparticles'
        height='100vh'
        width='100vw'
        options={options}
      />
    </div>
  );
};

export default ParticlesComponent;
