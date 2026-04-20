import {
  Badge, Box, Button, Card, CardBody, CardHeader, Divider,
  Flex, FormControl, FormLabel, Heading, HStack, Icon,
  NumberInput, NumberInputField, Select, SimpleGrid, Switch,
  Text, useToast, VStack, Spinner,
} from '@chakra-ui/react';
import { useRouter }                    from 'next/router';
import { useFeatureQuery, useUpdateFeatureMutation, useEnableFeatureMutation, useGuildChannelsQuery, useGuildRolesQuery } from '@/api/hooks';
import getGuildLayout                   from '@/components/layout/guild/get-guild-layout';
import { NextPageWithLayout }           from '@/pages/_app';
import { ModerationFeature }            from '@/config/types/custom-types';
import { RiSwordFill }                  from 'react-icons/ri';
import { ChannelTypes }                 from '@/api/discord';

const ModerationPage: NextPageWithLayout = () => {
  const { guild } = useRouter().query as { guild: string };
  const query     = useFeatureQuery(guild, 'moderation');
  const enable    = useEnableFeatureMutation();
  const update    = useUpdateFeatureMutation();
  const channels  = useGuildChannelsQuery(guild);
  const roles     = useGuildRolesQuery(guild);
  const toast     = useToast();

  if (query.isLoading) return <Flex justify="center" align="center" h="200px"><Spinner /></Flex>;

  if (query.isError)
    return (
      <Flex direction="column" align="center" gap={4} py={10}>
        <Icon as={RiSwordFill} boxSize={12} color="TextSecondary" />
        <Heading size="md">Moderation Not Enabled</Heading>
        <Button colorScheme="brand" isLoading={enable.isLoading}
          onClick={() => enable.mutate({ enabled: true, guild, feature: 'moderation' })}>
          Enable Moderation
        </Button>
      </Flex>
    );

  const data: ModerationFeature = query.data ?? {};
  const textChs = (channels.data ?? []).filter(c => c.type === ChannelTypes.GUILD_TEXT);

  async function save(patch: Partial<ModerationFeature>) {
    try {
      await update.mutateAsync({ guild, feature: 'moderation', options: JSON.stringify({ ...data, ...patch }) });
      toast({ title: '✅ Saved!', status: 'success', duration: 2000, isClosable: true });
    } catch {
      toast({ title: '❌ Failed to save', status: 'error', duration: 3000, isClosable: true });
    }
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">🛡️ Moderation</Heading>
          <Text color="TextSecondary" mt={1}>Configure ban, kick, mute and warning systems.</Text>
        </Box>
        <HStack>
          <Text fontSize="sm" color="TextSecondary">Enabled</Text>
          <Switch isChecked={data.enabled ?? true} colorScheme="brand"
            onChange={e => save({ enabled: e.target.checked })} />
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">📋 Log Channel</Heading></CardHeader>
          <CardBody pt={0}>
            <FormControl>
              <FormLabel fontSize="sm">Mod Log Channel</FormLabel>
              <Select size="sm" rounded="lg" placeholder="Select a channel"
                value={data.log_channel ?? ''}
                onChange={e => save({ log_channel: e.target.value })}>
                {textChs.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}
              </Select>
            </FormControl>
          </CardBody>
        </Card>

        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">🔇 Mute Role</Heading></CardHeader>
          <CardBody pt={0}>
            <FormControl>
              <FormLabel fontSize="sm">Mute Role</FormLabel>
              <Select size="sm" rounded="lg" placeholder="Select a role"
                value={data.mute_role ?? ''}
                onChange={e => save({ mute_role: e.target.value })}>
                {(roles.data ?? []).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Select>
            </FormControl>
          </CardBody>
        </Card>

        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">⚠️ Auto Warning Threshold</Heading></CardHeader>
          <CardBody pt={0} as={VStack} align="stretch" gap={3}>
            <FormControl>
              <FormLabel fontSize="sm">Warns before action</FormLabel>
              <NumberInput size="sm" min={1} max={20} defaultValue={data.warn_threshold ?? 3}
                onBlur={e => save({ warn_threshold: Number(e.target.value) })}>
                <NumberInputField rounded="lg" />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Action on threshold</FormLabel>
              <Select size="sm" rounded="lg" value={data.warn_action ?? 'mute'}
                onChange={e => save({ warn_action: e.target.value as any })}>
                <option value="mute">Mute</option>
                <option value="kick">Kick</option>
                <option value="ban">Ban</option>
              </Select>
            </FormControl>
          </CardBody>
        </Card>

        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">🐌 Auto Slowmode</Heading></CardHeader>
          <CardBody pt={0}>
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="600" fontSize="sm">Auto Slowmode</Text>
                <Text fontSize="xs" color="TextSecondary">Enable slowmode when spam is detected</Text>
              </Box>
              <Switch isChecked={data.auto_slowmode ?? false} colorScheme="brand"
                onChange={e => save({ auto_slowmode: e.target.checked })} />
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

ModerationPage.getLayout = c => getGuildLayout({ children: c, back: true });
export default ModerationPage;
