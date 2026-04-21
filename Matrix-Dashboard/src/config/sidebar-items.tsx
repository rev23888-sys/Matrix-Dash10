import { Icon } from '@chakra-ui/react';
import { common } from '@/config/translations/common';
import { MdPerson, MdDashboard, MdBarChart, MdSupportAgent } from 'react-icons/md';
import { BsDiscord, BsStarFill } from 'react-icons/bs';
import { FaRobot } from 'react-icons/fa';
import { SidebarItemInfo } from '@/utils/router';

const INVITE_URL  = 'https://tinyurl.com/Invite-Matrix';
const SUPPORT_URL = 'https://discord.gg/yAZxdHeJFF';
const VOTE_URL    = 'https://top.gg/bot/1409860321295732808/vote';

const items: SidebarItemInfo[] = [
  {
    name: <common.T text="dashboard" />,
    path: '/user/home',
    icon: <Icon as={MdDashboard} />,
  },
  {
    name: <common.T text="profile" />,
    path: '/user/profile',
    icon: <Icon as={MdPerson} />,
  },
];

export default items;
