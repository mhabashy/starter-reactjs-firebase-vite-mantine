import { faArrowLeft, faEnvelope, faMailForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Divider, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export interface IForgetPasswordProps {
    onSubmit: (values: any) => void;
    goBack: () => void;
    logo: string;
    email?: string;
}

export default function ForgetPassword (props: IForgetPasswordProps) {
    const form = useForm({
      initialValues: { 
        email: props.email ||'',
      },
    
      validate: {
        email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
      }
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
                <h1>Forget Password</h1>
            </Card.Section>
            <Divider />
            <Group >
                <form onSubmit={form.onSubmit((values) => props.onSubmit(values))} className="w-100">
                    <TextInput type='email'
                        label="Email Address"
                        required
                        placeholder="Enter your email"
                        typeof="email"
                        icon={<FontAwesomeIcon icon={faEnvelope} />}
                        {...form.getInputProps('email')}  />
                    <Button type="submit" 
                        className="mt-2 w-100"
                        leftIcon={<FontAwesomeIcon icon={faMailForward} />}
                        color="red">Send Password Recovery</Button>
                </form>
            </Group>
        </>
    );
}
