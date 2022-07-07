import { faCancel, faMailReply, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  Button, Card, Divider, Modal, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { deleteUser, EmailAuthProvider, FacebookAuthProvider, getAuth, GithubAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, sendEmailVerification, User } from "firebase/auth";
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore";
import _ from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "reactfire";
import { AppLoader } from "../components/AppLoader";
import ConfirmButton from "../components/ConfirmButton";
import { firebaseApp } from "../config";
import { userStore } from "../store/userStore";

export function Settings() {
    const { status, data: user, data } = useUser();
    const provider: string = _.get(user, 'providerData[0].providerId');
    const signOutUser = userStore((state: any) => state.signOutUser);
    const [isLoading, setIsLoading] = useState(false);
    const [sendingEmailLoading, setSendEmailLoading] = useState(false);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const navigate = useNavigate();
    const deleteString = `Are you sure you want to delete your account? can't be undone`;
    
    const form = useForm({
      initialValues: { 
        email: user?.email ?? '',
        password: '',
      },
    
      validate: {
        email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        password: (value: string) => (value.length < 5 ? 'Password is required' : null),
      },
    });
    
    
    async function deleteAllAccountData(credential: any) {

        const db = getFirestore(firebaseApp);
        const userRef = await getDoc(doc(db, `users/${user?.uid}`));
        await deleteDoc(userRef.ref);
        if (credential) {

          const result = await reauthenticateWithCredential(
              (user as User),
              credential
          );
          await deleteUser(result.user);
        }
        setIsLoading(false);
        signOutUser();
        navigate('/');
    }

    async function deleteAccountWithEmailProvider() {
        setIsLoading(true);
        try {
            const email: string = form.values.email;
            const password: string = form.values.password;

            const credential = EmailAuthProvider.credential(
                email,
                password
            );
            await deleteAllAccountData(credential);
        } catch (e: any) {
            setIsLoading(false);
            showNotification({
                message: e.message.replace('Firebase: ', ''),
                typeof: 'error',
            })
        }
    }
    
    async function deleteAccountWithOutsideProvider() {
        setIsLoading(true);
        try {
          let credential;
          deleteUser(user as User);
          await deleteAllAccountData(credential);
        } catch (e: any) {
            setIsLoading(false);
            showNotification({
                message: e.message.replace('Firebase: ', ''),
                typeof: 'error',
            })
        }
    }

    async function sendEmailVerificationToUser() {
      try {
        setSendEmailLoading(true);
        await sendEmailVerification(user as User);
        setSendEmailLoading(false);
        showNotification({
          typeof: 'success',
          message: 'Email Send: Please check spam'
        });
      } catch (e: any) {
        setSendEmailLoading(false);
        showNotification({
          message: e.message,
          typeof: 'error'
        });
      }
    }

    return (
        <>
            <Modal
                opened={openDeleteModel}
                onClose={() => setOpenDeleteModel(false)}
                title="Confirm Delete Account"
                padding="xl"
                size="xl"
            >
                <Text>{deleteString}</Text>
                <Divider />
                <form onSubmit={form.onSubmit((values) => deleteAccountWithEmailProvider())} >
                    <TextInput
                      placeholder="Email Address"
                      label="Email Address"
                      {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        placeholder="Password"
                        label="Password"
                        {...form.getInputProps('password')}
                    />
                  <br/>
                  <div className="d-flex flex-row justify-content-between">
                      <Button 
                        leftIcon={<FontAwesomeIcon icon={faCancel} />} 
                        color="green"
                        onClick={() => setOpenDeleteModel(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        leftIcon={<FontAwesomeIcon icon={faTrash} />} 
                        color="red"
                        type="submit"
                        loading={isLoading}
                      >
                        Yes, Delete Account
                      </Button>
                  </div>
                </form>
            </Modal>
            {status == "loading" ? <AppLoader /> : 
            <div>
                <h3>Settings</h3>
                <Divider />
                <Card mt="md" p="md">
                  <Card.Section p="xs">
                    <Text weight="bold">User Information</Text>
                    <Divider />
                    <Text>Name: {user?.displayName}</Text>
                    <Text>Email: {user?.email}</Text>
                    <Text>UID: {user?.uid}</Text>
                    {
                        provider && <Text>Auth Provider: {_.upperFirst(provider)}</Text>
                    }
                    {
                      provider == 'password' && <Text>Email Verified: {user?.emailVerified ? 'Yes': 'No'}</Text>
                    }
                  </Card.Section>
                </Card>
                <Card mt="md" p="md">
                  <Card.Section p='xs'>
                    {!user?.emailVerified && 
                      <Button
                        leftIcon={<FontAwesomeIcon icon={faMailReply} />}
                        onClick={sendEmailVerificationToUser}
                        className="mr-2 mb-2"
                        loading={sendingEmailLoading}
                      >
                        Resend Email Verification
                      </Button>
                    }
                    {provider == 'password' && <Button 
                      leftIcon={<FontAwesomeIcon icon={faTrash} />} 
                      color="red"
                      onClick={() => setOpenDeleteModel(true)}
                    >
                      Delete Account
                    </Button>}
                    {provider != 'password' &&  <ConfirmButton 
                          size="md" 
                          onConfirm={() => deleteAccountWithOutsideProvider()}
                          text="Delete Account"
                          message={deleteString}
                          color="red"
                     />}                      
                  </Card.Section>
                </Card>
            </div>}
        </>
    );
}
