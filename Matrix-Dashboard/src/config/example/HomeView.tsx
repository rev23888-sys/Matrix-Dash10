import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Circle,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tag,
  Text,
  VStack,
  Divider,
  Badge,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { config } from '@/config/common';
import { StyledChart } from '@/components/chart/StyledChart';
import { dashboard } from '@/config/translations/dashboard';
import Link from 'next/link';
import {
  BsMusicNoteBeamed,
  BsShieldFillCheck,
  BsDiscord,
  BsTrophyFill,
  BsStarFill,
} from 'react-icons/bs';
import { IoOpen, IoPricetag, IoShieldCheckmark, IoServer } from 'react-icons/io5';
import { FaRobot, FaUserShield, FaUsers, FaDiscord } from 'react-icons/fa';
import { MdVoiceChat, MdSecurity, MdAutoAwesome, MdBarChart, MdEmojiEvents, MdDashboard } from 'react-icons/md';
import { RiSwordFill } from 'react-icons/ri';
import { GuildSelect } from '@/pages/user/home';

// ── LINKS ──────────────────────────────────────────────────────────────────────
const INVITE_URL  = 'https://tinyurl.com/Invite-Matrix';
const SUPPORT_URL = 'https://discord.gg/yAZxdHeJFF';
const VOTE_URL    = 'https://top.gg/bot/1409860321295732808/vote';

export default function HomeView() {
  const t = dashboard.useTranslations();

  return (
    <Flex direction="column" gap={6}>
      {/* ── HERO INVITE BANNER ── */}
      <Flex
        direction="row"
        alignItems="center"
        rounded="2xl"
        bgGradient="linear(135deg, brand.500, brand.700)"
        gap={4}
        p={6}
        position="relative"
        overflow="hidden"
      >
        {/* background decoration */}
        <Box
          position="absolute"
          right="-20px"
          top="-20px"
          w="180px"
          h="180px"
          borderRadius="full"
          bg="whiteAlpha.100"
        />
        <Box
          position="absolute"
          right="80px"
          bottom="-30px"
          w="120px"
          h="120px"
          borderRadius="full"
          bg="whiteAlpha.50"
        />

        <Circle
          color="white"
          bgGradient="linear(to right bottom, transparent, blackAlpha.500)"
          p={4}
          shadow="2xl"
          display={{ base: 'none', md: 'block' }}
          zIndex={1}
        >
          <Icon as={FaRobot} w="60px" h="60px" />
        </Circle>

        <Flex direction="column" align="start" gap={1} zIndex={1}>
          <Badge colorScheme="whiteAlpha" bg="whiteAlpha.300" color="white" rounded="full" px={3} py={1} fontSize="xs">
            ✦ Matrix Bot Dashboard
          </Badge>
          <Heading color="white" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mt={1}>
            {t.invite.title}
          </Heading>
          <Text color="whiteAlpha.800" maxW="500px">
            {t.invite.description}
          </Text>
          <HStack mt={3} gap={2} flexWrap="wrap">
            <Button
              as={Link}
              href={INVITE_URL}
              color="white"
              bg="whiteAlpha.200"
              _hover={{ bg: 'whiteAlpha.300' }}
              _active={{ bg: 'whiteAlpha.400' }}
              leftIcon={<IoOpen />}
              rounded="xl"
            >
              {t.invite.bn}
            </Button>
            <Button
              as={Link}
              href={SUPPORT_URL}
              target="_blank"
              color="white"
              bg="whiteAlpha.150"
              _hover={{ bg: 'whiteAlpha.250' }}
              leftIcon={<BsDiscord />}
              rounded="xl"
              variant="ghost"
              border="1px solid"
              borderColor="whiteAlpha.300"
            >
              Support Server
            </Button>
          </HStack>
        </Flex>
      </Flex>

      {/* ── STATS ROW ── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        <StatCard icon={FaUsers}        label="Total Members"   value="50,000+"  color="brand.500"  helpText="Across all servers" />
        <StatCard icon={IoServer}       label="Servers"         value="500+"     color="green.400"  helpText="Active servers" />
        <StatCard icon={MdBarChart}     label="Commands Run"    value="1M+"      color="orange.400" helpText="This month" />
        <StatCard icon={BsTrophyFill}   label="Uptime"          value="99.9%"    color="yellow.400" helpText="Last 30 days" />
      </SimpleGrid>

      {/* ── SELECT SERVER ── */}
      <Flex direction="column" gap={3}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="md">{t.servers.title}</Heading>
            <Text color="TextSecondary" fontSize="sm" mt={1}>{t.servers.description}</Text>
          </Box>
          <Tag colorScheme="brand" rounded="full" size="sm">
            <Icon as={MdDashboard} mr={1} />
            Configure
          </Tag>
        </Flex>
        <GuildSelect />
      </Flex>

      {/* ── FEATURES GRID ── */}
      <Flex direction="column" gap={3}>
        <Box>
          <Heading size="md">{t.features?.title ?? 'Matrix Bot Features'}</Heading>
          <Text color="TextSecondary" fontSize="sm" mt={1}>
            {t.features?.description ?? 'Everything you need to manage and grow your Discord server'}
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 2, md: 3, xl: 4 }} gap={3}>
          <FeatureCard icon={RiSwordFill}       label="Moderation"      color="red.400"    badge="Core" />
          <FeatureCard icon={BsShieldFillCheck} label="Anti-Nuke"       color="orange.400" badge="Security" />
          <FeatureCard icon={MdSecurity}        label="AutoMod"         color="yellow.400" badge="Auto" />
          <FeatureCard icon={MdEmojiEvents}     label="Levels & Economy" color="brand.400" badge="Economy" />
          <FeatureCard icon={BsMusicNoteBeamed} label="Music Player"    color="purple.400" badge="Music" />
          <FeatureCard icon={MdVoiceChat}       label="Voice Master"    color="teal.400"   badge="Voice" />
          <FeatureCard icon={FaUserShield}      label="Role Manager"    color="blue.400"   badge="Roles" />
          <FeatureCard icon={MdAutoAwesome}     label="Auto React"      color="pink.400"   badge="Fun" />
        </SimpleGrid>
      </Flex>

      {/* ── COMMAND USAGE CHART ── */}
      <Flex direction="column" gap={3}>
        <Box>
          <Heading size="md">{t.command.title}</Heading>
          <Text color="TextSecondary" fontSize="sm" mt={1}>{t.command.description}</Text>
        </Box>
        <Card variant="primary" rounded="2xl">
          <CardBody>
            <CommandChart />
          </CardBody>
        </Card>
      </Flex>

      {/* ── QUICK ACTIONS + VOICE CHANNELS ── */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={4}>
        {/* Quick Actions */}
        <Card variant="primary" rounded="2xl">
          <CardHeader>
            <Heading size="sm">⚡ Quick Actions</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" gap={2}>
              <QuickActionBtn
                href={INVITE_URL}
                icon={FaRobot}
                label="Invite Matrix Bot"
                color="brand"
              />
              <QuickActionBtn
                href={SUPPORT_URL}
                icon={BsDiscord}
                label="Join Support Server"
                color="blue"
              />
              <QuickActionBtn
                href={VOTE_URL}
                icon={BsStarFill}
                label="Vote on Top.gg"
                color="yellow"
              />
            </VStack>
          </CardBody>
        </Card>

        {/* Voice Channels */}
        <Flex direction="column" gap={3}>
          <Card rounded="2xl" variant="primary">
            <CardBody as={Center} p={4} flexDirection="column" gap={3}>
              <Circle p={4} bg="brandAlpha.100" color="brand.500" _dark={{ color: 'brand.200' }}>
                <Icon as={BsMusicNoteBeamed} w="60px" h="60px" />
              </Circle>
              <Text fontWeight="medium">{t.vc.create}</Text>
            </CardBody>
          </Card>
          <Text fontSize="md" fontWeight="600">{t.vc['created channels']}</Text>
          <VoiceChannelItem name="General Voice" members={12} />
          <VoiceChannelItem name="Music Lounge"  members={8} />
        </Flex>
      </Grid>

      {/* ── BOTTOM PROMO BANNER ── */}
      <Card
        rounded="2xl"
        bgGradient="linear(135deg, purple.600, brand.600)"
        border="none"
        overflow="hidden"
      >
        <CardBody>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Box>
              <Heading color="white" size="md">Love Matrix Bot?</Heading>
              <Text color="whiteAlpha.800" fontSize="sm" mt={1}>
                Help us grow by voting on Top.gg and inviting us to more servers!
              </Text>
            </Box>
            <HStack gap={2}>
              <Button
                as={Link}
                href={VOTE_URL}
                target="_blank"
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: 'whiteAlpha.300' }}
                leftIcon={<BsStarFill />}
                rounded="xl"
                size="sm"
              >
                Vote on Top.gg
              </Button>
              <Button
                as={Link}
                href={INVITE_URL}
                target="_blank"
                bg="white"
                color="brand.600"
                _hover={{ bg: 'whiteAlpha.900' }}
                leftIcon={<FaRobot />}
                rounded="xl"
                size="sm"
              >
                Invite Bot
              </Button>
            </HStack>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}

// ── SUB COMPONENTS ─────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color, helpText }: {
  icon: any; label: string; value: string; color: string; helpText: string;
}) {
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

function FeatureCard({ icon, label, color, badge }: {
  icon: any; label: string; color: string; badge: string;
}) {
  return (
    <Card variant="primary" rounded="2xl" cursor="pointer" _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
      <CardBody as={Center} flexDirection="column" gap={2} p={4} textAlign="center">
        <Circle p={3} bg="brandAlpha.100">
          <Icon as={icon} color={color} w={6} h={6} />
        </Circle>
        <Text fontWeight="semibold" fontSize="sm">{label}</Text>
        <Badge colorScheme="brand" rounded="full" fontSize="xs">{badge}</Badge>
      </CardBody>
    </Card>
  );
}

function QuickActionBtn({ href, icon, label, color }: {
  href: string; icon: any; label: string; color: string;
}) {
  return (
    <Button
      as={Link}
      href={href}
      target="_blank"
      variant="ghost"
      justifyContent="flex-start"
      leftIcon={<Icon as={icon} />}
      colorScheme={color}
      rounded="xl"
      size="sm"
      w="full"
    >
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
        xaxis: {
          categories: ['NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR'],
        },
        legend: { position: 'top' },
        stroke: { curve: 'smooth', width: 3 },
        responsive: [
          {
            breakpoint: 650,
            options: { legend: { position: 'bottom' } },
          },
        ],
      }}
      series={[
        { name: 'Moderation', data: [120, 145, 98, 180, 160, 210] },
        { name: 'Levels',     data: [80,  110, 75, 130, 115, 170] },
        { name: 'Music',      data: [40,  60,  45,  80,  70,  95] },
      ]}
      height="280"
      type="area"
    />
  );
}

function VoiceChannelItem({ name, members }: { name: string; members: number }) {
  return (
    <Card rounded="2xl" variant="primary">
      <CardHeader as={HStack}>
        <Icon as={MdVoiceChat} color="brand.400" fontSize={{ base: '2xl', md: '3xl' }} />
        <Box>
          <Text fontWeight="semibold" fontSize="sm">{name}</Text>
          <Text color="TextSecondary" fontSize="xs">{members} Members</Text>
        </Box>
      </CardHeader>
    </Card>
  );
}
