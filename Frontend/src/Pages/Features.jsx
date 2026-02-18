import { FaKey, FaLock } from "react-icons/fa";
import { FaMobileScreen } from "react-icons/fa6";

import Header from '../Components/Header.jsx'
import FeatureCards from '../Components/FeatureCards.jsx'

const Features = () => {
  const featureContents = [
    {icon:<FaMobileScreen/>, h3:"Seamless Cross-Device Access", p:"Access your journal anytime, anywhere through browsers"},
    {icon:<FaLock/>, h3:"Secure Encryption with Personal Passkey", p:"Protect your entries by saving it with your own secret passkey"},
    {icon:<FaKey />, h3:"Private Decryption Anytime", p:"Unlock and read your journal entries using your secret passkey"}
  ]

  return (
    <>
      <Header showJournal={true}/>
      <h2 id="featureHeading">Features</h2>
      <div id="features">
        {featureContents.map((eachFeature, i)=>(<FeatureCards key={i} icon={eachFeature.icon} h3={eachFeature.h3} p={eachFeature.p}/>))}
      </div>
    </>
  )
}

export default Features