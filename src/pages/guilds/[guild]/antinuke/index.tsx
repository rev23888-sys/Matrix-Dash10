import {
  Box, Button, Card, CardBody, CardHeader, Divider, Flex,
  FormControl, FormLabel, Heading, HStack, Icon, Select,
  SimpleGrid, Switch, Text, useToast, VStack, Spinner,
  Badge, Wrap, WrapItem, IconButton, Input, Tag, TagLabel, TagCloseButton,
} from '@chakra-ui/react';
import { useRouter }                    from 'next/router';
import { useFeatureQuery, useUpdateFeatureMutation, useEnableFeatureMutation } from '@/api/hooks';
import getGuildLayout                   from '@/components/layout/guild/get-guild-layout';
import { NextPageWithLayout }           from '@/pages/_app';
import { AntinukeFeature }              from '@/config/types/custom-types';
import { BsShieldFillCheck }            from 'react-icons/bs';
import { useState }                     from 'react';

type Toggle = { key: keyof AntinukeFeature; label: string; desc: string; emoji: string };
const TOGGLES: Toggle[] = [
  { key: 'antiban',      label: 'Anti-Ban',      desc: 'Protect from mass bans',       emoji: '🔨' },
  { key: 'antikick',     label: 'Anti-Kick',      desc: 'Protect from mass kicks',      emoji: '👢' },
  { key: 'antichannel',  label: 'Anti-Channel',   desc: 'Protect channel changes',      emoji: '📋' },
  { key: 'antirole',     label: 'Anti-Role',      desc: 'Protect role modifications',   emoji: '🎭' },
  { key: 'antiwebhook',  label: 'Anti-Webhook',   desc: 'Block webhook abuse',          emoji: '🔗' },
  { key: 'antibot',      label: 'Anti-Bot',       desc: 'Block unauthorized bots',      emoji: '🤖' },
  { key: 'antiprune',    label: 'Anti-Prune',     desc: 'Block member pruning',         emoji: '✂️' },
  { key: 'antieveryone', label: 'Anti-Everyone',  desc: 'Block @everyone pings',        emoji: '📣' },
];

const AntinukePage: NextPageWithLayout = () => {
  const { guild }   = useRouter().query as { guild: string };
  const query       = useFeatureQuery(guild, 'antinuke');
  const enable      = useEnableFeatureMutation();
  const update      = useUpdateFeatureMutation();
  const toast       = useToast();
  const [newWl, setNewWl] = useState('');

  if (query.isLoading) return <Flex justify="center" align="center" h="200px"><Spinner /></Flex>;

  if (query.isError)
    return (
      <Flex direction="column" align="center" gap={4} py={10}>
        <Icon as={BsShieldFillCheck} boxSize={12} color="TextSecondary" />
        <Heading size="md">Anti-Nuke Not Enabled</Heading>
        <Text color="TextSecondary">Enable Anti-Nuke to protect your server from raids.</Text>
        <Button colorScheme="brand" isLoading={enable.isLoading}
          onClick={() => enable.mutate({ enabled: true, guild, feature: 'antinuke' })}>
          Enable Anti-Nuke
        </Button>
      </Flex>
    );

  const data: AntinukeFeature = query.data ?? {};

  async function save(patch: Partial<AntinukeFeature>) {
    try {
      await update.mutateAsync({ guild, feature: 'antinuke', options: JSON.stringify({ ...data, ...patch }) });
      toast({ title: '✅ Saved!', status: 'success', duration: 2000, isClosable: true });
    } catch {
      toast({ title: '❌ Failed to save', status: 'error', duration: 3000, isClosable: true });
    }
  }

  function addWhitelist() {
    if (!newWl.trim()) return;
    const wl = [...(data.whitelisted ?? []), newWl.trim()];
    save({ whitelisted: wl });
    setNewWl('');
  }

  function removeWhitelist(id: string) {
    save({ whitelisted: (data.whitelisted ?? []).filter(w => w !== id) });
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box>
          <HStack gap={2}>
            <Heading size="lg">🚨 Anti-Nuke</Heading>
            <Badge colorScheme={data.enabled ? 'green' : 'red'} rounded="full" px={3}>
              {data.enabled ? 'Active' : 'Disabled'}
            </Badge>
          </HStack>
          <Text color="TextSecondary" mt={1}>Protect your server from nukes, raids, and mass actions.</Text>
        </Box>
        <HStack>
          <Text fontSize="sm" color="TextSecondary">Master Switch</Text>
          <Switch isChecked={data.enabled ?? false} colorScheme="brand" size="lg"
            onChange={e => save({ enabled: e.target.checked })} />
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {/* Punishment */}
        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">⚖️ Punishment</Heading></CardHeader>
          <CardBody pt={0}>
            <FormControl>
              <FormLabel fontSize="sm">Action when triggered</FormLabel>
              <Select size="sm" rounded="lg" value={data.punishment ?? 'ban'}
                onChange={e => save({ punishment: e.target.value as any })}>
                <option value="ban">🔨 Ban</option>
                <option value="kick">👢 Kick</option>
                <option value="strip">🎭 Strip Roles</option>
              </Select>
            </FormControl>
          </CardBody>
        </Card>

        {/* Whitelist */}
        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">✅ Whitelist (User IDs)</Heading></CardHeader>
          <CardBody pt={0} as={VStack} align="stretch" gap={3}>
            <HStack>
              <Input size="sm" rounded="lg" placeholder="Enter User ID" value={newWl}
                onChange={e => setNewWl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addWhitelist()} />
              <Button size="sm" colorScheme="brand" onClick={addWhitelist} rounded="lg">Add</Button>
            </HStack>
            <Wrap gap={2}>
              {(data.whitelisted ?? []).map(id => (
                <WrapItem key={id}>
                  <Tag size="sm" colorScheme="brand" rounded="full">
                    <TagLabel>{id}</TagLabel>
                    <TagCloseButton onClick={() => removeWhitelist(id)} />
                  </Tag>
                </WrapItem>
              ))}
              {(data.whitelisted ?? []).length === 0 &&
                <Text fontSize="xs" color="TextSecondary">No whitelisted users</Text>}
            </Wrap>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Toggle grid */}
      <Card variant="primary" rounded="xl">
        <CardHeader pb={2}><Heading size="sm">🔧 Protection Modules</Heading></CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={3}>
            {TOGGLES.map(t => (
              <Flex key={t.key} align="center" justify="space-between" p={3}
                bg={data[t.key] ? 'brandAlpha.100' : 'transparent'}
                border="1px solid"
                borderColor={data[t.key] ? 'brand.400' : 'whiteAlpha.100'}
                rounded="xl" gap={2}>
                <Box>
                  <Text fontSize="sm" fontWeight="700">{t.emoji} {t.label}</Text>
                  <Text fontSize="xs" color="TextSecondary">{t.desc}</Text>
                </Box>
                <Switch isChecked={Boolean(data[t.key])} colorScheme="brand"
                  onChange={e => save({ [t.key]: e.target.checked })} />
              </Flex>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </Flex>
  );
};

AntinukePage.getLayout = c => getGuildLayout({ children: c, back: true });
export default AntinukePage;
