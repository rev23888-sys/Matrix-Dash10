import {
  Badge, Box, Button, Card, CardBody, CardHeader,
  Flex, Grid, Heading, HStack, Icon, IconButton,
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay,
  NumberInput, NumberInputField, SimpleGrid,
  Spinner, Stat, StatLabel, StatNumber, StatHelpText,
  Switch, Tab, TabList, TabPanel, TabPanels, Tabs,
  Text, Tooltip, useDisclosure, useToast, VStack,
  Input, Select, FormLabel, FormControl, Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useFeatureQuery, useUpdateFeatureMutation, useEnableFeatureMutation } from '@/api/hooks';
import getGuildLayout from '@/components/layout/guild/get-guild-layout';
import { NextPageWithLayout } from '@/pages/_app';
import { useState } from 'react';
import { MdAttachMoney, MdDelete, MdAdd, MdStore, MdPeople, MdBarChart } from 'react-icons/md';
import { FaCoins, FaRegCalendarAlt } from 'react-icons/fa';
import { EconomyFeature } from '@/config/types/custom-types';

const EconomyPage: NextPageWithLayout = () => {
  const { guild } = useRouter().query as { guild: string };
  const query     = useFeatureQuery(guild, 'economy');
  const enable    = useEnableFeatureMutation();
  const update    = useUpdateFeatureMutation();
  const toast     = useToast();

  if (query.isLoading)
    return <Flex justify="center" align="center" h="200px"><Spinner /></Flex>;

  if (query.isError)
    return (
      <Flex direction="column" align="center" gap={4} py={10}>
        <Text fontWeight="600" fontSize="xl">Economy is not enabled</Text>
        <Text color="TextSecondary">Enable the economy system for this server.</Text>
        <Button
          colorScheme="brand"
          isLoading={enable.isLoading}
          onClick={() => enable.mutate({ enabled: true, guild, feature: 'economy' })}
        >
          Enable Economy
        </Button>
      </Flex>
    );

  const data: EconomyFeature = query.data ?? {};

  async function save(patch: Partial<EconomyFeature>) {
    try {
      await update.mutateAsync({ guild, feature: 'economy', options: JSON.stringify({ ...data, ...patch }) });
      toast({ title: '✅ Saved!', status: 'success', duration: 2000, isClosable: true });
    } catch {
      toast({ title: '❌ Failed to save', status: 'error', duration: 3000, isClosable: true });
    }
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">💰 Economy System</Heading>
          <Text color="TextSecondary" mt={1}>Configure coins, shop, and earning methods.</Text>
        </Box>
        <HStack gap={2}>
          <Text fontSize="sm" color="TextSecondary">Enabled</Text>
          <Switch
            isChecked={data.enabled ?? true}
            colorScheme="brand"
            onChange={(e) => save({ enabled: e.target.checked })}
          />
        </HStack>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        {[
          { label: 'Daily Reward',  value: `$${(data.daily_amount ?? 500).toLocaleString()}`,  icon: FaRegCalendarAlt, color: 'green.400' },
          { label: 'Weekly Reward', value: `$${(data.weekly_amount ?? 2500).toLocaleString()}`, icon: FaRegCalendarAlt, color: 'blue.400' },
          { label: 'Work Min',      value: `$${(data.work_min ?? 50).toLocaleString()}`,        icon: FaCoins,          color: 'yellow.400' },
          { label: 'Work Max',      value: `$${(data.work_max ?? 200).toLocaleString()}`,       icon: FaCoins,          color: 'orange.400' },
        ].map((s) => (
          <Card key={s.label} variant="primary" rounded="xl">
            <CardBody>
              <HStack gap={3}>
                <Icon as={s.icon} color={s.color} boxSize={6} />
                <Stat size="sm">
                  <StatNumber fontWeight="bold">{s.value}</StatNumber>
                  <StatLabel color="TextSecondary" fontSize="xs">{s.label}</StatLabel>
                </Stat>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Tabs colorScheme="brand" variant="soft-rounded">
        <TabList flexWrap="wrap" gap={2}>
          <Tab>⚙️ Settings</Tab>
          <Tab>🏪 Shop Items</Tab>
        </TabList>
        <TabPanels>
          {/* ── SETTINGS TAB ── */}
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Card variant="primary" rounded="xl">
                <CardHeader pb={2}><Heading size="sm">💱 Currency</Heading></CardHeader>
                <CardBody pt={0} as={VStack} align="stretch" gap={3}>
                  <FormControl>
                    <FormLabel fontSize="sm">Currency Name</FormLabel>
                    <Input
                      defaultValue={data.currency_name ?? 'coins'}
                      onBlur={(e) => save({ currency_name: e.target.value })}
                      size="sm" rounded="lg"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Currency Emoji</FormLabel>
                    <Input
                      defaultValue={data.currency_emoji ?? '🪙'}
                      onBlur={(e) => save({ currency_emoji: e.target.value })}
                      size="sm" rounded="lg"
                    />
                  </FormControl>
                </CardBody>
              </Card>

              <Card variant="primary" rounded="xl">
                <CardHeader pb={2}><Heading size="sm">🎁 Rewards</Heading></CardHeader>
                <CardBody pt={0} as={VStack} align="stretch" gap={3}>
                  {[
                    { label: 'Daily Amount', key: 'daily_amount', default: 500 },
                    { label: 'Weekly Amount', key: 'weekly_amount', default: 2500 },
                    { label: 'Work Min', key: 'work_min', default: 50 },
                    { label: 'Work Max', key: 'work_max', default: 200 },
                  ].map(({ label, key, default: def }) => (
                    <FormControl key={key}>
                      <FormLabel fontSize="sm">{label}</FormLabel>
                      <NumberInput
                        defaultValue={(data as any)[key] ?? def}
                        min={0}
                        size="sm"
                        onBlur={(e) => save({ [key]: Number(e.target.value) } as any)}
                      >
                        <NumberInputField rounded="lg" />
                      </NumberInput>
                    </FormControl>
                  ))}
                </CardBody>
              </Card>

              <Card variant="primary" rounded="xl">
                <CardHeader pb={2}><Heading size="sm">🛡️ Settings</Heading></CardHeader>
                <CardBody pt={0} as={VStack} align="stretch" gap={3}>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="600" fontSize="sm">Rob Command</Text>
                      <Text fontSize="xs" color="TextSecondary">Allow users to rob each other</Text>
                    </Box>
                    <Switch
                      isChecked={data.rob_enabled ?? true}
                      colorScheme="brand"
                      onChange={(e) => save({ rob_enabled: e.target.checked })}
                    />
                  </Flex>
                  <Divider />
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="600" fontSize="sm">Shop System</Text>
                      <Text fontSize="xs" color="TextSecondary">Enable buy/sell shop</Text>
                    </Box>
                    <Switch
                      isChecked={data.shop_enabled ?? true}
                      colorScheme="brand"
                      onChange={(e) => save({ shop_enabled: e.target.checked })}
                    />
                  </Flex>
                </CardBody>
              </Card>
            </SimpleGrid>
          </TabPanel>

          {/* ── SHOP TAB ── */}
          <TabPanel px={0}>
            <ShopEditor items={data.items ?? []} onSave={(items) => save({ items })} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

// ── SHOP EDITOR ─────────────────────────────────────────────────────────────
type ShopItem = NonNullable<EconomyFeature['items']>[number];

function ShopEditor({ items, onSave }: { items: ShopItem[]; onSave: (i: ShopItem[]) => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState<Partial<ShopItem>>({});

  function addItem() {
    if (!form.name || !form.price) return;
    const newItem: ShopItem = {
      id:    Date.now().toString(),
      name:  form.name,
      price: form.price,
      desc:  form.desc,
      role:  form.role,
    };
    onSave([...items, newItem]);
    setForm({});
    onClose();
  }

  return (
    <>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontWeight="600">Shop Items ({items.length})</Text>
        <Button size="sm" leftIcon={<MdAdd />} colorScheme="brand" onClick={onOpen}>Add Item</Button>
      </Flex>

      {items.length === 0 ? (
        <Card variant="primary" rounded="xl">
          <CardBody as={Flex} direction="column" align="center" gap={3} py={10}>
            <Icon as={MdStore} boxSize={10} color="TextSecondary" />
            <Text color="TextSecondary">No shop items yet. Add some!</Text>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
          {items.map((item) => (
            <Card key={item.id} variant="primary" rounded="xl">
              <CardBody as={Flex} justify="space-between" align="center">
                <Box>
                  <Text fontWeight="700">{item.name}</Text>
                  <Text fontSize="sm" color="TextSecondary">{item.desc ?? 'No description'}</Text>
                  <Badge colorScheme="yellow" mt={1}>🪙 {item.price.toLocaleString()}</Badge>
                </Box>
                <IconButton
                  icon={<MdDelete />}
                  aria-label="delete"
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onSave(items.filter((i) => i.id !== item.id))}
                />
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent rounded="2xl">
          <ModalHeader>Add Shop Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody as={VStack} gap={3}>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Item Name</FormLabel>
              <Input size="sm" rounded="lg" placeholder="VIP Role" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Price (coins)</FormLabel>
              <NumberInput size="sm" min={1} value={form.price ?? ''} onChange={(v) => setForm({ ...form, price: Number(v) })}>
                <NumberInputField rounded="lg" placeholder="1000" />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Description</FormLabel>
              <Input size="sm" rounded="lg" placeholder="Optional description" value={form.desc ?? ''} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button size="sm" colorScheme="brand" onClick={addItem}>Add Item</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

EconomyPage.getLayout = (c) => getGuildLayout({ children: c, back: true });
export default EconomyPage;
