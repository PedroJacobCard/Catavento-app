import { google } from 'googleapis';
import { EventType } from './Types';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET, 
  process.env.NEXTAUTH_URL + '/api/auth/callback/google'
);

const calender = google.calendar({ version: 'v3', auth: oauth2Client });

export const createEvent = async (accessToken: string, event: EventType) => {
  oauth2Client.setCredentials({ access_token: accessToken });

  try {
    const response = await calender.events.insert({
      calendarId: 'primary',
      requestBody: event
    });

    console.log("Event created: ", response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating event: ", error);
    throw error;
  }
}