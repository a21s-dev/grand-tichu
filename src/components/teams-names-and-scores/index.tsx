import {type NextPage} from "next";
import * as React from 'react';
import {Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {selectTeamScores} from "~/store/teamScoresSlice";

const TeamsNamesAndScores: NextPage = () => {
	const s = useSelector(selectTeamScores)
	return (
		<div className='grow-[1.5] grid justify-around content-around grid-cols-[repeat(2,auto)] grid-rows-[3em]'>
			{Object.entries(s.teamsAndScores).map(([key, value]) => {
				return (<div className='flex justify-center items-center text-[2.3em]' key={key}>
					<Typography variant="plain">
						{value.score}
					</Typography>
				</div>)
			})}
		</div>
	);
};

export default TeamsNamesAndScores;
