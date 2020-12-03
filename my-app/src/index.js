import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        let boardTable = [];
        const size = 3;
        for (let i = 0; i < size; i++) {
            let squares = [];
            for (let j = 0; j < size; j++) {
                squares.push(this.renderSquare(i * size + j));
            }
            boardTable.push(<div key={i} className="board-row">{squares}</div>);
        }

        return (<div>{boardTable}</div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true,
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    toggleSort() {
        this.setState({
            isAscending: !this.state.isAscending
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        let status
        if (winner) {
            status = 'Winner: ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }

        const moves = history.map((step, move) => {
            const location = step.location;
            const col = 1 + location % 3;
            const row = 1 + Math.floor(location / 3);
            const desc = move ?
                `Go to move #${move}. ${step.squares[location]} located at ${col}, ${row}.` :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            )
        })

        const ascend_text = 'Ascending';
        const descend_text = 'Descending';

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>
                        {status}
                    </div>
                    <div>
                        <button onClick={() => this.toggleSort()}>
                            {this.state.isAscending ? <b>{ascend_text}</b> : ascend_text}
                        </button>
                        <button onClick={() => this.toggleSort()}>
                            {this.state.isAscending ? descend_text : <b>{descend_text}</b>}
                        </button>
                    </div>
                    <ol>
                        {this.state.isAscending ? moves : moves.reverse()}
                    </ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}