import React, { Component } from "react";
import { uuid } from "uuidv4";
import "./App.css";
import Row from "./Row";
import LodingAni from "./LodingAni";
import StartBtn from "./StartBtn";
import { moveTile, rowColConverter } from "../functions/moveTile";
import Modal from "./Modal";
// import Alert from './alert';

// 필립님 안녕하세용 오늘도 수고가 많으쎄여
// 성공과 실패에 따라 보여 줄 메세지를 영어로 쓰려는데 내 영어는 7세수준인가봐여
// 밑에 17번째 줄이랑 20번째 줄에 고오오오급지게 써주세여.......
// 그럼 저는 이만 갈게여 나 오늘 이거 게임하다 솔로데이 다 날려먹었어여 헿ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ너므 재밌자낳ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ

// 게임오버가 되면 모달창이 뜬다.

// 2048에 도달하여 성공했을 시 "Success!" 메세지 보여주고
// 버튼으로는 더 높은 점수에 도전할 것인지 선택을 위해 continue 버튼과 new Game 버튼 생성

// 게임에 져서 게임오버가 됬을 시 "Game Over" 메세지 보여주고
// 버튼으로는 new Game 버튼과 close 버튼 생성

class App extends Component {
  constructor() {
    super();
    this.state = {
      board: null,
      score: 0,
      gameOver: false,
      gameSuccess: false,
      continue: false,
    };
  }

  init = () => {
    // 바로 moveCells 로 바인딩
    document.body.addEventListener("keydown", this.moveCells);

    let board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    board = this.randomCoordinate(this.randomCoordinate(board));
    let score = board.reduce((acc, cur) => {
      return acc + cur.reduce((acc, cur) => acc + cur, 0);
    }, 0);

    this.setState({
      board,
      score,
      gameOver: false,
      gameSuccess: false,
      continue: false,
    });
  };

  randomNumberGenerator = () => {
    return Math.random() > 0.75 ? 4 : 2;
  };

  findEmptyCell = (board) => {
    const emptyCell = [];

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === 0) {
          emptyCell.push([i, j]);
        }
      }
    }

    return emptyCell;
  };

  randomCoordinate = (board) => {
    const emptyCell = this.findEmptyCell(board);
    const coordinate = emptyCell[Math.floor(Math.random() * emptyCell.length)];
    // 직접 함수 리턴값을 넣어줌
    if (coordinate === undefined) {
      return board;
    }
    board[coordinate[0]][coordinate[1]] = this.randomNumberGenerator();

    return board;
  };

  // 약간 맘에 안듬  -> 나도 맘에 안듬!!!!
  addNewNumber = () => {
    // randomCoordinate 함수가 state있는걸
    // board[coordinate[0]][coordinate[1]] = randomNumber; 로 직접 변경을 함
    const updatedBoard = this.randomCoordinate(this.state.board);
    // score update
    let score = this.state.board.reduce((acc, cur) => {
      return acc + cur.reduce((acc, cur) => acc + cur, 0);
    }, 0);

    this.setState({
      board: updatedBoard,
      score,
    });
  };

  moveCells = (e) => {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      if (this.state.gameOver === true) {
        return;
      }

      let keyCodeObj = {
        37: "left",
        38: "up",
        39: "right",
        40: "down",
      };

      const newBoard = moveTile(this.state.board, keyCodeObj[e.keyCode]);
      let moved = this.moveCheckHandler(newBoard);
      if (moved === false) {
        this.setState({
          board: newBoard,
        });
        this.addNewNumber();
        this.gameOverHandler();
        this.gameSuccessHandler();
      }
    }
  };

  // this.state.board와 newBoard가 같지 않을 때, 움직일 수 없다면 return 값을 전달
  moveCheckHandler = (newBoard) => {
    for (let i = 0; i < this.state.board.length; i++) {
      for (let j = 0; j < this.state.board.length; j++) {
        if (this.state.board[i][j] !== newBoard[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  gameSuccessHandler = () => {
    if (!this.state.continue) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (this.state.board[i][j] === 2048) {
            this.setState({
              gameSuccess: true,
            });
            return;
          }
        }
      }
    }
  };

  gameOverHandler = () => {
    // findEmptyCell에 빈 칸이 하나라도 있다면 리턴
    if (this.findEmptyCell(this.state.board).length !== 0) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      // [1,2,3,4] <- 여기서 비교해야 할 값은 1,2 / 2,3 / 3,4 로 세 가지 경우이기 때문에 j < 3의 조건식을 써준다.
      for (let j = 0; j < 3; j++) {
        if (this.state.board[i][j] === this.state.board[i][j + 1]) {
          return;
        }
      }
    }

    const convertedBoard = rowColConverter(this.state.board);

    for (let i = 0; i < convertedBoard.length; i++) {
      for (let j = 0; j < convertedBoard.length - 1; j++) {
        if (convertedBoard[i][j] === convertedBoard[i][j + 1]) {
          return;
        }
      }
    }

    return this.setState({
      gameOver: true,
    });
  };

  closeOrContinueHandler = (msg) => {
    if (msg === "Success!") {
      // 2048을 성공적으로 달성했고, Continue를 하고싶다면
      this.setState({
        continue: true,
        gameSuccess: false,
      });
    }

    if (msg === "Game Over!") {
      // 게임이 끝났고 그냥 모달창을 닫고싶다면
      this.setState({
        gameOver: false,
      });
      // 이곳에서 보드 띄우게끔 해주는 CSS 삽입하기
    }
  };

  // change the color of the numbers in the tiles
  // game stop button - change the color

  render() {
    return (
      <div className='App' onKeyPress={this.keyPressed}>
        {/* <Alert /> */}
        {this.state.gameOver || this.state.gameSuccess ? (
          <React.Fragment>
            <div className='bg'></div>
            <Modal
              closeOrContinue={this.closeOrContinueHandler}
              gameOver={this.state.gameOver}
              newGame={this.init}
              score={this.state.score}
            />
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        <React.Fragment>
          <StartBtn onClickEvent={this.init} />
          <LodingAni />
          <div className='score'>Score : {this.state.score}</div>
          <table>
            {this.state.board &&
              this.state.board.map((row, i) => <Row key={uuid()} row={row} />)}
          </table>
        </React.Fragment>
      </div>
    );
  }
}

export default App;
