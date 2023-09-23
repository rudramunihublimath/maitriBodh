export interface UserLoginReq {
    email: string;
    password: string;
}

export interface UserReq {
    id?: number;
    code?: string;
    firstname: string;
    lastname: string;
    gender: any;
    email: string;
    password: string;
    contactNum1: string;
    contactNum2: string;
    country: string;
    state: string;
    city: string;
    createdAt?: string;
    updatedAt?: string;
    dbRole?: string;
    linkdinID: string;
    facebookID: string;
    instaID: string;
    pannum: string;
    address1: string;
    address2: string;
    pincode: string;
    dob: string;
    profileActive?: string;

    reportingmanagerId?: string;
    reportingmanagerName?: string,
    nameofMyTeam?: string,
    citiesAllocated?: Array<string>
    mbpcode?: string;
}

export interface UserTableDto {
    firstname: string;
    lastname: string;
    email: string;
}

export interface ChangePassword {
    email: string;
    oldPWD: string;
    newPWD: string;
}