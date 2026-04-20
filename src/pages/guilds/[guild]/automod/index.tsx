import {
  Box, Button, Card, CardBody, CardHeader, Flex, FormControl, FormLabel,
  Heading, HStack, Icon, NumberInput, NumberInputField, Select,
  SimpleGrid, Slider, SliderFilledTrack, SliderThumb, SliderTrack,
  Switch, Text, useToast, VStack, Spinner,
} from '@chakra-ui/react';
import { useRouter }                    from 'next/router';
import { useFeatureQuery, useUpdateFeatureMutation, useEnableFeatureMutation, useGuildChannelsQuery } from '@/api/hooks';
import getGuildLayout                   from '@/components/layout/guild/get-guild-layout';
import { NextPageWithLayout }           from '@/pages/_app';
import { AutomodFeature }               from '@/config/types/custom-types';
import { MdSecurity }                   from 'react-icons/md';
import { ChannelTypes }                 from '@/api/discord';

type Module = {
  key: keyof AutomodFeature;
  label: string;
  desc: string;
  emoji: string;
  extraKey?: keyof AutomodFeature;
  extraLabel?: string;
  extraMin?: number;
  extraMax?: number;
};

const MODULES: Module[] = [
  { key: 'antilink',    label: 'Anti-Link',    emoji: '🔗', desc: 'Block Discord invite links' },
  { key: 'antispam',    label: 'Anti-Spam',    emoji: '📨', desc: 'Block message spam',  extraKey: 'antispam_limit',    extraLabel: 'Messages/5s', extraMin: 2, extraMax: 20 },
  { key: 'anticaps',    label: 'Anti-Caps',    emoji: '🔠', desc: 'Block excessive caps', extraKey: 'anticaps_pct',     extraLabel: 'Caps %',      extraMin: 50, extraMax: 100 },
  { key: 'antiemoji',   label: 'Anti-Emoji',   emoji: '😀', desc: 'Block emoji spam',     extraKey: 'antiemoji_limit',  extraLabel: 'Max emojis',  extraMin: 1, extraMax: 30 },
  { key: 'antimention', label: 'Anti-Mention', emoji: '📣', desc: 'Block mass mentions',  extraKey: 'antimention_limit',extraLabel: 'Max mentions',extraMin: 1, extraMax: 15 },
];

const AutomodPage: NextPageWithLayout = () => {
  const { guild } = useRouter().query as { guild: string };
  const query     = useFeatureQuery(guild, 'automod');
  const enable    = useEnableFeatureMutation();
  const update    = useUpdateFeatureMutation();
  const channels  = useGuildChannelsQuery(guild);
  const toast     = useToast();

  if (query.isLoading) return <Flex justify="center" align="center" h="200px"><Spinner /></Flex>;

  if (query.isError)
    return (
      <Flex direction="column" align="center" gap={4} py={10}>
        <Icon as={MdSecurity} boxSize={12} color="TextSecondary" />
        <Heading size="md">Auto Moderation Not Enabled</Heading>
        <Button colorScheme="brand" isLoading={enable.isLoading}
          onClick={() => enable.mutate({ enabled: true, guild, feature: 'automod' })}>
          Enable AutoMod
        </Button>
      </Flex>
    );

  const data: AutomodFeature = query.data ?? {};
  const textChs = (channels.data ?? []).filter(c => c.type === ChannelTypes.GUILD_TEXT);

  async function save(patch: Partial<AutomodFeature>) {
    try {
      await update.mutateAsync({ guild, feature: 'automod', options: JSON.stringify({ ...data, ...patch }) });
      toast({ title: '✅ Saved!', status: 'success', duration: 2000, isClosable: true });
    } catch {
      toast({ title: '❌ Failed to save', status: 'error', duration: 3000, isClosable: true });
    }
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">🤖 Auto Moderation</Heading>
          <Text color="TextSecondary" mt={1}>Automatically filter spam, links, and bad content.</Text>
        </Box>
        <HStack>
          <Text fontSize="sm" color="TextSecondary">Enabled</Text>
          <Switch isChecked={data.enabled ?? false} colorScheme="brand"
            onChange={e => save({ enabled: e.target.checked })} />
        </HStack>
      </Flex>

      {/* Global settings */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">⚖️ Punishment</Heading></CardHeader>
          <CardBody pt={0}>
            <Select size="sm" rounded="lg" value={data.punishment ?? 'warn'}
              onChange={e => save({ punishment: e.target.value as any })}>
              <option value="warn">⚠️ Warn</option>
              <option value="mute">🔇 Mute</option>
              <option value="kick">👢 Kick</option>
              <option value="ban">🔨 Ban</option>
            </Select>
          </CardBody>
        </Card>
        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">📋 Log Channel</Heading></CardHeader>
          <CardBody pt={0}>
            <Select size="sm" rounded="lg" placeholder="Select channel" value={data.log_channel ?? ''}
              onChange={e => save({ log_channel: e.target.value })}>
              {textChs.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}
            </Select>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Modules */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        {MODULES.map(mod => (
          <Card key={mod.key} variant="primary" rounded="xl"
            borderColor={data[mod.key] ? 'brand.400' : 'transparent'}
            border="1px solid">
            <CardBody as={VStack} align="stretch" gap={3}>
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="700" fontSize="sm">{mod.emoji} {mod.label}</Text>
                  <Text fontSize="xs" color="TextSecondary">{mod.desc}</Text>
                </Box>
                <Switch isChecked={Boolean(data[mod.key])} colorScheme="brand"
                  onChange={e => save({ [mod.key]: e.target.checked })} />
              </Flex>
              {mod.extraKey && data[mod.key] && (
                <>
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="xs" color="TextSecondary">{mod.extraLabel}</Text>
                      <Text fontSize="xs" fontWeight="700">{Number((data as any)[mod.extraKey] ?? mod.extraMin)}</Text>
                    </Flex>
                    <Slider
                      min={mod.extraMin} max={mod.extraMax}
                      value={Number((data as any)[mod.extraKey] ?? mod.extraMin)}
                      onChange={v => save({ [mod.extraKey!]: v } as any)}
                      colorScheme="brand">
                      <SliderTrack><SliderFilledTrack /></SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                </>
              )}
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

AutomodPage.getLayout = c => getGuildLayout({ children: c, back: true });
export default AutomodPage;
