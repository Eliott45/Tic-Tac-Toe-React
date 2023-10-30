import { useState } from "react";
import "./styles.css"

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [isAscending, setAscending] = useState(true);

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function handleToggleSort() {
        setAscending(!isAscending);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;

        description = move > 0 ? 'Go to move #' + move : 'Go to game start';

        if(currentMove === move && move > 0){
            description = 'You are at move #' + move;
        }

        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                Descending Sort:
                <input
                    type="checkbox"
                    checked={!isAscending}
                    onChange={handleToggleSort}
                />
                <ol>{isAscending ? moves : moves.reverse()}</ol>
            </div>
        </div>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    const winner = calculateWinner(squares);

    function handleClick(i) {
        if (winner.winner || squares[i]) {
            return;
        }

        const nextSquares = squares.slice();

        nextSquares[i] = xIsNext ? "X" : "O";
        onPlay(nextSquares);
    }

    const renderSquare = (i) => {
        const isWinnerSquare = winner.winningSquares.includes(i);
        return <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinnerSquare={isWinnerSquare} />;
    };

    const rows = [];
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            row.push(renderSquare(i * 3 + j));
        }
        rows.push(<div className="board-row" key={i}>{row}</div>);

    }
    return (
        <>
            <div className="status">{getGameStatusMessage(winner.winner, xIsNext, hasEmptySquares(squares))}</div>
            {rows}
        </>
    );
}

function Square({ value, onSquareClick, isWinnerSquare}) {
    return (
        <button className={`square ${isWinnerSquare ? 'square-win' : ''}`} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function getGameStatusMessage(winner, xIsNext, hasEmptySquares) {
    if (winner) {
        return "Winner: " + winner;
    } else {
        return !hasEmptySquares ? "Draw" : "Next player: " + (xIsNext ? "X" : "O");
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winningSquares: [a, b, c]
            };
        }
    }

    return {
        winner: null,
        winningSquares: []
    };
}

function hasEmptySquares(squares) {
    return squares.some(square => square === null);
}
