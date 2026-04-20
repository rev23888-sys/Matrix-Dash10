import {
  Avatar, Badge, Box, Button, Card, CardBody, CardHeader,
  Center, Flex, Heading, HStack, Icon, SimpleGrid, Skeleton,
  Text, Tooltip, VStack, Divider, Spinner, useToast,
} from '@chakra-ui/react';
import { config } from '@/config/common';
import { useGuilds, useGuildInfoQuery } from '@/api/hooks';
import HomeView from '@/config/example/HomeView';
import { NextPageWithLayout } from '@/pages/_app';
import AppLayout from '@/components/layout/app';
import { iconUrl, Guild, PermissionFlags } from '@/api/discord';
import Link from 'next/link';
import { FaRobot, FaCog } from 'react-icons/fa';
import { BsShieldFillCheck } from 'react-icons/bs';
import { IoServer, IoRefresh } from 'react-icons/io5';
import { useState } from 'react';

const INVITE_BASE = `https://discord.com/oauth2/authorize?client_id=${
  process.env.NEXT_PUBLIC_BOT_CLIENT_ID ?? '1492819533050806282'
}&scope=bot+applications.commands&permissions=8`;

function hasManagePerms(guild: Guild): boolean {
  const perms = BigInt(guild.permissions ?? '0');
  const admin  = (perms & BigInt(PermissionFlags.ADMINISTRATOR)) !== BigInt(0);
  const manage = (perms & BigInt(PermissionFlags.MANAGE_GUILD))  !== BigInt(0);
  return admin || manage;
}

function isOwner(guild: Guild): boolean {
  // @ts-ignore — owner field returned by Discord when scope includes guilds.members.read
  return guild.owner === true;
}

// ── EXPORTED — used in HomeView too ─────────────────────────────────────
export function GuildSelect() {
  const guilds = useGuilds();

  if (guilds.isLoading)
    return (
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={3}>
        {[...Array(6)].map((_, i) => <Skeleton key={i} minH="90px" rounded="2xl" />)}
      </SimpleGrid>
    );

  if (guilds.isError)
    return (
      <Flex direction="column" align="center" gap={3} py={6}>
        <Text color="red.400" fontWeight="600">Failed to load servers</Text>
        <Button size="sm" leftIcon={<IoRefresh />} onClick={() => guilds.refetch()}>Retry</Button>
      </Flex>
    );

  const manageable = (guilds.data ?? []).filter(hasManagePerms);
  const owned      = manageable.filter(isOwner);
  const adminOf    = manageable.filter((g) => !isOwner(g));

  if (manageable.length === 0)
    return <Text color="TextSecondary" fontSize="sm">No servers found where you have admin/manage permissions.</Text>;

  return (
    <VStack align="stretch" gap={5}>
      {owned.length > 0 && (
        <Box>
          <HStack mb={3} gap={2}>
            <Icon as={BsShieldFillCheck} color="brand.400" boxSize={4} />
            <Heading size="sm" color="TextSecondary">Your Servers ({owned.length})</Heading>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={3}>
            {owned.map((g) => <GuildCard key={g.id} guild={g} />)}
          </SimpleGrid>
        </Box>
      )}
      {adminOf.length > 0 && (
        <Box>
          <HStack mb={3} gap={2}>
            <Icon as={IoServer} color="green.400" boxSize={4} />
            <Heading size="sm" color="TextSecondary">Admin Servers ({adminOf.length})</Heading>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={3}>
            {adminOf.map((g) => <GuildCard key={g.id} guild={g} />)}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
}

// ── SMART GUILD CARD — detects bot presence ──────────────────────────────
function GuildCard({ guild }: { guild: Guild }) {
  // Query the bot API for this guild — null means bot is NOT in it
  const info = useGuildInfoQuery(guild.id);
  const botPresent = info.data != null && !info.isError;
  const inviteUrl  = `${INVITE_BASE}&guild_id=${guild.id}`;
  const manageUrl  = `/guilds/${guild.id}`;

  return (
    <Card variant="primary" rounded="2xl" overflow="hidden" transition="all 0.2s" _hover={{ shadow: 'md' }}>
      {/* Bot status stripe */}
      <Box h="3px" bg={info.isLoading ? 'gray.500' : botPresent ? 'green.400' : 'orange.400'} />

      <CardHeader as={Flex} flexDirection="row" gap={3} align="center" pb={2} pt={3}>
        <Avatar
          src={guild.icon ? iconUrl(guild) : undefined}
          name={guild.name}
          size="md"
          rounded="xl"
          bg="brandAlpha.200"
        />
        <Box flex="1" minW={0}>
          <Text fontWeight="700" fontSize="sm" noOfLines={1}>{guild.name}</Text>
          <HStack gap={1} mt="2px" flexWrap="wrap">
            {isOwner(guild)   && <Badge colorScheme="brand"  fontSize="9px" rounded="full" px={2}>Owner</Badge>}
            {!isOwner(guild)  && <Badge colorScheme="green"  fontSize="9px" rounded="full" px={2}>Admin</Badge>}
            {info.isLoading   && <Badge colorScheme="gray"   fontSize="9px" rounded="full" px={2}>Checking...</Badge>}
            {!info.isLoading && botPresent  && <Badge colorScheme="green"  fontSize="9px" rounded="full" px={2}>✓ Bot Active</Badge>}
            {!info.isLoading && !botPresent && <Badge colorScheme="orange" fontSize="9px" rounded="full" px={2}>Bot Not Added</Badge>}
          </HStack>
        </Box>
      </CardHeader>

      <CardBody pt={0} pb={3}>
        <HStack gap={2}>
          {botPresent ? (
            <Button
              as={Link} href={manageUrl}
              size="sm" colorScheme="brand"
              leftIcon={<FaCog />}
              flex={1} rounded="lg"
            >
              Manage
            </Button>
          ) : (
            <>
              <Button
                as="a" href={inviteUrl} target="_blank"
                size="sm" colorScheme="orange" variant="solid"
                leftIcon={<FaRobot />}
                flex={1} rounded="lg"
              >
                Invite Bot
              </Button>
              <Button
                as={Link} href={manageUrl}
                size="sm" variant="outline" colorScheme="brand"
                leftIcon={<FaCog />}
                flex={1} rounded="lg"
              >
                Manage
              </Button>
            </>
          )}
        </HStack>
      </CardBody>
    </Card>
  );
}

const HomePage: NextPageWithLayout = () => <HomeView />;
HomePage.getLayout = (c) => <AppLayout>{c}</AppLayout>;
export default HomePage;
