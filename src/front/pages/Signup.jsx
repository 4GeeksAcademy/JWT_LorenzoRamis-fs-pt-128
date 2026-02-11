import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { signup } from "../services/backendServices"

export const Signup = () => {

	const [user, setUser] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		user_name: ''
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const navigate = useNavigate()

	const handelChange = (e) => {
		setUser(
			{
				...user,
				[e.target.name]: e.target.value
			}
		)
	}

	// console.log(user); 
	// diferencia entre acá y dentro del useEffect

	const handelSubmit = async (e) => {
		e.preventDefault()
		setError('')

		if (!user.email.trim() || !user.password) {
			setError('Required email and password')
			return
		}

		if (user.password !== user.confirmPassword) {
			setError('password dont match')
			return
		}
		setLoading(true)
		const response = await signup(user)

		if (response.error) {
			setError(response.error)
			setLoading(false)
			return
		}
		navigate('/')
	}

	useEffect(() => {

	}, [])

	return (
		<>
			<div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
				<div className="card col-12 col-md-8 col-lg-6 p-3 shadow-lg ">
					<form onSubmit={handelSubmit}>
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
								onChange={handelChange}
								aria-describedby="emailHelp"
								placeholder="Enter your email"
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
								onChange={handelChange}
								placeholder="Enter your password"
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
								onChange={handelChange}
								placeholder="Enter your password"
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="user_name" className="form-label">User Name</label>
							<input
								type="user_name"
								className="form-control"
								id="user_name"
								name="user_name"
								value={user.user_name}
								onChange={handelChange}
								placeholder="Enter your User Name"
							/>
						</div>
						<button
							type="submit"
							className="btn btn-primary col-12 col-md-6 d-block mx-auto"
							disabled={loading}>
							{loading ? (
								<span className="d-flex aling-item-center">
									<span className="p-2 w-100"> Creating...</span>
									<span className="spinner-border p-2 flex-shrink-1" role="status"></span>
								</span>
							) : (
								"Sign Up")
							}
						</button>
					</form>
				</div>
			</div >
		</>
	)
}