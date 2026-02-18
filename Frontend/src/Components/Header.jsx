import { NavLink } from "react-router-dom"
import Button from "./Button"
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { IoDocumentLockOutline } from "react-icons/io5";
const Header = () => {
  return (
    <header>
      <h1>Journlock <i><IoDocumentLockOutline /></i></h1>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/features">Features</NavLink>
      </nav>
          
      <Button text={<FaMoon />} logo={true} />
    </header>
  )
}

export default Header