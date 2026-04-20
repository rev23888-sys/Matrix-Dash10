import {
  Box, Button, Card, CardBody, Flex, Heading, Icon, Text,
  VStack, HStack, Badge, SimpleGrid,
} from '@chakra-ui/react';
import { BsDiscord, BsShieldFillCheck, BsTrophyFill } from 'react-icons/bs';
import { FaRobot, FaCoins, FaGamepad }                from 'react-icons/fa';
import { MdSecurity, MdMessage, MdBarChart }           from 'react-icons/md';
import { auth }                                         from '@/config/translations/auth';
import { NextPageWithLayout }                           from '@/pages/_app';
import AuthLayout                                       from '@/components/layout/auth';
import { useRouter }                                    from 'next/router';
import { GetServerSideProps }                           from 'next';
import { getServerSession }                             from '@/utils/auth/server';

const FEATURES = [
  { icon: BsShieldFillCheck, label: 'Anti-Nuke',   color: 'orange.400', desc: 'Raid protection'    },
  { icon: MdSecurity,        label: 'AutoMod',      color: 'yellow.400', desc: 'Auto-filter'        },
  { icon: FaCoins,           label: 'Economy',      color: 'green.400',  desc: 'Coins & shop'       },
  { icon: MdMessage,         label: 'Welcome',      color: 'teal.400',   desc: 'Greet members'      },
  { icon: MdBarChart,        label: 'Logging',      color: 'blue.400',   desc: 'Event logs'         },
  { icon: FaGamepad,         label: 'Games',        color: 'pink.400',   desc: 'Play & earn'        },
];

const LoginPage: NextPageWithLayout = () => {
  const t      = auth.useTranslations();
  const locale = useRouter().locale;

  return (
    <Flex w="full" h="full" direction="column" align="center" justify="center" gap={8} p={4}>
      {/* HERO */}
      <VStack gap={3} textAlign="center" maxW="480px">
        <HStack gap={2} justify="center">
          <Icon as={FaRobot} color="brand.400" boxSize={10} />
          <Heading size="xl" fontWeight="800">Matrix Dashboard</Heading>
        </HStack>
        <Text color="TextSecondary" fontSize="lg">{t['login description']}</Text>
        <Button
          mt={2}
          leftIcon={<Icon as={BsDiscord} fontSize="xl" />}
          colorScheme="brand"
          size="lg"
          width="320px"
          maxW="full"
          rounded="xl"
          as="a"
          href={`/api/auth/login?locale=${locale}`}
          shadow="0 0 30px var(--chakra-colors-brand-400)"
          _hover={{ shadow: '0 0 40px var(--chakra-colors-brand-500)' }}
        >
          {t.login_bn}
        </Button>
        <Text fontSize="xs" color="TextSecondary">
          Scopes requested: <Badge colorScheme="brand" fontSize="10px">identify</Badge>{' '}
          <Badge colorScheme="brand" fontSize="10px">guilds</Badge>{' '}
          <Badge colorScheme="brand" fontSize="10px">guilds.members.read</Badge>
        </Text>
      </VStack>

      {/* FEATURES PREVIEW */}
      <SimpleGrid columns={{ base: 2, sm: 3 }} gap={3} maxW="480px" w="full">
        {FEATURES.map(f => (
          <Card key={f.label} variant="primary" rounded="xl">
            <CardBody as={Flex} align="center" gap={3} p={3}>
              <Icon as={f.icon} color={f.color} boxSize={5} />
              <Box>
                <Text fontWeight="700" fontSize="xs">{f.label}</Text>
                <Text fontSize="10px" color="TextSecondary">{f.desc}</Text>
              </Box>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

LoginPage.getLayout = c => <AuthLayout>{c}</AuthLayout>;
export default LoginPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (getServerSession(req).success)
    return { redirect: { destination: '/user/home', permanent: false }, props: {} };
  return { props: {} };
};
