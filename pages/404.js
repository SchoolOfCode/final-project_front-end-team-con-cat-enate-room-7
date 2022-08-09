import React from 'react'
import Image from 'next/image'
import PetNavBar from '../Components/petNavBar';

const pageNotFound = () => {
    return (
			<main>
				<PetNavBar pet={false} />
				<div className="not-fund">
					<Image
						className="home-image"
						src={require("./../public/test.gif")}
						alt="Picture of cat and dog"
					/>
					<h1>404</h1>
				</div>
			</main>
		);
}

export default pageNotFound