import NavBar from '../../components/navbar';


function About() {
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<div className='flex flex-col justify-center items-center h-full w-full'>
					<h1>Hehe</h1>
					<h2>Tichu counter app :)</h2>
					<h2>
						Made by {' '}
						<a className='text-blue-500' href='https://yr5.es'>
							Raf
						</a>
					</h2>
					<h2 className='text-blue-500'>
						<a href='https://github.com/alator21/grand-tichu'>
							Github
						</a>
					</h2>
				</div>
			</main>
		</div>
	);

}

export default About;