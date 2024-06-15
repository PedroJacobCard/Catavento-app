import { google } from 'googleapis';
import { GoogleEventData } from './Types';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET, 
  process.env.NEXTAUTH_URL
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client});

//Cretate event
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

//Update event
export const updateEvent = async (refreshToken: string, event: GoogleEventData, eventId: string) => {

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: {
        ...event,
        colorId: '5'
      }  
    });

    if (!response.data) {
      console.log("Error on updating event at Google Calendar");
    }

    console.log("Event successfully updated!");
    return response.data;
  } catch (error) {
    console.error("Something went wrong...")
  }
}

//Delete event
export const deleteEvent = async (refreshToken: string, eventId: string) => {

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const response = await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId
    });

    if (!response) {
      console.log("Error on deleting event at Google Calendar");
    }

    console.log("Event successfully deleted!");
    return response;
  } catch (error) {
    console.error("Something went wrong...")
  }
}