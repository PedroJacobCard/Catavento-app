import { Dispatch, ReactNode, SetStateAction } from "react";

//import enums
import { Role, Shift, Theme, Activities, Resources } from "./Enums";

export type SessionType = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: string;
  user: UserType;
};

export type ProfileType = {
  id: string;
  userId: string;
  userName?: string | null;
  connectedToCalender: boolean | null;
  role: Role | null;
  user: UserType;
  schoolCreated: SchoolType[];
  school: SchoolOnUserType[];
  remember: RememberType[];
  event: EventType[];
  report: ReportType[];
  createdAt: Date;
  updatedAt: Date;
};

export type UserType = {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: string | null;
  image?: string | null;
  connectedToCalender: boolean | null;
  role: Role | null;
  schoolCreated: SchoolType[];
  school: SchoolOnUserType[];
  remember: RememberType[];
  event: EventType[];
  report: ReportType[];
  accounts?: AccountType[] | null;
  sessions?: SessionType[];
  createdAt: Date;
  updatedAt: Date;
};

export type AccountType = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user: UserType;
};

export type ReportType = {
  id: string;
  authorName: string;
  schoolName: string;
  classAndShift: string;
  theme: Theme;
  activitiesDone: Activities[];
  coworkers: number;
  resources: Resources[];
  assistedInChaplaincy: number;
  chaplaincyObservation: string;
  createdAt: string;
};

export type EventType = {
  id: string;
  title: string;
  subject: string;
  location: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  date: string;
  organizerId: string;
  organizerSchool: string;
  createdAt: string;
  updatedAt: string;
};

export type SchoolType = {
  id: string;
  name: string;
  shift: Shift[] | string[];
  principal?: string;
  coordinator_morning?: string;
  coordinator_evening?: string;
  coordinator_night?: string;
  email?: string;
  telephone?: string;
  address?: string;
  class: ClassType[];
  remember: RememberType[];
  creatorId: string,
  createdAt: string;
  updatedAt: string;
};

export type SchoolOnUserType = {
  id: string,
  userId: string,
  schoolName: string,
  shifts: Shift[] | string[],
  createdAt: string,
  updatedAt: string
}

export type ClassType = {
  id: string;
  name: string;
  students: number;
  theme: Theme;
  schoolName: string;
  shift: Shift | string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RememberType = {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  schoolName: string;
  shift: Shift | string;
  createdAt: string;
  updatedAt: string;
};

//children pops comum para provedores de contextos
export type ChildrenPropsType = {
  children: ReactNode;
};

//props dos formulários de edição para fazer o toggle do formulário
export type EditPropType = {
  showForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
};

//types de contextos
export type UseUserContextType = {
  user: ProfileType | null;
  setFetchProfile: Dispatch<SetStateAction<boolean>>;
  setUserUpdated: Dispatch<SetStateAction<ProfileType | null>>
};

export type UseUsersContextType = {
  users: UserType[] | null;
};

export type UseRemeberContextType = {
  remembers: RememberType[] | null;
}

export type UseEventContextType = {
  events: EventType[] | null;
}

export type UseReportContextType = {
  reports: ReportType[] | null;
}

export type UseClassContextTypes = {
  classes: ClassType[] | null;
};

export type InitSchoolOnUserType = {
  schoolName: string;
  shifts: (string | Shift)[];
};

//tipos do objeto que será feito para o download da tabela de dados qualitativos
export  type DownloadDataTableOfQualityType = {
  name: string;
  uniqueThemes: string;
  totalStudents: number;
  notAccomplishedThemes: string;
  totalStudentsNotDone: number;
  shift: string;
  coordinatorName?: string
};