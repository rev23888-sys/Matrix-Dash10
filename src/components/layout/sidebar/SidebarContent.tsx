import {
  Avatar,
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Stack,
  Text,
  Tooltip,
  VStack,
  Badge,
  Button,
} from '@chakra-ui/react';
import { useActiveSidebarItem, SidebarItemInfo } from '@/utils/router';
import { useGuilds, useSelfUserQuery } from '@/api/hooks';
import { SearchBar } from '@/components/forms/SearchBar';
import { useMemo, useState } from 'react';
import { config } from '@/config/common';
import { FiSettings as SettingsIcon } from 'react-icons/fi';
import { FaBars, FaRobot } from 'react-icons/fa';
import { BsShieldFillCheck, BsDiscord, BsStarFill } from 'react-icons/bs';
import { IoServer } from 'react-icons/io5';
import { avatarUrl, iconUrl, PermissionFlags, Guild } from '@/api/discord';
import { GuildItem, GuildItemsSkeleton } from './GuildItem';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SidebarItem } from './SidebarItem';
import items from '@/config/sidebar-items';

const INVITE_URL  = 'https://tinyurl.com/Invite-Matrix';
const SUPPORT_URL = 'https://discord.gg/yAZxdHeJFF';
const VOTE_URL    = 'https://top.gg/bot/1409860321295732808/vote';

function isOwner(guild: Guild): boolean {
  const perms = BigInt(guild.permissions ?? '0');
  // @ts-ignore
  return guild.owner === true || (perms & BigInt(PermissionFlags.ADMINISTRATOR)) !== BigInt(0);
}

export function SidebarContent() {
  const [filter, setFilter]   = useState('');
  const [showLinks, setShowLinks] = useState(false);
  const guilds = useGuilds();
  const { guild: selectedGroup } = useRouter().query as { guild: string };

  const filteredGuilds = useMemo(
    () =>
      guilds.data?.filter((guild) => {
        const contains = guild.name.toLowerCase().includes(filter.toLowerCase());
        return config.guild.filter(guild) && contains;
      }),
    [guilds.data, filter]
  );

  const owned   = filteredGuilds?.filter(isOwner)    ?? [];
  const adminOf = filteredGuilds?.filter((g) => !isOwner(g)) ?? [];

  return (
    <>
      {/* ── HEADER with hamburger ── */}
      <HStack py="1.5rem" mx={3} bg="Brand" rounded="xl" px={4} justify="space-between">
        <Heading size="md" fontWeight={700} color="white" noOfLines={1}>
          {config.name}
        </Heading>
        {/* Hamburger three-line menu */}
        <Tooltip label="Quick Links">
          <IconButton
            icon={<FaBars />}
            aria-label="Quick links"
            size="sm"
            variant="ghost"
            color="whiteAlpha.800"
            _hover={{ color: 'white', bg: 'whiteAlpha.200' }}
            onClick={() => setShowLinks((p) => !p)}
          />
        </Tooltip>
      </HStack>

      {/* ── COLLAPSIBLE QUICK LINKS ── */}
      {showLinks && (
        <Box mx={3} mb={2}>
          <Card rounded="xl" bg="brandAlpha.100" border="1px solid" borderColor="brandAlpha.200">
            <CardBody p={2}>
              <VStack align="stretch" gap={1} fontSize="xs">
                <Button as="a" href={INVITE_URL} target="_blank" size="xs" variant="ghost" colorScheme="brand" leftIcon={<FaRobot />} justifyContent="flex-start">
                  Invite Matrix Bot
                </Button>
                <Button as="a" href={SUPPORT_URL} target="_blank" size="xs" variant="ghost" colorScheme="blue" leftIcon={<BsDiscord />} justifyContent="flex-start">
                  Support Server
                </Button>
                <Button as="a" href={VOTE_URL} target="_blank" size="xs" variant="ghost" colorScheme="yellow" leftIcon={<BsStarFill />} justifyContent="flex-start">
                  Vote on Top.gg
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      )}

      <Stack direction="column" mb="auto" flex={1} overflowY="auto">
        <Items />

        <Box px="10px">
          <SearchBar
            w="full"
            input={{ value: filter, onChange: (e) => setFilter(e.target.value) }}
          />
        </Box>

        <Flex direction="column" px="10px" gap={1}>
          {/* Owned servers section */}
          {filteredGuilds == null ? (
            <GuildItemsSkeleton />
          ) : (
            <>
              {owned.length > 0 && (
                <>
                  <HStack px={1} py={1} gap={1}>
                    <Icon as={BsShieldFillCheck} color="brand.400" boxSize={3} />
                    <Text fontSize="10px" fontWeight="700" color="TextSecondary" textTransform="uppercase" letterSpacing="wider">
                      Your Servers
                    </Text>
                  </HStack>
                  {owned.map((guild) => (
                    <GuildItem key={guild.id} guild={guild} active={selectedGroup === guild.id} href={`/guilds/${guild.id}`} />
                  ))}
                </>
              )}

              {adminOf.length > 0 && (
                <>
                  <HStack px={1} py={1} mt={1} gap={1}>
                    <Icon as={IoServer} color="green.400" boxSize={3} />
                    <Text fontSize="10px" fontWeight="700" color="TextSecondary" textTransform="uppercase" letterSpacing="wider">
                      Admin Servers
                    </Text>
                  </HStack>
                  {adminOf.map((guild) => (
                    <GuildItem key={guild.id} guild={guild} active={selectedGroup === guild.id} href={`/guilds/${guild.id}`} />
                  ))}
                </>
              )}

              {owned.length === 0 && adminOf.length === 0 && filter === '' && (
                <Text fontSize="xs" color="TextSecondary" textAlign="center" py={3}>
                  No servers found
                </Text>
              )}
            </>
          )}
        </Flex>
      </Stack>
    </>
  );
}

export function BottomCard() {
  const user = useSelfUserQuery().data;
  if (user == null) return <></>;

  return (
    <Card pos="sticky" left={0} bottom={0} w="full" py={2}>
      <CardBody as={HStack}>
        <Avatar src={avatarUrl(user)} name={user.username} size="sm" />
        <Box flex={1} minW={0}>
          <Text fontWeight="600" fontSize="sm" noOfLines={1}>{user.username}</Text>
          <Text fontSize="xs" color="TextSecondary">#{user.discriminator}</Text>
        </Box>
        <Spacer />
        <Tooltip label="Settings">
          <Link href="/user/profile">
            <IconButton icon={<SettingsIcon />} aria-label="settings" size="sm" variant="ghost" />
          </Link>
        </Tooltip>
      </CardBody>
    </Card>
  );
}

function Items() {
  const active = useActiveSidebarItem();
  return (
    <Flex direction="column" px="10px" gap={0}>
      {items
        .filter((item) => !item.hidden)
        .map((route: SidebarItemInfo, index: number) => (
          <SidebarItem key={index} href={route.path} name={route.name} icon={route.icon} active={active === route} />
        ))}
    </Flex>
  );
}
