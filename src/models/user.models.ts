export enum UserStatus {
    TRIAL = 'trial',
    SUBSCRIBER ='subscriber',
    ADMIN = 'admin',
}

export interface User {
    uid: string;
    displayName: string;
    photoUrl: string;
    email: string;
    accessToken: string;
    status: UserStatus;
}

// SHOULD MOVE TO A SEPARATE FILE
export const userHasPermission = (user: User, permission: UserStatus): boolean => {
    if (user.status === UserStatus.ADMIN && (permission === UserStatus.ADMIN 
                                            || permission === UserStatus.SUBSCRIBER
                                            || permission === UserStatus.TRIAL)) {
        return true;
    } else if (user.status === UserStatus.SUBSCRIBER && (permission === UserStatus.SUBSCRIBER 
                                            || permission === UserStatus.TRIAL)) {
        return true;
    } else if (user.status === UserStatus.TRIAL && permission === UserStatus.TRIAL) {
        return true;
    }
    return false;
}

export const userNotInTrial = (user: User): boolean => {
    return user.status !== UserStatus.TRIAL;
}