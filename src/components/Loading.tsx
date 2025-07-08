import React from 'react';
import './loading.css'; // ✅ adjust the path if needed
const Loading = () => {
  return (
    <div className='dots-container'>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
    </div>
  );
};

export default Loading;
