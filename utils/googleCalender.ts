import { google } from 'googleapis';
import { GoogleEventData } from './Types';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET, 
  process.env.NEXTAUTH_URL
);

const calendar = google.calendar({ version: 'v3', auth: process.env.NEXT_PUBLIC_GOOGLE_API_KEY});
const scopes: string[] = [
  'https://www.googleapis.com/auth/calendar.events'
];

export const createEvent = async (accessToken: string, event: GoogleEventData) => {

  oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });

  oauth2Client.setCredentials({ access_token: accessToken });

  try {
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      requestBody: {
        ...event,
        colorId: '5'
      }
    });

    if (!(response.status === 200)) {
      console.log("Error");
    }

    console.log("Event created: ", response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating event: ", error);
    throw error;
  }
}