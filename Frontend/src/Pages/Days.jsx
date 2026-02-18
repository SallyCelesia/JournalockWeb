import { useNavigate, useParams } from 'react-router-dom'

import Header from '../Components/Header.jsx'
import Card from '../Components/Card.jsx'

const Days = () => {
  const navigate = useNavigate();
  const { year, month } = useParams();
  
  const getDaysInMonth = (month, year) => {
    const monthIndex = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(month);
    return new Date(year, monthIndex + 1, 0).getDate();
  };
  
  const daysCount = getDaysInMonth(month, year);
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);
  
  return (
    <>
      <Header/>
      <h2 id="daysHeading">{month} - {year}</h2>
      <div className="dayCards">
        {days.map((day, i) => (
          <Card 
            key={i} 
            cardText={day} 
            width={"90px"} 
            height={"90px"} 
            bgColor={"#7e61a3"} 
            onClick={() => navigate(`/journalentry/${year}/${month}/${day}`)}
          />
        ))}
      </div>
    </>
  )
}

export default Days