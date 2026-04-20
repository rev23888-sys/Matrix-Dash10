import { FaChevronLeft as ChevronLeftIcon } from 'react-icons/fa';
import { Flex, HStack, Text, VStack }       from '@chakra-ui/layout';
import { Icon, IconButton }                 from '@chakra-ui/react';
import { HSeparator }                       from '@/components/layout/Separator';
import { getFeatures }                      from '@/utils/common';
import { IoSettings }                       from 'react-icons/io5';
import { MdAttachMoney, MdOutlineGames, MdMessage, MdBarChart, MdLeaderboard } from 'react-icons/md';
import { RiSwordFill }                      from 'react-icons/ri';
import { BsShieldFillCheck }                from 'react-icons/bs';
import { FaTicketAlt }                      from 'react-icons/fa';
import { useGuildPreview }                  from '@/api/hooks';
import { sidebarBreakpoint }                from '@/theme/breakpoints';
import { guild as view }                    from '@/config/translations/guild';
import { useRouter }                        from 'next/router';
import Link                                 from 'next/link';
import { Params }                           from '@/pages/guilds/[guild]/features/[feature]';
import { SidebarItem }                      from '../sidebar/SidebarItem';

type NavItem = { label: string; icon: any; path: string };

export function InGuildSidebar() {
  const router = useRouter();
  const { guild: guildId, feature: activeId } = router.query as Params;
  const { guild } = useGuildPreview(guildId);
  const t = view.useTranslations();
  const route = router.route;

  const managementItems: NavItem[] = [
    { label: 'Welcome',    icon: MdMessage,        path: 'welcome' },
    { label: 'Moderation', icon: RiSwordFill,       path: 'moderation' },
    { label: 'Anti-Nuke',  icon: BsShieldFillCheck, path: 'antinuke' },
    { label: 'AutoMod',    icon: BsShieldFillCheck, path: 'automod' },
    { label: 'Logging',    icon: MdBarChart,        path: 'logging' },
    { label: 'Tickets',    icon: FaTicketAlt,       path: 'tickets' },
  ];

  return (
    <Flex direction="column" gap={2} p={3}>
      <HStack as={Link} cursor="pointer" mb={2} href={`/guilds/${guildId}`}>
        <IconButton
          display={{ base: 'none', [sidebarBreakpoint]: 'block' }}
          icon={<Icon verticalAlign="middle" as={ChevronLeftIcon} />}
          aria-label="back"
        />
        <Text fontSize="lg" fontWeight="600" noOfLines={1}>{guild?.name}</Text>
      </HStack>

      <VStack align="stretch" gap={0}>
        <SidebarItem
          href={`/guilds/${guildId}/settings`}
          active={route === '/guilds/[guild]/settings'}
          icon={<Icon as={IoSettings} />}
          name={t.bn.settings}
        />

        <HSeparator>Management</HSeparator>
        {managementItems.map(item => (
          <SidebarItem
            key={item.path}
            href={`/guilds/${guildId}/${item.path}`}
            active={route === `/guilds/[guild]/${item.path}`}
            icon={<Icon as={item.icon} />}
            name={item.label}
          />
        ))}

        <HSeparator>Economy & Fun</HSeparator>
        <SidebarItem
          href={`/guilds/${guildId}/economy`}
          active={route.startsWith('/guilds/[guild]/economy')}
          icon={<Icon as={MdAttachMoney} />}
          name="Economy"
        />
        <SidebarItem
          href={`/guilds/${guildId}/leaderboard`}
          active={route.startsWith('/guilds/[guild]/leaderboard')}
          icon={<Icon as={MdLeaderboard} />}
          name="Leaderboard"
        />
        <SidebarItem
          href={`/guilds/${guildId}/games`}
          active={route.startsWith('/guilds/[guild]/games')}
          icon={<Icon as={MdOutlineGames} />}
          name="Games"
        />

        <HSeparator>Features</HSeparator>
        {getFeatures().map(feature => (
          <SidebarItem
            key={feature.id}
            name={feature.name}
            icon={feature.icon}
            active={activeId === feature.id}
            href={`/guilds/${guildId}/features/${feature.id}`}
          />
        ))}
      </VStack>
    </Flex>
  );
}
