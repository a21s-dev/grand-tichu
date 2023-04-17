import {type NextPage} from "next";
import * as React from 'react';
import {Typography} from "@mui/material";

const SetScore: NextPage = () => {
	return (
		<div className="flex justify-center items-center mt-auto pt-10">
			<Typography variant="h2" className='w-full text-[2em] h-[3em] text-white'>
				<button
					className='w-full h-full'
				>
					Set Score
				</button>
			</Typography>

		</div>
	);
};

export default SetScore;
