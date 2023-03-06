import {type NextPage} from "next";
import * as React from 'react';

const TeamsNamesAndScores: NextPage = () => {
	return (
		<div className='grow-[1.5] grid justify-around content-around grid-cols-[repeat(2,auto)] grid-rows-[3em]'>
			<div className='flex justify-center items-center text-[2.3em]'>755</div>
			<div className='flex justify-center items-center text-[2.3em]'>945</div>
		</div>
	);
};

export default TeamsNamesAndScores;
