import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus } from "react-icons/fa"

import Header from '../Components/Header.jsx'
import Button from '../Components/Button.jsx'
import Card from '../Components/Card.jsx'

const Home = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [journals, setJournals] = useState([
    { year: 2026, id: 'journal_2026' }
  ]);

  const handleGetStartedBtn = () => {
    setShowDialog(true);
  };

  const handleSelectJournal = (year) => {
    navigate(`/${year}/monthlist`); 
    setShowDialog(false);
  };

  const handleAddNewYear = () => {
    const lastYear = journals[journals.length - 1].year;
    const newYear = lastYear + 1;
    setJournals([...journals, { year: newYear, id: `journal_${newYear}` }]);
  };

  return (
    <>
      <Header/>
      <div className='homeContents'>
        <main className='introduction'>
          <h1>Built for reflection. Designed for privacy</h1>
          <p>
            Store your all journal entries safely<br/>
            by encrypting in this simple and secured journaling space
          </p>
        </main>
        <Button text={'Get Started'} onClick={handleGetStartedBtn}/>
      </div>

      {/* Dialog Box for year selection*/}
      {showDialog && (
        <div className="dialogOverlay">
          <div className="dialogBox">
            <h2 id="dialogHeading">Select or Create Journal</h2>
            <div className="journalCards">
              {journals.map((journal, i) => (
                <Card 
                  key={i} 
                  cardText={journal.year} 
                  width={"100px"} 
                  height={"100px"} 
                  bgColor={"pink"}
                  onClick={() => handleSelectJournal(journal.year)}
                />
              ))}
              <Card 
                cardText={<FaPlus />} 
                width={"100px"} 
                height={"100px"} 
                bgColor={"lightblue"}
                onClick={handleAddNewYear}
              />
            </div>
            <Button text="Close" onClick={() => setShowDialog(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default Home