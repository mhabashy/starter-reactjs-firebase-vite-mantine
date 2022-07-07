import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, useMantineColorScheme } from '@mantine/core';

export interface IThemeSwitchProps {
  size: 'xs' | 'sm' | 'md' | 'lg';
}

export function ThemeSwitch (props: IThemeSwitchProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <div className="d-flex flex-grow justify-content-end">
        <Button 
            leftIcon={colorScheme == 'dark' ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />} 
            color={colorScheme == 'dark' ? 'gray' : 'light'}
            size={props.size || 'md'}
            onClick={() => toggleColorScheme()}
        >
            {colorScheme == 'dark' ? 'Light Theme' : 'Dark Theme'}
        </Button>
    </div>
  );
}
