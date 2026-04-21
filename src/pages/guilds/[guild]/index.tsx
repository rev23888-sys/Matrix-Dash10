import {
  Avatar, Badge, Box, Button, Card, CardBody, CardHeader, Center,
  Flex, Grid, Heading, HStack, Icon, SimpleGrid, Spinner, Text,
  VStack,
} from '@chakra-ui/react';
import { LoadingPanel }          from '@/components/panel/LoadingPanel';
import { QueryStatus }           from '@/components/panel/QueryPanel';
import { config }                from '@/config/common';
import { guild as view }         from '@/config/translations/guild';
import { BsMailbox }             from 'react-icons/bs';
import { FaRobot, FaCog }        from 'react-icons/fa';
import { MdAttachMoney, MdBarChart, MdLeaderboard, MdMessage, MdOutlineGames, MdSecurity } from 'react-icons/md';
import { RiSwordFill }           from 'react-icons/ri';
import { BsShieldFillCheck }     from 'react-icons/bs';
import { FaTicketAlt }           from 'react-icons/fa';
import { IoSettings }            from 'react-icons/io5';
import { useGuildInfoQuery }     from '@/api/hooks';
import { useRouter }             from 'next/router';
import { Banner }                from '@/components/GuildBanner';
import { FeatureItem }           from '@/components/feature/FeatureItem';
import { getFeatures }           from '@/utils/common';
import type { CustomGuildInfo }  from '@/config/types/custom-types';
import { NextPageWithLayout }    from '@/pages/_app';
import getGuildLayout            from '@/components/layout/guild/get-guild-layout';
import Link                      from 'next/link';

// Quick-access panels shown at top of guild dashboard
type QuickPanel = { label: string; desc: string; icon: any; color: string; path: string };
const QUICK_PANELS: QuickPanel[] = [
  { label: 'Settings',    desc: 'Prefix, roles, channels',     icon: IoSettings,        color: 'brand.400', path: 'settings' },
  { label: 'Welcome',     desc: 'Greet new members',           icon: MdMessage,         color: 'teal.400',  path: 'welcome' },
  { label: 'Moderation',  desc: 'Bans, kicks, warns',          icon: RiSwordFill,       color: 'red.400',   path: 'moderation' },
  { label: 'Anti-Nuke',   desc: 'Protect from raids',          icon: BsShieldFillCheck, color: 'orange.400',path: 'antinuke' },
  { label: 'AutoMod',     desc: 'Auto-filter content',         icon: MdSecurity,        color: 'yellow.400',path: 'automod' },
  { label: 'Logging',     desc: 'Log all events',              icon: MdBarChart,        color: 'blue.400',  path: 'logging' },
  { label: 'Economy',     desc: 'Coins, shop, rewards',        icon: MdAttachMoney,     color: 'green.400', path: 'economy' },
  { label: 'Leaderboard', desc: 'Top members & ranking',       icon: MdLeaderboard,     color: 'purple.400',path: 'leaderboard' },
  { label: 'Games',       desc: 'Play & earn coins',           icon: MdOutlineGames,    color: 'pink.400',  path: 'games' },
  { label: 'Tickets',     desc: 'Support ticket system',       icon: FaTicketAlt,       color: 'cyan.400',  path: 'tickets' },
];

const GuildPage: NextPageWithLayout = () => {
  const t     = view.useTranslations();
  const guild = useRouter().query.guild as string;
  const query = useGuildInfoQuery(guild);

  return (
    <QueryStatus query={query} loading={<LoadingPanel />} error={t.error.load}>
      {query.data != null
        ? <GuildPanel guild={guild} info={query.data} />
        : <NotJoined guild={guild} />}
    </QueryStatus>
  );
};

function GuildPanel({ guild: id, info }: { guild: string; info: CustomGuildInfo }) {
  const t = view.useTranslations();

  return (
    <Flex direction="column" gap={6}>
      <Banner />

      {/* Quick Access Grid */}
      <Box>
        <Heading size="md" mb={3}>⚡ Quick Access</Heading>
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, xl: 5 }} gap={3}>
          {QUICK_PANELS.map(p => (
            <Card key={p.path} as={Link} href={`/guilds/${id}/${p.path}`}
              variant="primary" rounded="xl" cursor="pointer"
              _hover={{ transform: 'translateY(-2px)', shadow: 'md', transition: 'all 0.15s' }}>
              <CardBody as={Flex} direction="column" align="center" gap={2} p={4} textAlign="center">
                <Icon as={p.icon} color={p.color} boxSize={6} />
                <Text fontWeight="700" fontSize="sm">{p.label}</Text>
                <Text fontSize="10px" color="TextSecondary" noOfLines={1}>{p.desc}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      {/* Enabled features toggle list */}
      <Box>
        <Heading size="md" mb={3}>{t.features}</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, '2xl': 3 }} gap={3}>
          {getFeatures().map(feature => (
            <FeatureItem
              key={feature.id}
              guild={id}
              feature={feature}
              enabled={info.enabledFeatures.includes(feature.id)}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}

function NotJoined({ guild }: { guild: string }) {
  const t = view.useTranslations();
  return (
    <Center flexDirection="column" gap={3} h="full" p={5}>
      <Icon as={BsMailbox} w={50} h={50} />
      <Text fontSize="xl" fontWeight="600">{t.error['not found']}</Text>
      <Text textAlign="center" color="TextSecondary">{t.error['not found description']}</Text>
      <Button variant="action" leftIcon={<FaRobot />} px={6} as="a"
        href={`${config.inviteUrl}&guild_id=${guild}`} target="_blank">
        {t.bn.invite}
      </Button>
    </Center>
  );
}

GuildPage.getLayout = c => getGuildLayout({ children: c });
export default GuildPage;
