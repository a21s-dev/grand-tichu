import { useSelector } from 'react-redux';
import { CURRENT_TURN_DETAILS_SELECTORS } from '../../store/currentTurnDetailsSlice.ts';
import { getEntries } from '../../utils/type-wizards.ts';


function TeamsTotals() {
	const teamsWithDetails = useSelector(CURRENT_TURN_DETAILS_SELECTORS.teamsWithDetails);

	function formatTemporaryScore(temporaryScore: number): string {
		const scoreToAddWithSymbol =
			temporaryScore >= 0 ? `+${temporaryScore}` : `${temporaryScore}`;
		return `(${scoreToAddWithSymbol})`;
	}

	function scoreAfterApplicationOfTemporary(initialScore: number, temporaryScore: number): number {
		return initialScore + temporaryScore;
	}


	return (
		<div className='flex flex-col items-center justify-center'>
			<div>Total score</div>
			<div className='mt-auto flex w-full grow-[1] items-center justify-around '>
				{getEntries(teamsWithDetails).map(([teamIndex, details]) => (
					<span key={teamIndex}>
						<span>{details.totalPointsBeforeThisTurn} </span>
						<span>{formatTemporaryScore(details.temporaryScore)}</span>
						<span>&nbsp;=&nbsp;</span>
						<span
							className='border-2 border-dashed border-[black] text-orange-600 font-bold p-1'
						>
							{scoreAfterApplicationOfTemporary(details.totalPointsBeforeThisTurn, details.temporaryScore)}
						</span>
          </span>
				))}
			</div>
		</div>
	);
}


export default TeamsTotals;
