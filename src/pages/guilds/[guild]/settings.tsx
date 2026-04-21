import {
  Box, Button, Card, CardBody, CardHeader, Divider,
  Flex, FormControl, FormLabel, Heading, HStack,
  Input, SimpleGrid, Spinner, Switch, Text,
  useToast, VStack, Icon, Badge,
} from '@chakra-ui/react';
import getGuildLayout from '@/components/layout/guild/get-guild-layout';
import { NextPageWithLayout } from '@/pages/_app';
import { useRouter } from 'next/router';
import { useGuildInfoQuery, useGuildRolesQuery, useGuildChannelsQuery } from '@/api/hooks';
import { ChannelSelectForm } from '@/components/forms/ChannelSelect';
import { RoleSelectForm } from '@/components/forms/RoleSelect';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IoShieldCheckmark, IoSettings, IoInformationCircle } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa';

const schema = z.object({
  prefix:      z.string().min(1).max(5).default('/'),
  log_channel: z.string().optional(),
  mod_role:    z.string().optional(),
  mute_role:   z.string().optional(),
  dj_role:     z.string().optional(),
  auto_role:   z.string().optional(),
  beta:        z.boolean().default(false),
});
type Settings = z.infer<typeof schema>;

const GuildSettingsPage: NextPageWithLayout = () => {
  const { guild }   = useRouter().query as { guild: string };
  const infoQuery   = useGuildInfoQuery(guild);
  const toast       = useToast();

  const { control, register, handleSubmit, formState: { errors, isDirty, isSubmitting } } = useForm<Settings>({
    resolver: zodResolver(schema),
    defaultValues: { prefix: '/', beta: false },
  });

  if (infoQuery.isLoading)
    return <Flex justify="center" align="center" h="200px"><Spinner /></Flex>;

  async function onSubmit(data: Settings) {
    try {
      // POST to bot API — NEXT_PUBLIC_API_ENDPOINT/guilds/{guild}/settings
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/guilds/${guild}/settings`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error(await res.text());
      toast({ title: '✅ Settings saved!', status: 'success', duration: 2000, isClosable: true });
    } catch (err: any) {
      toast({ title: '❌ Failed to save', description: err.message, status: 'error', duration: 4000, isClosable: true });
    }
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">⚙️ Server Settings</Heading>
          <Text color="TextSecondary" mt={1}>Configure Matrix Bot for this server.</Text>
        </Box>
        {infoQuery.data != null && (
          <Badge colorScheme="green" rounded="full" px={3} py={1} fontSize="sm">
            <HStack gap={1}><Icon as={FaRobot} /><Text>Bot Active</Text></HStack>
          </Badge>
        )}
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align="stretch" gap={4}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {/* Prefix */}
            <Card variant="primary" rounded="xl">
              <CardHeader pb={2}><Heading size="sm">🔧 General</Heading></CardHeader>
              <CardBody pt={0} as={VStack} align="stretch" gap={3}>
                <FormControl isInvalid={!!errors.prefix}>
                  <FormLabel fontSize="sm">Command Prefix</FormLabel>
                  <Input {...register('prefix')} placeholder="/" size="sm" rounded="lg" maxW="120px" />
                  {errors.prefix && <Text color="red.400" fontSize="xs" mt={1}>{errors.prefix.message}</Text>}
                </FormControl>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="600" fontSize="sm">Beta Features</Text>
                    <Text fontSize="xs" color="TextSecondary">Use experimental features first</Text>
                  </Box>
                  <Switch {...register('beta')} colorScheme="brand" />
                </Flex>
              </CardBody>
            </Card>

            {/* Channels */}
            <Card variant="primary" rounded="xl">
              <CardHeader pb={2}><Heading size="sm">📋 Log Channel</Heading></CardHeader>
              <CardBody pt={0}>
                <ChannelSelectForm
                  control={{ label: 'Log Channel', description: 'Channel for bot logs' }}
                  controller={{ control, name: 'log_channel' }}
                />
              </CardBody>
            </Card>

            {/* Roles */}
            <Card variant="primary" rounded="xl">
              <CardHeader pb={2}><Heading size="sm">🎭 Roles</Heading></CardHeader>
              <CardBody pt={0} as={VStack} align="stretch" gap={3}>
                <RoleSelectForm
                  control={{ label: 'Mod Role', description: 'Role for moderators' }}
                  controller={{ control, name: 'mod_role' }}
                />
                <RoleSelectForm
                  control={{ label: 'Mute Role', description: 'Role given when muted' }}
                  controller={{ control, name: 'mute_role' }}
                />
                <RoleSelectForm
                  control={{ label: 'DJ Role', description: 'Music DJ role' }}
                  controller={{ control, name: 'dj_role' }}
                />
                <RoleSelectForm
                  control={{ label: 'Auto Role', description: 'Given to new members' }}
                  controller={{ control, name: 'auto_role' }}
                />
              </CardBody>
            </Card>
          </SimpleGrid>

          <Divider />
          <Flex justify="flex-end">
            <Button
              type="submit"
              colorScheme="brand"
              isLoading={isSubmitting}
              isDisabled={!isDirty}
              rounded="xl"
              px={8}
            >
              Save Settings
            </Button>
          </Flex>
        </VStack>
      </form>
    </Flex>
  );
};

GuildSettingsPage.getLayout = (c) => getGuildLayout({ children: c, back: true });
export default GuildSettingsPage;
