import { type NextPage } from 'next';
import * as React from 'react';
import { Typography } from '@mui/material';
import Link from 'next/link';

const SetScore: NextPage = () => {
	return (
		<div className="mt-auto flex items-center justify-center pt-10">
			<Typography variant="h2" className="h-[3em] w-full text-[2em] text-white">
				<Link href="/submit-score">
					<button className="h-full w-full">Set Score</button>
				</Link>
			</Typography>
		</div>
	);
};

export default SetScore;
