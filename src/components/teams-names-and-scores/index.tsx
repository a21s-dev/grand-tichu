import {type NextPage} from "next";
import * as React from 'react';
import {Typography} from "@mui/material";

const TeamsNamesAndScores: NextPage = () => {
	return (
		<div className='grow-[1.5] grid justify-around content-around grid-cols-[repeat(2,auto)] grid-rows-[3em]'>
			<div className='flex justify-center items-center text-[2.3em]'>
				<Typography variant="plain">
					755
				</Typography>
			</div>
			<div className='flex justify-center items-center text-[2.3em]'>
				<Typography variant="plain">
					945
				</Typography>
			</div>
		</div>
	);
};

export default TeamsNamesAndScores;
