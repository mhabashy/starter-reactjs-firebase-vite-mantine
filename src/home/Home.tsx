import { faGear, faMoon, faSignOut, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppShell, Burger, Text, Header, MediaQuery, Navbar, useMantineTheme, Divider, Avatar, ActionIcon, useMantineColorScheme, Tooltip, UnstyledButton, Group } from '@mantine/core';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MyAvator } from '../components/MyAvator';
import { userStore } from '../store/userStore';

export interface IHomeProps {
}

export function Home (props: IHomeProps) {
  const theme = useMantineTheme();
  const signOutUser = userStore((state: any) => state.signOutUser);
  const photoUrl = userStore((state: any) => state.photoUrl);
  const [opened, setOpened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const navigate = useNavigate();

  console.log(photoUrl);
  

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="md"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Navbar.Section grow mt="md">
            <UnstyledButton 
              onClick={() => navigate('/')}>
              <Group>
                <Avatar size={40} color="blue">D</Avatar>
                <div>
                  <Text>Dashboard</Text>
                </div>
              </Group>
            </UnstyledButton>
          </Navbar.Section>
          <Navbar.Section>
            <Divider />
            <div className="d-flex flex-row m-2 align-items-center flex-wrap">
              <MyAvator 
                size="md"
                src={photoUrl}
                displayName={userStore((state: any) => state.displayName)}
              />
              <div className="d-flex flex-column m-2">
                <Text size="md" weight="bold">
                  {userStore((state: any) => state.displayName)}
                </Text>
                <Text size='xs' weight="bold">
                  {userStore((state: any) => state.email)}
                </Text>
              </div>
              <div className='d-flex flex-row flex-grow-1 justify-content-around'>
                <Tooltip
                  wrapLines={true}
                  withArrow
                  transition="fade"
                  transitionDuration={200}
                  label="Change App Theme"
                >
                  <ActionIcon
                    variant='filled'
                    onClick={() => toggleColorScheme()}
                  >
                    <FontAwesomeIcon icon={colorScheme == 'dark' ? faSun : faMoon} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip
                  wrapLines={true}
                  withArrow
                  transition="fade"
                  transitionDuration={200}
                  label="User Settings"
                >
                  <ActionIcon
                    variant='filled'
                    color='secondary'
                    onClick={() => {
                      setOpened(false);
                      navigate('/settings');
                    }}
                  >
                    <FontAwesomeIcon icon={faGear} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip
                  wrapLines={true}
                  withArrow
                  transition="fade"
                  transitionDuration={200}
                  label="Sign Out"
                >
                  <ActionIcon variant="filled" color="red"  onClick={() => {
                    setOpened(false);
                    signOutUser();
                    navigate('/login');
                  }}>
                    <FontAwesomeIcon icon={faSignOut} />
                  </ActionIcon>
                </Tooltip>
              </div>
            </div>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div className="h-100 d-flex align-items-center justify-content-between">
            <div className="flex-grow-1 d-flex flex-row">
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Text className='flex-grow-1'>Application header</Text>
            </div>
          </div>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}
