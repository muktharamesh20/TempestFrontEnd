import { supabase } from '@/constants/supabaseClient.js';
import ical from 'ical'; // make sure you have this installed
import { authorize } from 'react-native-app-auth';
import * as types from './utils.js';

// Import events from any calendar source
export async function importFromSource(
    source: types.CalendarSource
): Promise<types.EventDetailsForNow[]> {
    switch (source.type) {
        case "google":
            if (!source.authToken || !source.calendarId) return [];
            return importFromGoogle(source);
        case "canvas":
            if (!source.authToken) return [];
            return importFromCanvas(source);
        case "ical":
            if (!source.calendarId) return [];
            return importFromICal(source);
        default:
            return [];
    }
}

// Google calendar functions
async function importFromGoogle(source: types.CalendarSource): Promise<types.EventDetailsForNow[]> {
    const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(source.calendarId!)}/events?singleEvents=true&orderBy=startTime`,
        {
            headers: { Authorization: `Bearer ${source.authToken}` },
        }
    );

    if (!res.ok) throw new Error("Failed to fetch Google Calendar events");
    const data = await res.json();

    return data.items.map((event: any): types.EventDetailsForNow => ({
        id: event.id,
        title: event.summary ?? "Untitled Event",
        start_date: new Date(event.start.dateTime || event.start.date),
        end_date: new Date(event.end.dateTime || event.end.date),
        event_color: source.color,
        end_repeat: event.recurrence ? new Date(event.end.dateTime || event.end.date) : new Date(event.end.dateTime || event.end.date),
        weekdays: [], // Google API doesn't return weekdays directly
        repeat: event.recurrence ? "weekly" : "none", // simplistic assumption
        isAllDay: !!event.start.date,
        sourceId: source.id,
        location: event.location ?? "",
    }));
}

export async function fetchGoogleCalendars(accessToken: string) {
    const res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Error fetching calendars: ${res.statusText}`);
    const data = await res.json();

    return data.items.map((cal: any) => ({
        id: cal.id,
        name: cal.summary,
        color: cal.backgroundColor || "#4285F4",
        isEnabled: true,
        type: "google",
        calendarId: cal.id,
    }));
}

// Canvas calendar functions
async function importFromCanvas(source: types.CalendarSource): Promise<types.EventDetailsForNow[]> {
    const res = await fetch(`https://canvas.instructure.com/api/v1/calendar_events?all_events=true`, {
        headers: { Authorization: `Bearer ${source.authToken}` },
    });

    if (!res.ok) throw new Error("Failed to fetch Canvas events");
    const events = await res.json();

    return events.map((ev: any): types.EventDetailsForNow => ({
        id: ev.id,
        title: ev.title,
        start_date: new Date(ev.start_at),
        end_date: new Date(ev.end_at),
        event_color: source.color,
        end_repeat: new Date(ev.end_at),
        weekdays: [],
        repeat: ev.recurrence ? "weekly" : "none",
        isAllDay: false,
        sourceId: source.id,
        location: ev.location_name ?? "",
    }));
}

// iCal functions
async function importFromICal(source: types.CalendarSource): Promise<types.EventDetailsForNow[]> {
    const res = await fetch(source.calendarId!); // using calendarId to store iCal URL
    const text = await res.text();
    const data = ical.parseICS(text);

    return Object.values(data)
        .filter((evt: any) => evt.type === 'VEVENT')
        .map((event: any): types.EventDetailsForNow => ({
            id: event.uid,
            title: event.summary ?? "Untitled Event",
            start_date: new Date(event.start),
            end_date: new Date(event.end),
            event_color: source.color,
            end_repeat: new Date(event.end),
            weekdays: [],
            repeat: "none",
            isAllDay: event.datetype === 'date' ? true : false,
            sourceId: source.id,
            location: event.location ?? "",
        }));
}

// Connect Google Account and save in Supabase
const googleConfig = {
    issuer: 'https://accounts.google.com',
    clientId: '<YOUR_GOOGLE_CLIENT_ID>',
    redirectUrl: '<your.app:/oauthredirect>',
    scopes: [
        'openid',
        'profile',
        'email',
        'https://www.googleapis.com/auth/calendar.readonly'
    ]
};

export async function connectGoogleAccount(supabaseUserId: string) {
    const result = await authorize(googleConfig);
    const email = await getGoogleEmail(result.accessToken);

    // Save as a CalendarSource in Supabase table `calendar_sources`
    await supabase
        .from('calendar_sources')
        .insert({
            owner_id: supabaseUserId,
            type: 'google',
            name: email,
            color: '#4285F4',
            is_enabled: true,
            auth_token: result.accessToken,
            calendar_id: '', // You can set default or let user pick
        });
}

async function getGoogleEmail(accessToken: string) {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const json = await res.json();
    return json.email;
}
