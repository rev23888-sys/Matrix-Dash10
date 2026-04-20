import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Circle,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { config } from '@/config/common';
import { StyledChart } from '@/components/chart/StyledChart';
import { dashboard } from '@/config/translations/dashboard';
import Link from 'next/link';
import { BsMusicNoteBeamed, BsShieldFillCheck, BsDiscord, BsTrophyFill, BsStarFill, BsThreeDotsVertical, BsThreeDots } from 'react-icons/bs';
import { IoServer, IoOpen, IoSettings } from 'react-icons/io5';
import { FaRobot, FaUserShield, FaUsers, FaCog, FaBars } from 'react-icons/fa';
import { MdVoiceChat, MdSecurity, MdAutoAwesome, MdBarChart, MdEmojiEvents, MdDashboard, MdAdd } from 'react-icons/md';
import { RiSwordFill } from 'react-icons/ri';
import { GuildSelect } from '@/pages/user/home';
import { useGuilds } from '@/api/hooks';
import { iconUrl, Guild, PermissionFlags } from '@/api/discord';
import { useState } from 'react';

const INVITE_URL   = 'https://tinyurl.com/Invite-Matrix';
const SUPPORT_URL  = 'https://discord.gg/yAZxdHeJFF';
const VOTE_URL     = 'https://top.gg/bot/1409860321295732808/vote';
const COMMANDS_URL = 'https://discord.gg/yAZxdHeJFF';
const INVITE_BASE  = 'https://discord.com/oauth2/authorize?client_id=1492819533050806282&scope=bot+applications.commands&permissions=8';

export default function HomeView() {
  const t = dashboard.useTranslations();

  return (
    <Flex direction="column" gap={6}>

      {/* ── HERO BANNER ── */}
      <Flex
        direction="row"
        alignItems="center"
        rounded="2xl"
        bgGradient="linear(135deg, brand.500, brand.700)"
        gap={4}
        p={{ base: 5, md: 8 }}
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" right="-20px" top="-20px" w="180px" h="180px" borderRadius="full" bg="whiteAlpha.100" />
        <Box position="absolute" right="80px" bottom="-30px" w="120px" h="120px" borderRadius="full" bg="whiteAlpha.50" />
        <Circle color="white" bgGradient="linear(to right bottom, transparent, blackAlpha.500)" p={4} shadow="2xl" display={{ base: 'none', md: 'block' }} zIndex={1}>
          <Icon as={FaRobot} w="60px" h="60px" />
        </Circle>
        <Flex direction="column" align="start" gap={1} zIndex={1} flex={1}>
          <Badge colorScheme="whiteAlpha" bg="whiteAlpha.300" color="white" rounded="full" px={3} py={1} fontSize="xs">
            ✦ Matrix Bot Dashboard
          </Badge>
          <Heading color="white" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mt={1}>
            {t.invite.title}
          </Heading>
          <Text color="whiteAlpha.800" maxW="500px" fontSize="sm">
            {t.invite.description}
          </Text>
          <HStack mt={3} gap={2} flexWrap="wrap">
            <Button as="a" href={INVITE_URL} target="_blank" color="white" bg="whiteAlpha.200" _hover={{ bg: 'whiteAlpha.300' }} leftIcon={<IoOpen />} rounded="xl" size="sm">
              {t.invite.bn}
            </Button>
            <Button as="a" href={SUPPORT_URL} target="_blank" color="white" variant="ghost" border="1px solid" borderColor="whiteAlpha.300" _hover={{ bg: 'whiteAlpha.150' }} leftIcon={<BsDiscord />} rounded="xl" size="sm">
              Support Server
            </Button>
            <Button as="a" href={VOTE_URL} target="_blank" color="white" variant="ghost" border="1px solid" borderColor="whiteAlpha.300" _hover={{ bg: 'whiteAlpha.150' }} leftIcon={<BsStarFill />} rounded="xl" size="sm">
              Vote on Top.gg
            </Button>
          </HStack>
        </Flex>
      </Flex>

      {/* ── QUICK STATS ── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        <StatCard icon={FaUsers}      label="Total Members" value="50,000+" color="brand.500"  helpText="Across all servers" />
        <StatCard icon={IoServer}     label="Servers"       value="500+"    color="green.400"  helpText="Active servers" />
        <StatCard icon={MdBarChart}   label="Commands Run"  value="1M+"     color="orange.400" helpText="This month" />
        <StatCard icon={BsTrophyFill} label="Uptime"        value="99.9%"   color="yellow.400" helpText="Last 30 days" />
      </SimpleGrid>

      {/* ── YOUR SERVERS ── */}
      <Flex direction="column" gap={3}>
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
          <Box>
            <Heading size="md">{t.servers.title}</Heading>
            <Text color="TextSecondary" fontSize="sm" mt={0.5}>{t.servers.description}</Text>
          </Box>
          {/* ← THREE-DOT / HAMBURGER MENU */}
          <HamburgerMenu />
        </Flex>
        <GuildSelect />
      </Flex>

      {/* ── FEATURES GRID ── */}
      <Flex direction="column" gap={3}>
        <Box>
          <Heading size="md">Matrix Bot Features</Heading>
          <Text color="TextSecondary" fontSize="sm" mt={0.5}>Everything you need to manage and grow your Discord server</Text>
        </Box>
        <SimpleGrid columns={{ base: 2, md: 3, xl: 4 }} gap={3}>
          <FeatureCard icon={RiSwordFill}       label="Moderation"       color="red.400"    badge="Core"     desc="Ban, kick, mute, warn" />
          <FeatureCard icon={BsShieldFillCheck} label="Anti-Nuke"        color="orange.400" badge="Security" desc="Protect from nukes & raids" />
          <FeatureCard icon={MdSecurity}        label="AutoMod"          color="yellow.400" badge="Auto"     desc="Filter spam & bad words" />
          <FeatureCard icon={MdEmojiEvents}     label="Levels & Economy" color="brand.400"  badge="Economy"  desc="XP system with rewards" />
          <FeatureCard icon={BsMusicNoteBeamed} label="Music Player"     color="purple.400" badge="Music"    desc="YouTube, Spotify & more" />
          <FeatureCard icon={MdVoiceChat}       label="Voice Master"     color="teal.400"   badge="Voice"    desc="Temp voice channels" />
          <FeatureCard icon={FaUserShield}      label="Role Manager"     color="blue.400"   badge="Roles"    desc="Auto-roles & menus" />
          <FeatureCard icon={MdAutoAwesome}     label="Auto React"       color="pink.400"   badge="Fun"      desc="React to messages auto" />
        </SimpleGrid>
      </Flex>

      {/* ── ALL SERVERS FULL LIST ── */}
      <AllServersList />

      {/* ── COMMAND USAGE CHART ── */}
      <Flex direction="column" gap={3}>
        <Box>
          <Heading size="md">{t.command.title}</Heading>
          <Text color="TextSecondary" fontSize="sm" mt={0.5}>{t.command.description}</Text>
        </Box>
        <Card variant="primary" rounded="2xl">
          <CardBody>
            <CommandChart />
          </CardBody>
        </Card>
      </Flex>

      {/* ── QUICK ACTIONS ── */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={4}>
        <Card variant="primary" rounded="2xl">
          <CardHeader pb={2}>
            <Heading size="sm">⚡ Quick Actions</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" gap={2}>
              <QuickBtn href={INVITE_URL}   icon={FaRobot}    label="Invite Matrix Bot"     color="brand" />
              <QuickBtn href={SUPPORT_URL}  icon={BsDiscord}  label="Join Support Server"   color="blue" />
              <QuickBtn href={VOTE_URL}     icon={BsStarFill} label="Vote on Top.gg"         color="yellow" />
              <QuickBtn href={COMMANDS_URL} icon={MdDashboard}label="View All Commands"      color="purple" />
            </VStack>
          </CardBody>
        </Card>
        <Card variant="primary" rounded="2xl">
          <CardHeader pb={2}>
            <Heading size="sm">📋 Matrix Bot Commands</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" gap={1} fontSize="sm">
              {[
                ['🛡️ Moderation', '#ban  #kick  #mute  #warn  #purge'],
                ['🚨 Anti-Nuke',  '#antinuke  #extraowner  #whitelist'],
                ['⭐ Levels',     '#lvl  #balance  #daily  #richlist'],
                ['🎵 Music',      '#play  #queue  #skip  #volume'],
                ['🎉 Fun',        '#8ball  #ship  #slots  #hunt'],
                ['📊 Tracker',    '#invites  #messages  #topmessages'],
              ].map(([cat, cmds]) => (
                <Box key={cat}>
                  <Text fontWeight="700" color="brand.400" fontSize="xs">{cat}</Text>
                  <Text color="TextSecondary" fontSize="xs" fontFamily="mono">{cmds}</Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* ── PROMO FOOTER ── */}
      <Card rounded="2xl" bgGradient="linear(135deg, purple.600, brand.600)" border="none" overflow="hidden">
        <CardBody>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Box>
              <Heading color="white" size="md">Love Matrix Bot?</Heading>
              <Text color="whiteAlpha.800" fontSize="sm" mt={1}>Help us grow — vote on Top.gg and invite us to more servers!</Text>
            </Box>
            <HStack gap={2}>
              <Button as="a" href={VOTE_URL} target="_blank" bg="whiteAlpha.200" color="white" _hover={{ bg: 'whiteAlpha.300' }} leftIcon={<BsStarFill />} rounded="xl" size="sm">
                Vote
              </Button>
              <Button as="a" href={INVITE_URL} target="_blank" bg="white" color="brand.600" _hover={{ opacity: 0.9 }} leftIcon={<FaRobot />} rounded="xl" size="sm">
                Invite Bot
              </Button>
            </HStack>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}

// ── HAMBURGER / THREE-DOT MENU ─────────────────────────────────────────────
function HamburgerMenu() {
  return (
    <Menu>
      <Tooltip label="Menu">
        <MenuButton
          as={IconButton}
          icon={<FaBars />}
          aria-label="Menu"
          variant="ghost"
          colorScheme="brand"
          rounded="xl"
          size="sm"
        />
      </Tooltip>
      <MenuList rounded="xl" shadow="xl" minW="180px">
        <MenuItem as="a" href={INVITE_URL} target="_blank" icon={<FaRobot />} fontSize="sm">
          Invite Matrix Bot
        </MenuItem>
        <MenuItem as="a" href={SUPPORT_URL} target="_blank" icon={<BsDiscord />} fontSize="sm">
          Support Server
        </MenuItem>
        <MenuItem as="a" href={VOTE_URL} target="_blank" icon={<BsStarFill />} fontSize="sm">
          Vote on Top.gg
        </MenuItem>
        <MenuDivider />
        <MenuItem as={Link} href="/user/profile" icon={<IoSettings />} fontSize="sm">
          Settings
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

// ── ALL SERVERS FULL LIST ──────────────────────────────────────────────────
function AllServersList() {
  const guilds   = useGuilds();
  const [show, setShow] = useState(false);

  if (guilds.isLoading) return null;
  const all = (guilds.data ?? []).filter((g) => config.guild.filter(g));
  if (all.length === 0) return null;

  return (
    <Flex direction="column" gap={3}>
      <Flex justify="space-between" align="center">
        <Heading size="md">All Your Servers ({all.length})</Heading>
        <Button size="xs" variant="ghost" colorScheme="brand" onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show All'}
        </Button>
      </Flex>
      {show && (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={3}>
          {all.map((guild) => (
            <FullGuildCard key={guild.id} guild={guild} />
          ))}
        </SimpleGrid>
      )}
    </Flex>
  );
}

function FullGuildCard({ guild }: { guild: Guild }) {
  const inviteUrl = `${INVITE_BASE}&guild_id=${guild.id}`;
  const perms     = BigInt(guild.permissions ?? '0');
  const isAdmin   = (perms & BigInt(PermissionFlags.ADMINISTRATOR)) !== BigInt(0);
  // @ts-ignore
  const owned     = guild.owner === true;

  return (
    <Card variant="primary" rounded="2xl">
      <CardHeader as={Flex} gap={3} align="center" pb={2}>
        <Avatar src={guild.icon ? iconUrl(guild) : undefined} name={guild.name} size="sm" rounded="lg" />
        <Box flex={1} minW={0}>
          <Text fontWeight="700" fontSize="sm" noOfLines={1}>{guild.name}</Text>
          <HStack gap={1} mt="2px">
            {owned && <Badge colorScheme="brand"  fontSize="9px" rounded="full">Owner</Badge>}
            {isAdmin && !owned && <Badge colorScheme="green" fontSize="9px" rounded="full">Admin</Badge>}
          </HStack>
        </Box>
      </CardHeader>
      <CardBody pt={0}>
        <HStack gap={2}>
          <Button as={Link} href={`/guilds/${guild.id}`} size="xs" colorScheme="brand" leftIcon={<FaCog />} flex={1} rounded="lg">
            Manage
          </Button>
          <Button as="a" href={inviteUrl} target="_blank" size="xs" variant="outline" colorScheme="brand" leftIcon={<MdAdd />} flex={1} rounded="lg">
            Invite Bot
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
}

// ── HELPERS ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, helpText }: { icon: any; label: string; value: string; color: string; helpText: string }) {
  return (
    <Card variant="primary" rounded="2xl">
      <CardBody>
        <HStack gap={3}>
          <Circle p={3} bg="brandAlpha.100">
            <Icon as={icon} color={color} w={5} h={5} />
          </Circle>
          <Stat size="sm">
            <StatNumber fontWeight="bold" fontSize="xl">{value}</StatNumber>
            <StatLabel color="TextSecondary" fontSize="xs">{label}</StatLabel>
            <StatHelpText color="TextSecondary" fontSize="xs" mb={0}>{helpText}</StatHelpText>
          </Stat>
        </HStack>
      </CardBody>
    </Card>
  );
}

function FeatureCard({ icon, label, color, badge, desc }: { icon: any; label: string; color: string; badge: string; desc: string }) {
  return (
    <Card variant="primary" rounded="2xl" cursor="pointer" _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
      <CardBody as={Center} flexDirection="column" gap={2} p={4} textAlign="center">
        <Circle p={3} bg="brandAlpha.100">
          <Icon as={icon} color={color} w={6} h={6} />
        </Circle>
        <Text fontWeight="semibold" fontSize="sm">{label}</Text>
        <Text color="TextSecondary" fontSize="xs" noOfLines={1}>{desc}</Text>
        <Badge colorScheme="brand" rounded="full" fontSize="xs">{badge}</Badge>
      </CardBody>
    </Card>
  );
}

function QuickBtn({ href, icon, label, color }: { href: string; icon: any; label: string; color: string }) {
  return (
    <Button as="a" href={href} target="_blank" variant="ghost" justifyContent="flex-start" leftIcon={<Icon as={icon} />} colorScheme={color} rounded="xl" size="sm" w="full">
      {label}
    </Button>
  );
}

function CommandChart() {
  return (
    <StyledChart
      options={{
        colors: ['#7551FF', '#39B8FF', '#05CD99'],
        chart: { animations: { enabled: false } },
        xaxis: { categories: ['NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR'] },
        legend: { position: 'top' },
        stroke: { curve: 'smooth', width: 3 },
        responsive: [{ breakpoint: 650, options: { legend: { position: 'bottom' } } }],
      }}
      series={[
        { name: 'Moderation', data: [120, 145, 98, 180, 160, 210] },
        { name: 'Levels',     data: [80,  110, 75, 130, 115, 170] },
        { name: 'Music',      data: [40,   60, 45,  80,  70,  95] },
      ]}
      height="280"
      type="area"
    />
  );
}
