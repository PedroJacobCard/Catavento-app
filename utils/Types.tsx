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

export type UserType = {
  [x: string]: any;
  user: any;
  id: string;
  name: string;
  email: string;
  emailVerified: string;
  image: string;
  connectedToCalender: boolean;
  role: Role | string;
  schoolCreated: SchoolType[];
  school: SchoolOnUserType[];
  remember: RememberType[];
  event: EventType[];
  report: ReportType[];
  accounts?: AccountType[];
  sessions?: SessionType[];
  createdAt: string;
  updatedAt: string;
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
  shift: Shift;
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
  shift: Shift;
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
  shift: Shift;
  createdAt: string;
  updatedAt: string;
};

export type ChildrenPropsType = {
  children: ReactNode;
};

export type EditPropType = {
  showForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
};