import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { edit, userCheck } from "../services/backendServices"

export const AdminProfile = () => {

    const [user, setUser] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        avatar: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [changePassword, setChangePassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setUser(
            {
                ...user,
                [e.target.name]: e.target.value
            }
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (changePassword) {
            if (!user.password) {
                setError('Required password')
                return
            }
            if (user.password !== user.confirmPassword) {
                setError('Passwords dont match')
                return
            }
        }

        setLoading(true)
        const response = await edit(user)

        if (response.error) {
            setError(response.error)
            setLoading(false)
            return
        }
        navigate('/profile')
    }

    const generateSeed = () => {
        return Math.random().toString(5);
    }

    const handleRandomAvatar = () => {
        const newSeed = generateSeed();
        setUser({
            ...user,
            avatar: newSeed
        });
        return
    }

    const getProfile = async () => {
        setLoading(true)
        const response = await userCheck()
        if (response) {
            setUser({
                username: response.username,
                email: response.email,
                password: '',
                confirmPassword: '',
                avatar: response.avatar
            })
            setLoading(false)
            return
        }
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
                <span className="d-flex aling-item-center justify-content-center vh-100">
                    <span className="p-2"> Loading...</span>
                    <span className="spinner-border p-2 flex-shrink-1" role="status"></span>
                </span>
            ) : (
                <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
                    <div className="card col-12 col-md-8 col-lg-6 p-3 shadow-lg ">
                        <p className="text-center text-primary"><i className="fa-solid fa-user-pen fa-2xl"></i></p>
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email1"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    aria-describedby="emailHelp"
                                    disabled
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    disabled={!changePassword}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="confirmPassword"
                                    value={user.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    disabled={!changePassword}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary mb-3"
                                onClick={() => { setChangePassword(!changePassword) }}
                            >
                                Change Password
                            </button>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">User Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    value={user.username}
                                    onChange={handleChange}
                                    placeholder="Enter your User Name"
                                />
                            </div>
                                <div className="col-12 col-md-6 mx-auto d-block">
                                <img src={`https://api.dicebear.com/9.x/big-smile/svg?seed=${user.avatar}`} alt="" className="card-img" />
                                <button
                                    type="button"
                                    className="btn btn-primary w-100 mb-3"
                                    onClick={handleRandomAvatar}
                                >
                                    Change Avatar
                                </button>
                                </div>
                                
                            
                            <button
                                type="submit"
                                className="btn btn-success col-12 col-md-6 d-block mx-auto"
                                disabled={loading}>
                                {loading ? (
                                    <span className="d-flex aling-item-center">
                                        <span className="p-2 w-100"> Editing...</span>
                                        <span className="spinner-border p-2 flex-shrink-1" role="status"></span>
                                    </span>
                                ) : (
                                    "Confirm Change")
                                }
                            </button>
                        </form>
                    </div>
                </div >
            )}
        </>
    )
}

