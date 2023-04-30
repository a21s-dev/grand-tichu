import { useSelector } from 'react-redux';
import { selectTeamsWithDetails } from '../../store/currentTurnDetailsSlice.ts';
import { getEntries } from '../../utils/type-wizards.ts';


function TeamsTotals() {
	const teamsWithDetails = useSelector(selectTeamsWithDetails);

	function formatScore(initialScore: number, scoreToAdd: number): string {
		const scoreToAddWithSymbol =
			scoreToAdd >= 0 ? `+${scoreToAdd}` : `${scoreToAdd}`;
		return `${initialScore}(${scoreToAddWithSymbol}) | ${
			initialScore + scoreToAdd
		}`;
	}


	return (
		<div className='flex flex-col items-center justify-center'>
			<div>Total score</div>
			<div className='mt-auto flex w-full grow-[1] items-center justify-around '>
				{getEntries(teamsWithDetails).map(([teamIndex, details]) => (
					<span key={teamIndex}>
            {formatScore(details.totalPointsBeforeThisTurn, details.temporaryScore)}
          </span>
				))}
			</div>
		</div>
	);
}


export default TeamsTotals;
