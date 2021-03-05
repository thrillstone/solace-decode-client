import React, { useState, useEffect } from 'react';
import './Summary.css'

function Summary(props) {
  const info = {category: "Hobbies", unread: 80, mentions: 0, topics: [{topic: "cats", confidence: 90}, {topic: "cute", confidence: 80}], summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
  const [style, setStyle] = useState({})
  
  useEffect(() => {
    if (info.category == "Social") {
        setStyle({backgroundImage: 'linear-gradient(#ff83c5, #ffc584)'})
    } else if (info.category == "Hobbies") {
        setStyle({backgroundImage: 'linear-gradient(#008ac6, #01b696)'})
    } else {
        setStyle({backgroundImage: 'linear-gradient(#7663d7, #8492f8)'})
    }
  }, []);

  return (
    <div className="summary">
        <div className="gradient" style={style}>
        </div>
        <div className="dataDiv">
            <h4 className="category">{info.category}</h4>
            <div>
                <p><p className="bolded">{info.unread}</p> unread messages</p>
            </div>
            <div>
                <p><p className="bolded">{info.mentions}</p> mentions</p>
            </div>
            <h4 className="maintopics">Main Topics</h4>
            {info.topics.map((topic) =>  
                <p>"{topic.topic}"  <p className="confidence">{topic.confidence}</p>% confidence</p>
            )}
            <p>{info.summary}</p>
        </div>
    </div>
  );
}

export default Summary;