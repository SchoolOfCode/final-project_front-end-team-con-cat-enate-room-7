import React from 'react'
import Image from 'next/image'
import LinkButton from './linkButton'

const SignInOut = () => {
    return (
			<div className="not-fund">
				<div>
					<Image
						className="home-image"
						src={require("./../public/clear_logo.png")}
						alt="Care-Full App Logo"
					/>
				</div>
				<h2>Welcome to The Care-Full App</h2>
				<LinkButton text="Log In" link="/api/auth/login" />
			</div>
		);
}

export default SignInOut