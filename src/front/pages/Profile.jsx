import { useEffect, useState } from "react"
import { userCheck } from "../services/backendServices"
import { useNavigate } from "react-router-dom"

export const Profile = () => {

    const [user, setUser] = useState()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const getProfile = async () => {
        const response = await userCheck()

        if (!response) {
            navigate('/')
            return
        }
        setUser(response)
        setLoading(false)
    }

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
        getProfile()
    }, [])

    return (
        <>
            {loading ? (
                <span className="d-flex aling-item-center justify-content-center">
                    <span className="p-2"> Loading...</span>
                    <span className="spinner-border p-2 flex-shrink-1" role="status"></span>
                </span>
            ) : (
                <div className="container mt-5 d-flex justify-content-center">
                    <div className="card shadow" style={{ width: "18rem" }}>
                        <div className="card-body text-center">
                            <h5 className="card-title">{user.user_name}</h5>
                            <p className="card-text">Email: {user.email}</p>
                            <button
                                className="btn btn-danger"
                                onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </>
    )
}