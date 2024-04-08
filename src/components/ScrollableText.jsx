import React from 'react';

const ScrollableText = ({ text }) => {
    return (
        <div style={{ overflowY: 'scroll', maxHeight: '400px', padding: '10px', border: '1px solid #ccc' }}>
            {text}
        </div>
    );
};

export default ScrollableText;
