import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/backendServices.js";

export const Home = () => {

	const navigate = useNavigate()
	const [user, setUser] = useState({
		email: '',
		password: ''
	})
	const [loading, setLoading] = useState()
	const [error, setError] = useState()

	const handelChange = (e) => {
		setUser({
			...user,
			[e.target.name]: e.target.value
		})
	}

	const handelSubmit = async (e) => {
		e.preventDefault()
		setError('')

		if (!user.email || !user.password) {
			setError('Required email and password')
			return
		}

		setLoading(true)
		const response = await login(user)

		if (response.error) {
			setError(response.error)
			setLoading(false);
			return
		}

		if (response.token) {
			localStorage.setItem('token', response.token);
			navigate('/profile');
		} else {
			setError(response);
		}
	}

	console.log(user);

	useEffect(() => {

	}, [])

	return (
		<>
			<div className="d-flex justify-content-center align-items-center min-vh-100">
				<div className="card border-secondary border-opacity-25 col-12 col-md-8 col-lg-6 p-3 shadow-lg ">
					<form onSubmit={handelSubmit}>
						<p className="text-center text-primary"><i className="fa-solid fa-user-shield fa-2xl"></i></p>
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
						<button
							type="submit"
							className="btn btn-primary col-12 col-md-6 d-block mx-auto"
							disabled={loading}>
							{loading ? (
								<span className="d-flex aling-item-center">
									<span className="p-2 w-100"> Loading...</span>
									<span className="spinner-border p-2 flex-shrink-1" role="status"></span>
								</span>
							) : (
								"Login")
							}
						</button>
						<div className="fs-6 mt-2">Don't you have an account? <Link to={('/signup')}> Sing Up</Link></div>
					</form>
				</div>
			</div >
		</>
	);
}; 