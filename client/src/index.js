// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );



import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FakeStackOverflow from './components/fakestackoverflow.js';

ReactDOM.render(
    <FakeStackOverflow />,
    document.getElementById('root')
);
