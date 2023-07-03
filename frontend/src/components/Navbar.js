import { Link } from "react-router-dom"
import { useLogout } from "../hooks/useLogout"

const Navbar = () => {
    const { logout } = useLogout();

    const handleClick = () => {
        logout();
    }

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>GroListy</h1>
                </Link>
                <nav>
                    <div>
                        <button onClick={handleClick}>Log out</button>
                    </div>
                    <div>
                        <Link to="/login">Log in</Link>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar;