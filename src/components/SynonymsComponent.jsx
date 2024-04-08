import React, { useState } from 'react';
import PaginationDiv from "./PaginationDiv";
import './Synonym.css'
const SynonymsComponent = ({ data }) => {
    const [selectedWord, setSelectedWord] = useState(null);
    const wordsData = Object.entries(data);
    console.log(data);
    return(
        <div>
            {wordsData.map(([key, value], index) => (
                <div className="synonym-button"  onClick={() => {
                    if(selectedWord === key){
                        setSelectedWord(null);
                    } else {setSelectedWord(key)}
                }}>
                    {`${key} ${data[key]?.count}`}
                </div>
            ))}
            <div>
                {selectedWord ?  <PaginationDiv itemsPerPage={10} data={data[selectedWord]?.synonyms}/> : null}
            </div>
        </div>

    )
}

export default SynonymsComponent;