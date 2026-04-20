import {
  Avatar, Badge, Box, Card, CardBody, CardHeader, Flex, Heading,
  HStack, Icon, Select, SimpleGrid, Skeleton, Stat, StatLabel,
  StatNumber, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack,
} from '@chakra-ui/react';
import { useRouter }           from 'next/router';
import { NextPageWithLayout }  from '@/pages/_app';
import getGuildLayout          from '@/components/layout/guild/get-guild-layout';
import { FaTrophy, FaCoins }   from 'react-icons/fa';
import { MdMessage, MdPerson } from 'react-icons/md';
import { BsStarFill }          from 'react-icons/bs';
import { useQuery }            from '@tanstack/react-query';
import { useSession }          from '@/utils/auth/hooks';

type LbEntry = {
  userId:       string;
  username:     string;
  avatar?:      string;
  level?:       number;
  messages?:    number;
  balance?:     number;
  invites?:     number;
};

function useLb(guild: string, type: string) {
  const { session } = useSession();
  return useQuery<LbEntry[]>(
    ['leaderboard', guild, type],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/guilds/${guild}/leaderboard/${type}`,
        { headers: { Authorization: `${session?.token_type} ${session?.access_token}` } }
      );
      if (!res.ok) {
        // Return mock data if API not set up yet
        return Array.from({ length: 10 }, (_, i) => ({
          userId:   String(100000000000000000n + BigInt(i)),
          username: `User ${i + 1}`,
          level:    Math.max(1, 10 - i),
          messages: Math.max(10, (10 - i) * 150 + Math.floor(Math.random() * 50)),
          balance:  Math.max(100, (10 - i) * 5000 + Math.floor(Math.random() * 1000)),
          invites:  Math.max(0, (10 - i) * 5 + Math.floor(Math.random() * 10)),
        }));
      }
      return res.json();
    },
    { enabled: !!session, staleTime: 30_000, retry: false }
  );
}

const MEDALS = ['🥇', '🥈', '🥉', '4', '5', '6', '7', '8', '9', '10'];

const LeaderboardPage: NextPageWithLayout = () => {
  const { guild } = useRouter().query as { guild: string };

  return (
    <Flex direction="column" gap={6}>
      <Box>
        <Heading size="lg">🏆 Leaderboards</Heading>
        <Text color="TextSecondary" mt={1}>Top members of this server across all categories.</Text>
      </Box>

      <Tabs colorScheme="brand" variant="soft-rounded">
        <TabList gap={2} flexWrap="wrap">
          <Tab>⭐ Levels</Tab>
          <Tab>💬 Messages</Tab>
          <Tab>💰 Economy</Tab>
          <Tab>📨 Invites</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}><LbTable guild={guild} type="levels"   valueKey="level"    label="Level"   icon={BsStarFill}   color="brand.400" /></TabPanel>
          <TabPanel px={0}><LbTable guild={guild} type="messages" valueKey="messages" label="Messages" icon={MdMessage}   color="blue.400" /></TabPanel>
          <TabPanel px={0}><LbTable guild={guild} type="economy"  valueKey="balance"  label="Coins"    icon={FaCoins}     color="yellow.400" /></TabPanel>
          <TabPanel px={0}><LbTable guild={guild} type="invites"  valueKey="invites"  label="Invites"  icon={MdPerson}    color="green.400" /></TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

function LbTable({ guild, type, valueKey, label, icon, color }: {
  guild: string; type: string; valueKey: keyof LbEntry;
  label: string; icon: any; color: string;
}) {
  const { data, isLoading } = useLb(guild, type);

  if (isLoading)
    return <VStack align="stretch" gap={2}>{[...Array(10)].map((_, i) => <Skeleton key={i} h="60px" rounded="xl" />)}</VStack>;

  return (
    <VStack align="stretch" gap={2}>
      {(data ?? []).map((entry, i) => (
        <Card key={entry.userId} variant="primary" rounded="xl"
          bg={i === 0 ? 'brandAlpha.100' : undefined}
          borderColor={i === 0 ? 'brand.400' : 'transparent'}
          border="1px solid">
          <CardBody py={3}>
            <HStack gap={3}>
              <Text fontSize="xl" w="30px" textAlign="center" fontWeight="bold">
                {i < 3 ? MEDALS[i] : `${i + 1}`}
              </Text>
              <Avatar size="sm" name={entry.username} src={entry.avatar ? `https://cdn.discordapp.com/avatars/${entry.userId}/${entry.avatar}` : undefined} />
              <Text fontWeight="600" flex={1} noOfLines={1}>{entry.username}</Text>
              <HStack gap={1}>
                <Icon as={icon} color={color} boxSize={4} />
                <Text fontWeight="700" color={color}>
                  {typeof entry[valueKey] === 'number' ? Number(entry[valueKey]).toLocaleString() : entry[valueKey]}
                </Text>
                <Text fontSize="xs" color="TextSecondary">{label}</Text>
              </HStack>
            </HStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
}

LeaderboardPage.getLayout = c => getGuildLayout({ children: c, back: true });
export default LeaderboardPage;
