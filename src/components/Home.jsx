import { useState } from "react"


export default function Home() {
    const [nbRegistered, setNbRegistered] = useState(0)

    return (
        <div>
            <p>Welcome to the Ynov tests app!</p>

            <Link to="/Ynov-tests-2/register">Go to registration form</Link>
        </div>
    )
}