import { useNavigate, useParams} from 'react-router-dom'

import Header from '../Components/Header.jsx'
import Card from '../Components/Card.jsx'

const Month = () => {
  const navigate = useNavigate();
  const { year } = useParams();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  return (
    <>
      <Header/>
      <h2 id="monthHeading">Journal - {year}</h2>
      <div className="monthCards">
        {months.map((month, i) => (
          <Card 
              key={i}
              cardText={month} 
              width={"180px"} 
              height={"180px"} 
              bgColor={"#7e61a3"} 
              onClick={()=>navigate(`/${year}/${month}/daylist`)}
          />
        ))}
      </div>
    </>
  )
}

export default Month