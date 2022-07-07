import { useState } from 'react';
import { PasswordInput, Progress, Text, Popover, Box } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross, faLock } from '@fortawesome/free-solid-svg-icons';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text
      color={meets ? 'teal' : 'red'}
      sx={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? <FontAwesomeIcon icon={faCross} />: <FontAwesomeIcon icon={faCross} />} <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}
export interface IPasswordStrength {
    setPassword: (password: string) => any;
    setPasswordIsValid: (isValid: boolean) => any;
}

export function PasswordStrength(props: IPasswordStrength) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [value, setValue] = useState('');
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));

  const strength = getStrength(value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  return (
    <Popover
      opened={popoverOpened}
      position="bottom"
      placement="start"
      withArrow
      styles={{ popover: { width: '100%' } }}
      trapFocus={false}
      transition="pop-top-left"
      onFocusCapture={() => setPopoverOpened(true)}
      onBlurCapture={() => setPopoverOpened(false)}
      className="w-100"
      target={
        <PasswordInput
          required
          label="Your password"
          placeholder="Your password"
          description="Strong password should include letters in lower and uppercase, at least 1 number, at least 1 special symbol"
          value={value}
          icon={<FontAwesomeIcon icon={faLock} />}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            props.setPassword(event.currentTarget.value);
            props.setPasswordIsValid(getStrength(event.currentTarget.value) === 100);
          }}
        />
      }
    >
      <Progress color={color} value={strength} size={5} style={{ marginBottom: 10 }} />
      <PasswordRequirement label="Includes at least 6 characters" meets={value.length > 5} />
      {checks}
    </Popover>
  );
}
