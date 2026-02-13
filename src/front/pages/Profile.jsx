import { useEffect, useState } from "react"
import { getAvatar, userCheck } from "../services/backendServices"
import { useNavigate, Link } from "react-router-dom"

export const Profile = () => {

    const [user, setUser] = useState()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [notUsername, setNotUsername] = useState(false)
    const [avatar, setAvatar] = useState()

    const getProfile = async () => {
        const response = await userCheck()

        if (!response) {
            navigate('/')
            return
        }

        const hashUsername = response?.username
        if (!hashUsername) {
            setNotUsername(true)
        }

        setUser(response)
        setLoading(false)
    }

    const getAvatarProfile = async () => {
        const response = await getAvatar()
        setAvatar(response)
        return
    }



    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
        getProfile()
        getAvatarProfile()
    }, [])

    return (
        <>
            {loading ? (
                <span className="d-flex aling-item-center justify-content-center vh-100">
                    <span className="p-2"> Loading...</span>
                    <span className="spinner-border p-2 flex-shrink-1" role="status"></span>
                </span>
            ) : (
                <div className="container">
                    {notUsername && (
                        <div className="alert alert-warning text-center" role="alert">
                            Please complete your profile
                        </div>)}
                    <div className="d-flex justify-content-center align-items-center vh-100">
                        <div className="card shadow" style={{ width: "18rem" }}>
                            <img src={avatar} alt="" />
                            <div className="card-body text-center">
                                <h5 className="card-title">{user.username}</h5>
                                <p className="card-text">Email: {user.email}</p>
                                <div className="d-flex justify-content-center gap-2">
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
                                    >
                                        Logout
                                    </button>
                                    <Link to={"/admin"}>
                                        <button className="btn btn-primary">Profile</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </>
    )
}