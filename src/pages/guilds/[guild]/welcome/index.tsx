import {
  Badge, Box, Button, Card, CardBody, CardHeader, Divider,
  Flex, FormControl, FormLabel, Heading, HStack, Icon,
  Input, NumberInput, NumberInputField, SimpleGrid, Switch,
  Text, Textarea, useToast, VStack, Spinner, Select,
} from '@chakra-ui/react';
import { useRouter }                    from 'next/router';
import { useFeatureQuery, useUpdateFeatureMutation, useEnableFeatureMutation, useGuildChannelsQuery } from '@/api/hooks';
import getGuildLayout                   from '@/components/layout/guild/get-guild-layout';
import { NextPageWithLayout }           from '@/pages/_app';
import { WelcomeMessageFeature }        from '@/config/types/custom-types';
import { MdMessage, MdWavingHand }      from 'react-icons/md';
import { ChannelTypes }                 from '@/api/discord';

const VARS = ['{user}', '{server}', '{membercount}', '{user.mention}', '{user.id}'];

const WelcomePage: NextPageWithLayout = () => {
  const { guild } = useRouter().query as { guild: string };
  const query     = useFeatureQuery(guild, 'welcome-message');
  const enable    = useEnableFeatureMutation();
  const update    = useUpdateFeatureMutation();
  const channels  = useGuildChannelsQuery(guild);
  const toast     = useToast();

  if (query.isLoading) return <Flex justify="center" align="center" h="200px"><Spinner /></Flex>;

  if (query.isError)
    return (
      <Flex direction="column" align="center" gap={4} py={10}>
        <Icon as={MdMessage} boxSize={12} color="TextSecondary" />
        <Heading size="md">Welcome Messages Not Enabled</Heading>
        <Text color="TextSecondary">Enable welcome messages to greet new members.</Text>
        <Button colorScheme="brand" isLoading={enable.isLoading}
          onClick={() => enable.mutate({ enabled: true, guild, feature: 'welcome-message' })}>
          Enable Welcome Messages
        </Button>
      </Flex>
    );

  const data: WelcomeMessageFeature = query.data ?? { message: 'Welcome {user.mention} to **{server}**!' };
  const textChannels = (channels.data ?? []).filter(c => c.type === ChannelTypes.GUILD_TEXT);

  async function save(patch: Partial<WelcomeMessageFeature>) {
    try {
      await update.mutateAsync({ guild, feature: 'welcome-message', options: JSON.stringify({ ...data, ...patch }) });
      toast({ title: '✅ Saved!', status: 'success', duration: 2000, isClosable: true });
    } catch {
      toast({ title: '❌ Failed to save', status: 'error', duration: 3000, isClosable: true });
    }
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">👋 Welcome Messages</Heading>
          <Text color="TextSecondary" mt={1}>Greet new members with a custom message.</Text>
        </Box>
        <HStack>
          <Text fontSize="sm" color="TextSecondary">Enabled</Text>
          <Switch isChecked={data.enabled ?? true} colorScheme="brand"
            onChange={e => save({ enabled: e.target.checked })} />
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {/* Channel */}
        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">📋 Channel</Heading></CardHeader>
          <CardBody pt={0} as={VStack} align="stretch" gap={3}>
            <FormControl>
              <FormLabel fontSize="sm">Welcome Channel</FormLabel>
              <Select size="sm" rounded="lg" placeholder="Select a channel"
                value={data.channel ?? ''}
                onChange={e => save({ channel: e.target.value })}>
                {textChannels.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Auto-delete after (seconds, 0 = never)</FormLabel>
              <NumberInput size="sm" min={0} defaultValue={data.autodelete ?? 0}
                onBlur={e => save({ autodelete: Number(e.target.value) })}>
                <NumberInputField rounded="lg" />
              </NumberInput>
            </FormControl>
          </CardBody>
        </Card>

        {/* Embed */}
        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">🎨 Embed Style</Heading></CardHeader>
          <CardBody pt={0} as={VStack} align="stretch" gap={3}>
            <FormControl>
              <FormLabel fontSize="sm">Embed Title</FormLabel>
              <Input size="sm" rounded="lg" placeholder="Welcome!" defaultValue={data.embedTitle ?? ''}
                onBlur={e => save({ embedTitle: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Embed Color (hex)</FormLabel>
              <Input size="sm" rounded="lg" placeholder="#7551FF" defaultValue={data.embedColor ?? '#7551FF'}
                onBlur={e => save({ embedColor: e.target.value })} />
            </FormControl>
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="600">Show Avatar</Text>
              <Switch isChecked={data.showAvatar ?? true} colorScheme="brand"
                onChange={e => save({ showAvatar: e.target.checked })} />
            </Flex>
          </CardBody>
        </Card>

        {/* Message */}
        <Card variant="primary" rounded="xl" gridColumn={{ md: '1 / -1' }}>
          <CardHeader pb={2}>
            <Flex justify="space-between" align="center">
              <Heading size="sm">💬 Welcome Message</Heading>
              <HStack gap={1} flexWrap="wrap">
                {VARS.map(v => (
                  <Badge key={v} colorScheme="brand" fontSize="10px" cursor="pointer"
                    onClick={() => {
                      const el = document.getElementById('welcome-msg') as HTMLTextAreaElement;
                      if (el) { const s = el.selectionStart; const val = el.value; const newVal = val.slice(0,s)+v+val.slice(s); save({ message: newVal }); }
                    }}>{v}</Badge>
                ))}
              </HStack>
            </Flex>
          </CardHeader>
          <CardBody pt={0} as={VStack} align="stretch" gap={3}>
            <Textarea id="welcome-msg" size="sm" rounded="lg" rows={4}
              defaultValue={data.message ?? 'Welcome {user.mention} to **{server}**!'}
              onBlur={e => save({ message: e.target.value })} />
            <Text fontSize="xs" color="TextSecondary">Variables: {VARS.join(' • ')}</Text>
          </CardBody>
        </Card>

        {/* DM Message */}
        <Card variant="primary" rounded="xl" gridColumn={{ md: '1 / -1' }}>
          <CardHeader pb={2}><Heading size="sm">📩 DM Message (optional)</Heading></CardHeader>
          <CardBody pt={0}>
            <Textarea size="sm" rounded="lg" rows={3} placeholder="Leave blank to disable DMs"
              defaultValue={data.dmMessage ?? ''}
              onBlur={e => save({ dmMessage: e.target.value })} />
          </CardBody>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

WelcomePage.getLayout = c => getGuildLayout({ children: c, back: true });
export default WelcomePage;
