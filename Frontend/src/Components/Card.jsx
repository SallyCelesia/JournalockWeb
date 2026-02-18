
const Card = ({cardText,width,height,bgColor,onClick}) => {
  
  return (
    <div className="card" style={{backgroundColor:bgColor, width:width, height:height}} onClick={onClick}>
      <h3>{cardText}</h3>
    </div>
  )
}

export default Card