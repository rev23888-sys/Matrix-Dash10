import {
  Box, Button, Card, CardBody, CardHeader, Flex, FormControl, FormLabel,
  Heading, HStack, Icon, Select, SimpleGrid, Switch, Text, useToast, Spinner,
} from '@chakra-ui/react';
import { useRouter }                    from 'next/router';
import { useFeatureQuery, useUpdateFeatureMutation, useEnableFeatureMutation, useGuildChannelsQuery } from '@/api/hooks';
import getGuildLayout                   from '@/components/layout/guild/get-guild-layout';
import { NextPageWithLayout }           from '@/pages/_app';
import { LoggingFeature }               from '@/config/types/custom-types';
import { MdBarChart }                   from 'react-icons/md';
import { ChannelTypes }                 from '@/api/discord';

type LogChannel = { key: keyof LoggingFeature; label: string; desc: string; emoji: string };
const LOG_CHANNELS: LogChannel[] = [
  { key: 'member_log',  label: 'Member Log',  desc: 'Joins, leaves, bans, unbans',     emoji: '👤' },
  { key: 'message_log', label: 'Message Log', desc: 'Edits, deletes, bulk deletes',    emoji: '💬' },
  { key: 'mod_log',     label: 'Mod Log',     desc: 'Kicks, mutes, warns, bans',       emoji: '🛡️' },
  { key: 'voice_log',   label: 'Voice Log',   desc: 'Voice join/leave/move/mute',      emoji: '🔊' },
  { key: 'server_log',  label: 'Server Log',  desc: 'Channels, roles, server changes', emoji: '⚙️' },
  { key: 'invite_log',  label: 'Invite Log',  desc: 'Invite created/deleted',          emoji: '📨' },
];

const LoggingPage: NextPageWithLayout = () => {
  const { guild } = useRouter().query as { guild: string };
  const query     = useFeatureQuery(guild, 'logging');
  const enable    = useEnableFeatureMutation();
  const update    = useUpdateFeatureMutation();
  const channels  = useGuildChannelsQuery(guild);
  const toast     = useToast();

  if (query.isLoading) return <Flex justify="center" align="center" h="200px"><Spinner /></Flex>;

  if (query.isError)
    return (
      <Flex direction="column" align="center" gap={4} py={10}>
        <Icon as={MdBarChart} boxSize={12} color="TextSecondary" />
        <Heading size="md">Logging Not Enabled</Heading>
        <Button colorScheme="brand" isLoading={enable.isLoading}
          onClick={() => enable.mutate({ enabled: true, guild, feature: 'logging' })}>
          Enable Logging
        </Button>
      </Flex>
    );

  const data: LoggingFeature = query.data ?? {};
  const textChs = (channels.data ?? []).filter(c => c.type === ChannelTypes.GUILD_TEXT);

  async function save(patch: Partial<LoggingFeature>) {
    try {
      await update.mutateAsync({ guild, feature: 'logging', options: JSON.stringify({ ...data, ...patch }) });
      toast({ title: '✅ Saved!', status: 'success', duration: 2000, isClosable: true });
    } catch {
      toast({ title: '❌ Failed to save', status: 'error', duration: 3000, isClosable: true });
    }
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">📋 Server Logging</Heading>
          <Text color="TextSecondary" mt={1}>Log all server events to specific channels.</Text>
        </Box>
        <HStack>
          <Text fontSize="sm" color="TextSecondary">Enabled</Text>
          <Switch isChecked={data.enabled ?? false} colorScheme="brand"
            onChange={e => save({ enabled: e.target.checked })} />
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        {LOG_CHANNELS.map(lc => (
          <Card key={lc.key} variant="primary" rounded="xl">
            <CardHeader pb={2}>
              <Heading size="sm">{lc.emoji} {lc.label}</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <Text fontSize="xs" color="TextSecondary" mb={3}>{lc.desc}</Text>
              <Select size="sm" rounded="lg" placeholder="Disabled"
                value={(data as any)[lc.key] ?? ''}
                onChange={e => save({ [lc.key]: e.target.value || undefined } as any)}>
                {textChs.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}
              </Select>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

LoggingPage.getLayout = c => getGuildLayout({ children: c, back: true });
export default LoggingPage;
