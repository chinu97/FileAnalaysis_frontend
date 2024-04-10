import React from 'react';
import './ScrollableText.css'; // Import the CSS file

const ScrollableText = ({ text }) => {
    return (
        <div className="scrollable-text-container">
            {text}
        </div>
    );
};

export default ScrollableText;
