import { google } from 'googleapis';
import { GoogleEventData } from './Types';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET, 
  process.env.NEXTAUTH_URL
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client});

export const createEvent = async (refreshToken: string, event: GoogleEventData) => {

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        ...event,
        colorId: '5'
      }
    });

    if (!(response.status === 200)) {
      console.log("Error");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating event: ", error);
    throw error;
  }
}