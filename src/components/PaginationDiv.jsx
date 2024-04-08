import React, { useState } from 'react';
import './Pagination.css'; // Import the CSS file

const PaginationDiv = ({ itemsPerPage, data }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Convert object to an array of key-value pairs
    const dataArray = data ? Object.entries(data) : [];

    // Calculate total number of pages
    const totalPages = Math.ceil(dataArray.length / itemsPerPage);

    // Calculate index of the first and last items on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Get the current page's data
    const currentItems = dataArray.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const firstPage = () => {
        setCurrentPage(1);
    };

    const lastPage = () => {
        setCurrentPage(totalPages);
    };

    // Function to handle clicking on a page number
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate array of page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = currentPage - Math.floor(maxVisiblePages / 2);
        if (startPage < 1) {
            startPage = 1;
        }
        let endPage = startPage + maxVisiblePages - 1;
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = endPage - maxVisiblePages + 1;
            if (startPage < 1) {
                startPage = 1;
            }
        }
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="pagination-div">
            {/* Conditionally render table headers if data is present */}
            {dataArray.length > 0 && (
                <table>
                    <thead>
                    <tr>
                        <th>Word</th>
                        <th>Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Render items of the current page */}
                    {currentItems.map(([key, value], index) => (
                        <tr key={index}>
                            <td>{key}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Pagination controls */}
            <div className="pagination-controls">
                <button onClick={firstPage} disabled={currentPage === 1}>1</button>
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                {getPageNumbers().map((pageNumber) => (
                    <button key={pageNumber} onClick={() => handlePageClick(pageNumber)} className={pageNumber === currentPage ? 'active' : ''}>{pageNumber}</button>
                ))}
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                <button onClick={lastPage} disabled={currentPage === totalPages}>{totalPages}</button>
            </div>
        </div>
    );
};

export default PaginationDiv;
