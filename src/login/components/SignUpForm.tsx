import { faArrowLeft, faEnvelope, faLock, faSignIn, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Divider, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { PasswordStrength } from './PasswordWithRequirement';

export interface ISignUpFormProps {
    goBack: () => void;
    onSubmit: (values: any) => void;
    logo: string;
    email?: string;
    password?: string;
}

export function SignUpForm (props: ISignUpFormProps) {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [isPasswordValid, setPasswordIsValid] = useState(false);

    const form = useForm({
      initialValues: {
        displayName: '',
        email: props.email || ''
      },
      validate: {
        email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
      },
    });
    
    return (
        <>
            <Card.Section p="sm" className="d-flex flex-column align-items-start">
                <div className="align-self-center">{props.logo}</div>
                <Button 
                  leftIcon={<FontAwesomeIcon icon={faArrowLeft} />} 
                  onClick={() => props.goBack()}
                  size="xs"
                  color="red"
                >
                  Go Back
                </Button>
                <h1>Sign Up</h1>
            </Card.Section>
            <Divider />
            <Group className="w-100">
                <form onSubmit={form.onSubmit((values) => {
                    if (!isPasswordValid) {
                        showNotification({
                            message: 'Invalid Password',
                            title: 'Password Error',
                            typeof: 'error'
                        });
                        return;
                    }
                    if (confirmPassword !== passwordStrength) {
                        showNotification({
                            message: 'Password does not match',
                            title: 'Password Error',
                            typeof: 'error'
                        });
                        return;
                    }
                    const payload = {
                        ...values,
                        password: passwordStrength,
                    };
                    props.onSubmit(payload);
                    console.log(payload);
                })} className="w-100">
                    <TextInput type='text' 
                        label="Full Name"
                        required
                        typeof="displayName"
                        icon={<FontAwesomeIcon icon={faUserCircle} />}
                        placeholder='Enter your full name'
                        {...form.getInputProps('displayName')}  />
                    <TextInput type='email' 
                        label="Email Address"
                        required
                        placeholder='Enter your email'
                        icon={<FontAwesomeIcon icon={faEnvelope} />}
                        typeof="email"
                        {...form.getInputProps('email')}  />
                    <PasswordStrength setPassword={setPasswordStrength} setPasswordIsValid={setPasswordIsValid} />
                    <TextInput type='password' 
                        label="Confirm Password"
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={<FontAwesomeIcon icon={faLock} />}
                        required
                     />
                    <Button type="submit" 
                            leftIcon={<FontAwesomeIcon icon={faSignIn} />} color="red"
                            className='mt-2 w-100'
                            >Sign Up</Button>
                </form>
            </Group>
        </>
    );
}
