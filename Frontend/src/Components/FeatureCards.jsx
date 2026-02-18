
const FeatureCards = ({icon,h3,p}) => {
    const styles = {
        width:"250px", height:"350px"
    }
  return (
    <div className="featuresCards" style={styles}>
        <div className="iconbg">{icon}</div>
        <h3>{h3}</h3>
        <p>{p}</p>
    </div>
  )
}

export default FeatureCards