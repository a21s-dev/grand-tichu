import NavBar from '../../components/navbar';

function NotFound() {
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden justify-center items-center'>
				<h1 className='text-3xl'>404</h1>
			</main>
		</div>
	);

}

export default NotFound;