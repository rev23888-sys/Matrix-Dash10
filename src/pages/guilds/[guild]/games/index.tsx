import {
  Badge, Box, Button, Card, CardBody, CardHeader,
  Flex, Grid, Heading, HStack, Icon, SimpleGrid,
  Text, VStack, useToast, Spinner, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  ModalFooter, useDisclosure, Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '@/pages/_app';
import getGuildLayout from '@/components/layout/guild/get-guild-layout';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FaGamepad, FaCoins, FaTrophy } from 'react-icons/fa';
import { MdPlayArrow, MdRefresh } from 'react-icons/md';

// ── GAME CONFIGS ──────────────────────────────────────────────────────────
const GAMES = [
  { id: 'coinflip',  name: 'Coin Flip',    icon: '🪙', reward: [50, 100],   desc: 'Heads or tails?',           color: 'yellow' },
  { id: 'rps',       name: 'Rock Paper Scissors', icon: '✂️', reward: [50, 150], desc: 'Beat the bot!',         color: 'blue' },
  { id: 'slots',     name: 'Slot Machine', icon: '🎰', reward: [0, 500],    desc: 'Spin to win!',              color: 'purple' },
  { id: 'numguess',  name: 'Number Guess', icon: '🔢', reward: [100, 250],  desc: 'Guess 1-10 in 3 tries',    color: 'green' },
  { id: 'tictactoe', name: 'Tic Tac Toe',  icon: '❌', reward: [100, 300],  desc: 'Beat the AI!',             color: 'orange' },
  { id: 'memory',    name: 'Memory Game',  icon: '🧠', reward: [200, 400],  desc: 'Match all pairs!',          color: 'pink' },
] as const;

type GameId = typeof GAMES[number]['id'];

const GamesPage: NextPageWithLayout = () => {
  const { guild } = useRouter().query as { guild: string };
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const toast = useToast();

  function onGameWin(reward: number) {
    setTotalEarned((p) => p + reward);
    toast({
      title: `🎉 +${reward.toLocaleString()} coins earned!`,
      description: 'Added to your server balance.',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">🎮 Games</Heading>
          <Text color="TextSecondary" mt={1}>Play games to earn coins on this server!</Text>
        </Box>
        <Card variant="primary" rounded="xl" px={4} py={2}>
          <HStack gap={2}>
            <Icon as={FaCoins} color="yellow.400" />
            <Text fontWeight="700">{totalEarned.toLocaleString()} coins earned</Text>
          </HStack>
        </Card>
      </Flex>

      {activeGame ? (
        <ActiveGame
          gameId={activeGame}
          onBack={() => setActiveGame(null)}
          onWin={onGameWin}
        />
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
          {GAMES.map((game) => (
            <Card
              key={game.id}
              variant="primary"
              rounded="2xl"
              cursor="pointer"
              _hover={{ transform: 'translateY(-3px)', shadow: 'lg', transition: 'all 0.2s' }}
              onClick={() => setActiveGame(game.id)}
            >
              <CardBody as={Flex} direction="column" gap={3} p={5}>
                <Flex justify="space-between" align="start">
                  <Text fontSize="3xl">{game.icon}</Text>
                  <Badge colorScheme={game.color} rounded="full" fontSize="xs">
                    +{game.reward[0]}–{game.reward[1]} 🪙
                  </Badge>
                </Flex>
                <Box>
                  <Text fontWeight="700" fontSize="md">{game.name}</Text>
                  <Text fontSize="sm" color="TextSecondary">{game.desc}</Text>
                </Box>
                <Button size="sm" colorScheme={game.color} leftIcon={<MdPlayArrow />} rounded="lg" w="fit-content">
                  Play
                </Button>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Flex>
  );
};

// ── ACTIVE GAME ROUTER ────────────────────────────────────────────────────
function ActiveGame({ gameId, onBack, onWin }: { gameId: GameId; onBack: () => void; onWin: (r: number) => void }) {
  const cfg = GAMES.find((g) => g.id === gameId)!;
  return (
    <Flex direction="column" gap={4}>
      <Button variant="ghost" leftIcon={<MdRefresh />} onClick={onBack} w="fit-content" size="sm">
        ← Back to Games
      </Button>
      <Card variant="primary" rounded="2xl">
        <CardHeader><Heading size="md">{cfg.icon} {cfg.name}</Heading></CardHeader>
        <CardBody>
          {gameId === 'coinflip'  && <CoinFlipGame  onWin={onWin} reward={cfg.reward} />}
          {gameId === 'rps'       && <RPSGame        onWin={onWin} reward={cfg.reward} />}
          {gameId === 'slots'     && <SlotsGame      onWin={onWin} reward={cfg.reward} />}
          {gameId === 'numguess'  && <NumGuessGame   onWin={onWin} reward={cfg.reward} />}
          {gameId === 'tictactoe' && <TicTacToeGame  onWin={onWin} reward={cfg.reward} />}
          {gameId === 'memory'    && <MemoryGame     onWin={onWin} reward={cfg.reward} />}
        </CardBody>
      </Card>
    </Flex>
  );
}

// ── COIN FLIP ─────────────────────────────────────────────────────────────
function CoinFlipGame({ onWin, reward }: { onWin: (r: number) => void; reward: readonly [number, number] }) {
  const [result, setResult] = useState<null | 'heads' | 'tails'>(null);
  const [choice, setChoice] = useState<null | 'heads' | 'tails'>(null);
  const [flipping, setFlipping] = useState(false);

  function flip(c: 'heads' | 'tails') {
    if (flipping) return;
    setChoice(c); setFlipping(true); setResult(null);
    setTimeout(() => {
      const r = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(r); setFlipping(false);
      if (r === c) onWin(Math.floor(Math.random() * (reward[1] - reward[0] + 1)) + reward[0]);
    }, 1000);
  }

  return (
    <VStack gap={5} align="center" py={4}>
      <Text fontSize="6xl" style={{ transition: 'transform 0.3s', transform: flipping ? 'rotateY(180deg)' : 'none' }}>
        {flipping ? '🔄' : result === 'heads' ? '🌕' : result === 'tails' ? '🌑' : '🪙'}
      </Text>
      {result && (
        <Badge colorScheme={result === choice ? 'green' : 'red'} fontSize="md" px={4} py={1} rounded="full">
          {result === choice ? `✅ You won! +${reward[0]}–${reward[1]} coins` : `❌ ${result} — you chose ${choice}`}
        </Badge>
      )}
      <HStack gap={3}>
        <Button colorScheme="yellow" onClick={() => flip('heads')} isLoading={flipping} rounded="xl">Heads 🌕</Button>
        <Button colorScheme="gray"   onClick={() => flip('tails')} isLoading={flipping} rounded="xl">Tails 🌑</Button>
      </HStack>
    </VStack>
  );
}

// ── RPS ───────────────────────────────────────────────────────────────────
function RPSGame({ onWin, reward }: { onWin: (r: number) => void; reward: readonly [number, number] }) {
  const [result, setResult] = useState<null | string>(null);
  const choices = ['rock', 'paper', 'scissors'];
  const emojis  = { rock: '🪨', paper: '📄', scissors: '✂️' };
  const wins    = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

  function play(c: string) {
    const bot = choices[Math.floor(Math.random() * 3)];
    const won = wins[c as keyof typeof wins] === bot;
    const tie = c === bot;
    setResult(`${emojis[c as keyof typeof emojis]} vs ${emojis[bot as keyof typeof emojis]} — ${tie ? 'Tie!' : won ? '✅ You Win!' : '❌ You Lose!'}`);
    if (won) onWin(Math.floor(Math.random() * (reward[1] - reward[0] + 1)) + reward[0]);
  }

  return (
    <VStack gap={5} align="center" py={4}>
      {result && <Badge colorScheme={result.includes('Win') ? 'green' : result.includes('Tie') ? 'yellow' : 'red'} fontSize="lg" px={4} py={2} rounded="full">{result}</Badge>}
      <HStack gap={3}>
        {choices.map((c) => (
          <Button key={c} onClick={() => play(c)} colorScheme="brand" rounded="xl" fontSize="2xl" h="60px" w="60px">
            {emojis[c as keyof typeof emojis]}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}

// ── SLOTS ─────────────────────────────────────────────────────────────────
function SlotsGame({ onWin, reward }: { onWin: (r: number) => void; reward: readonly [number, number] }) {
  const items = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
  const [spin, setSpin] = useState(['❓', '❓', '❓']);
  const [spinning, setSpinning] = useState(false);
  const [msg, setMsg] = useState('');

  function doSpin() {
    if (spinning) return;
    setSpinning(true); setMsg('');
    setTimeout(() => {
      const r = [0, 0, 0].map(() => items[Math.floor(Math.random() * items.length)]);
      setSpin(r); setSpinning(false);
      if (r[0] === r[1] && r[1] === r[2]) {
        const w = reward[1];
        setMsg(`🎉 JACKPOT! +${w} coins!`);
        onWin(w);
      } else if (r[0] === r[1] || r[1] === r[2] || r[0] === r[2]) {
        const w = Math.floor(reward[1] / 3);
        setMsg(`✨ Two match! +${w} coins`);
        onWin(w);
      } else {
        setMsg('💀 No match. Try again!');
      }
    }, 800);
  }

  return (
    <VStack gap={5} align="center" py={4}>
      <HStack gap={4}>
        {spin.map((s, i) => (
          <Flex key={i} w="60px" h="60px" align="center" justify="center" bg="blackAlpha.200" rounded="xl" fontSize="2xl"
            style={{ animation: spinning ? 'pulse 0.3s infinite' : 'none' }}>
            {spinning ? '🔄' : s}
          </Flex>
        ))}
      </HStack>
      {msg && <Badge colorScheme={msg.includes('JACKPOT') ? 'yellow' : msg.includes('Two') ? 'green' : 'red'} fontSize="sm" px={3} py={1} rounded="full">{msg}</Badge>}
      <Button colorScheme="purple" onClick={doSpin} isLoading={spinning} rounded="xl" size="lg">Spin! 🎰</Button>
    </VStack>
  );
}

// ── NUMBER GUESS ──────────────────────────────────────────────────────────
function NumGuessGame({ onWin, reward }: { onWin: (r: number) => void; reward: readonly [number, number] }) {
  const [target] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [guess, setGuess] = useState('');
  const [tries, setTries] = useState(3);
  const [msg, setMsg] = useState('Guess a number 1-10. You have 3 tries!');
  const [done, setDone] = useState(false);

  function submit() {
    const n = parseInt(guess);
    if (isNaN(n) || n < 1 || n > 10) return;
    const left = tries - 1;
    setTries(left);
    if (n === target) {
      setMsg(`✅ Correct! The number was ${target}!`);
      setDone(true);
      onWin(Math.floor(Math.random() * (reward[1] - reward[0] + 1)) + reward[0]);
    } else if (left === 0) {
      setMsg(`❌ Out of tries! The number was ${target}.`);
      setDone(true);
    } else {
      setMsg(`${n > target ? '🔽 Too high!' : '🔼 Too low!'} ${left} tries left.`);
    }
    setGuess('');
  }

  return (
    <VStack gap={4} align="center" py={4}>
      <Text fontWeight="600" color="TextSecondary">{msg}</Text>
      <HStack gap={2} flexWrap="wrap" justify="center">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <Button key={n} size="sm" colorScheme="brand" variant={guess === String(n) ? 'solid' : 'outline'}
            onClick={() => { if (!done) setGuess(String(n)); }} isDisabled={done} rounded="lg" w="40px">
            {n}
          </Button>
        ))}
      </HStack>
      <Button colorScheme="brand" onClick={submit} isDisabled={!guess || done} rounded="xl">Guess!</Button>
    </VStack>
  );
}

// ── TIC TAC TOE ───────────────────────────────────────────────────────────
function TicTacToeGame({ onWin, reward }: { onWin: (r: number) => void; reward: readonly [number, number] }) {
  const [board, setBoard] = useState<(null | 'X' | 'O')[]>(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [winner, setWinner] = useState<null | string>(null);

  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function calcWinner(b: typeof board) {
    for (const [a,c,d] of lines) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    return b.every(Boolean) ? 'tie' : null;
  }

  function click(i: number) {
    if (board[i] || winner) return;
    const nb = [...board]; nb[i] = 'X';
    const w = calcWinner(nb);
    if (w) { setBoard(nb); setWinner(w); if (w === 'X') onWin(Math.floor(Math.random() * (reward[1] - reward[0] + 1)) + reward[0]); return; }
    // bot move
    const empty = nb.map((v, i) => v == null ? i : -1).filter((v) => v >= 0);
    if (empty.length) { const bi = empty[Math.floor(Math.random() * empty.length)]; nb[bi] = 'O'; }
    const w2 = calcWinner(nb);
    setBoard(nb); setWinner(w2);
    setXTurn(true);
  }

  function reset() { setBoard(Array(9).fill(null)); setWinner(null); setXTurn(true); }

  return (
    <VStack gap={4} align="center" py={4}>
      {winner && (
        <Badge colorScheme={winner === 'X' ? 'green' : winner === 'tie' ? 'yellow' : 'red'} fontSize="sm" px={3} py={1} rounded="full">
          {winner === 'X' ? '✅ You Win!' : winner === 'tie' ? '🤝 Tie!' : '❌ Bot Wins!'}
        </Badge>
      )}
      <Grid templateColumns="repeat(3, 1fr)" gap={2} w="180px">
        {board.map((cell, i) => (
          <Button key={i} h="55px" onClick={() => click(i)} colorScheme={cell === 'X' ? 'brand' : cell === 'O' ? 'red' : 'gray'}
            variant={cell ? 'solid' : 'outline'} rounded="xl" fontSize="xl">
            {cell ?? ''}
          </Button>
        ))}
      </Grid>
      {winner && <Button size="sm" colorScheme="brand" onClick={reset} rounded="xl">Play Again</Button>}
    </VStack>
  );
}

// ── MEMORY GAME ───────────────────────────────────────────────────────────
const CARDS_POOL = ['🍕', '🎸', '🚀', '🦊', '🌈', '💎', '🎯', '🏆'];

function MemoryGame({ onWin, reward }: { onWin: (r: number) => void; reward: readonly [number, number] }) {
  const makeDeck = () => [...CARDS_POOL, ...CARDS_POOL].sort(() => Math.random() - 0.5).map((v, i) => ({ id: i, value: v, flipped: false, matched: false }));
  const [cards, setCards] = useState(makeDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [won, setWon] = useState(false);

  function flip(id: number) {
    if (selected.length === 2 || cards[id].matched || cards[id].flipped) return;
    const nc = cards.map((c) => c.id === id ? { ...c, flipped: true } : c);
    const ns = [...selected, id];
    setCards(nc);
    if (ns.length === 2) {
      setSelected([]);
      if (nc[ns[0]].value === nc[ns[1]].value) {
        const mc = nc.map((c) => ns.includes(c.id) ? { ...c, matched: true } : c);
        const nm = matches + 1;
        setCards(mc); setMatches(nm);
        if (nm === CARDS_POOL.length) { setWon(true); onWin(Math.floor(Math.random() * (reward[1] - reward[0] + 1)) + reward[0]); }
      } else {
        setTimeout(() => setCards((prev) => prev.map((c) => ns.includes(c.id) && !c.matched ? { ...c, flipped: false } : c)), 800);
      }
    } else {
      setSelected(ns);
    }
  }

  return (
    <VStack gap={4} align="center" py={2}>
      {won && <Badge colorScheme="green" fontSize="sm" px={3} py={1} rounded="full">🎉 All matched! You win!</Badge>}
      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        {cards.map((card) => (
          <Button key={card.id} h="50px" w="50px" fontSize="xl" rounded="xl"
            colorScheme={card.matched ? 'green' : 'brand'} variant={card.flipped || card.matched ? 'solid' : 'outline'}
            onClick={() => flip(card.id)}>
            {card.flipped || card.matched ? card.value : '❓'}
          </Button>
        ))}
      </Grid>
      <Text fontSize="sm" color="TextSecondary">{matches}/{CARDS_POOL.length} matches</Text>
      {won && <Button size="sm" colorScheme="brand" onClick={() => { setCards(makeDeck()); setMatches(0); setWon(false); }} rounded="xl">Play Again</Button>}
    </VStack>
  );
}

GamesPage.getLayout = (c) => getGuildLayout({ children: c, back: true });
export default GamesPage;
