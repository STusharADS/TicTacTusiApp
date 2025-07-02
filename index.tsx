import { useRef, useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Confetti from "react-native-confetti";

type Player = "X" | "O" | null;
type Board = Player[];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const confettiRef = useRef<Confetti>(null);

  const checkWinner = (newBoard: Board): Player | "Draw" | null => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (const [a, b, c] of winPatterns) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }

    return newBoard.every(cell => cell !== null) ? "Draw" : null;
  };

  const handlePress = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      if (result !== "Draw" && confettiRef.current) {
        confettiRef.current.startConfetti();
      }
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-black items-center justify-center">
      <Confetti ref={confettiRef} duration={3000} />

      <Text className="text-green-400 text-3xl font-bold font-mono mb-8">
        Tic Tac Toe
      </Text>

      <Text className="text-white text-xl font-mono mb-4">
        Current Player: {currentPlayer}
      </Text>

      <View
        className="bg-black"
        style={{
          width: 300,
          height: 300,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {board.map((cell, index) => (
          <Pressable
            key={index}
            onPress={() => handlePress(index)}
            className={`w-[100px] h-[100px] border-2 border-green-400 flex items-center justify-center ${
              cell === "X" ? "bg-blue-500" :
              cell === "O" ? "bg-red-500" :
              "bg-gray-800"
            }`}
          >
            <Text className="text-white text-4xl font-bold">{cell}</Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-8 items-center" style={{ minHeight: 120 }}>
        {winner && (
          <>
            <Text className="text-white text-xl font-mono mb-4">
              {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
            </Text>
            <Pressable
              onPress={resetGame}
              className="bg-green-700 px-6 py-3 rounded-lg"
            >
              <Text className="text-white text-lg font-bold">Restart Game</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
