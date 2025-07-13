declare global {
  type Role = "user" | "admin";

  type AuthContext = {
    authUser: Auth | null;
    loginAction?: (user: LoginRequest) => Promise<void>;
    registerAction?: (user: RegisterRequest) => Promise<void>;
    logoutAction?: () => Promise<void>;
  };

  type ToastContext = {
    successToast: (message: string) => void;
    infoToast: (message: string) => void;
    errorToast: (message: string) => void;
    warnToast: (message: string) => void;
  };

  type LoginRequest = {
    email: string;
    password: string;
  };

  type RegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  type Auth = {
    userId: string;
    roles: Array<Role>;
    name: string;
    accessToken: string;
  };

  type TimeStamp = {
    createdAt: string;
    updatedAt: string;
  };

  type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    name: string;
    roles: Array<Role>;
  } & TimeStamp;

  type CreateOrganizationRequest = {
    user: string;
    name: string;
    default: boolean;
  };

  type Organization = {
    id: string;
    user: User;
    name: string;
    default: boolean;
  } & TimeStamp;

  type Move = "IN" | "OUT";

  type CreateTrackRequest = {
    user: string;
    organization: string;
    move: Move;
  };

  type Movement = {
    move: Move;
    time: Date;
  };

  type CreateOrganizationSettingRequest = {
    organization: string;
    schedules: {
      sun: string | null;
      mon: string | null;
      tue: string | null;
      wed: string | null;
      thu: string | null;
      fri: string | null;
      sat: string | null;
    };
  };

  type OrganizationSetting = {
    id: string;
    organization: Organization;
    schedules: {
      sun: string | null;
      mon: string | null;
      tue: string | null;
      wed: string | null;
      thu: string | null;
      fri: string | null;
      sat: string | null;
    };
  } & TimeStamp;

  type Track = {
    id: string;
    date: string;
    organization: string;
    movements: Movement[];
    totalHour: number;
  } & TimeStamp;

  type PaginationMetaData = {
    page: number;
    dataPerPage: number;
    total: number;
    pageCount: number;
  };

  type PaginateData<T> = {
    meta: PaginationMetaData;
    data: T;
  };
}

export {};
