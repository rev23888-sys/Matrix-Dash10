import {
  Box, Button, Card, CardBody, CardHeader, Flex, FormControl, FormLabel,
  Heading, HStack, Icon, NumberInput, NumberInputField, Select, SimpleGrid,
  Switch, Text, Textarea, useToast, VStack, Spinner,
} from '@chakra-ui/react';
import { useRouter }                    from 'next/router';
import { useFeatureQuery, useUpdateFeatureMutation, useEnableFeatureMutation, useGuildChannelsQuery, useGuildRolesQuery } from '@/api/hooks';
import getGuildLayout                   from '@/components/layout/guild/get-guild-layout';
import { NextPageWithLayout }           from '@/pages/_app';
import { TicketsFeature }               from '@/config/types/custom-types';
import { FaTicketAlt }                  from 'react-icons/fa';
import { ChannelTypes }                 from '@/api/discord';

const TicketsPage: NextPageWithLayout = () => {
  const { guild } = useRouter().query as { guild: string };
  const query     = useFeatureQuery(guild, 'tickets');
  const enable    = useEnableFeatureMutation();
  const update    = useUpdateFeatureMutation();
  const channels  = useGuildChannelsQuery(guild);
  const roles     = useGuildRolesQuery(guild);
  const toast     = useToast();

  if (query.isLoading) return <Flex justify="center" align="center" h="200px"><Spinner /></Flex>;

  if (query.isError)
    return (
      <Flex direction="column" align="center" gap={4} py={10}>
        <Icon as={FaTicketAlt} boxSize={12} color="TextSecondary" />
        <Heading size="md">Ticket System Not Enabled</Heading>
        <Button colorScheme="brand" isLoading={enable.isLoading}
          onClick={() => enable.mutate({ enabled: true, guild, feature: 'tickets' })}>
          Enable Tickets
        </Button>
      </Flex>
    );

  const data: TicketsFeature = query.data ?? {};
  const categories = (channels.data ?? []).filter(c => c.type === ChannelTypes.GUILD_CATEGORY);
  const textChs    = (channels.data ?? []).filter(c => c.type === ChannelTypes.GUILD_TEXT);

  async function save(patch: Partial<TicketsFeature>) {
    try {
      await update.mutateAsync({ guild, feature: 'tickets', options: JSON.stringify({ ...data, ...patch }) });
      toast({ title: '✅ Saved!', status: 'success', duration: 2000, isClosable: true });
    } catch {
      toast({ title: '❌ Failed to save', status: 'error', duration: 3000, isClosable: true });
    }
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">🎫 Ticket System</Heading>
          <Text color="TextSecondary" mt={1}>Manage support tickets for your server.</Text>
        </Box>
        <HStack>
          <Text fontSize="sm" color="TextSecondary">Enabled</Text>
          <Switch isChecked={data.enabled ?? false} colorScheme="brand"
            onChange={e => save({ enabled: e.target.checked })} />
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">📁 Category</Heading></CardHeader>
          <CardBody pt={0}>
            <Select size="sm" rounded="lg" placeholder="Select category"
              value={data.category ?? ''}
              onChange={e => save({ category: e.target.value })}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </CardBody>
        </Card>

        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">👨‍💼 Support Role</Heading></CardHeader>
          <CardBody pt={0}>
            <Select size="sm" rounded="lg" placeholder="Select role"
              value={data.support_role ?? ''}
              onChange={e => save({ support_role: e.target.value })}>
              {(roles.data ?? []).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Select>
          </CardBody>
        </Card>

        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">📋 Log Channel</Heading></CardHeader>
          <CardBody pt={0}>
            <Select size="sm" rounded="lg" placeholder="Select channel"
              value={data.log_channel ?? ''}
              onChange={e => save({ log_channel: e.target.value })}>
              {textChs.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}
            </Select>
          </CardBody>
        </Card>

        <Card variant="primary" rounded="xl">
          <CardHeader pb={2}><Heading size="sm">🔢 Max Open Tickets</Heading></CardHeader>
          <CardBody pt={0}>
            <NumberInput size="sm" min={1} max={10} defaultValue={data.max_open ?? 1}
              onBlur={e => save({ max_open: Number(e.target.value) })}>
              <NumberInputField rounded="lg" />
            </NumberInput>
          </CardBody>
        </Card>

        <Card variant="primary" rounded="xl" gridColumn={{ md: '1 / -1' }}>
          <CardHeader pb={2}><Heading size="sm">📩 Ticket Open Message</Heading></CardHeader>
          <CardBody pt={0}>
            <Textarea size="sm" rounded="lg" rows={3}
              placeholder="Welcome to your ticket! Support will be with you shortly."
              defaultValue={data.open_message ?? ''}
              onBlur={e => save({ open_message: e.target.value })} />
          </CardBody>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

TicketsPage.getLayout = c => getGuildLayout({ children: c, back: true });
export default TicketsPage;
