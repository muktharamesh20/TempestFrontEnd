import * as AuthSession from 'expo-auth-session';
import * as types from './utils.js';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export async function connectGoogleAccount() {

  const request = new AuthSession.AuthRequest({
    clientId: '289921075848-55q7g35vtnagqap570jlh7n5gb1hbf4q.apps.googleusercontent.c',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: [
      'openid',
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar.readonly',
    ],
    responseType: AuthSession.ResponseType.Code, // ⚠️ Authorization Code Flow
  });

  await request.promptAsync(discovery).then(async (result) => {
    if (result.type === 'success' && result.params.code) {
      const code = result.params.code;

      // Exchange code for access token
      const tokenRes = await fetch(discovery.tokenEndpoint!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: '289921075848-55q7g35vtnagqap570jlh7n5gb1hbf4q.apps.googleusercontent.c',
          redirect_uri: request.redirectUri!,
          grant_type: 'authorization_code',
        }).toString(),
      });

      const tokenJson = await tokenRes.json();
      const accessToken = tokenJson.access_token;

      const email = await getGoogleEmail(accessToken);
      console.log('Google account connected:', email);
    } else {
      console.log('Failed to connect Google account', result);
    }
  });
}

export async function connectCanvasAccount(userToken: string): Promise<types.CalendarSource> {
    // Fetch basic profile to name the source
    const res = await fetch('https://canvas.instructure.com/api/v1/users/self/profile', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch Canvas profile');
  
    const profile = await res.json();
  
    const newSource: types.CalendarSource = {
      id: profile.id.toString(),
      type: 'canvas',
      name: profile.name || 'Canvas Account',
      color: '#ff6f61',
      isEnabled: true,
      authToken: userToken,
      calendarId: '', // user can pick later
    };
  
    return newSource;
  }

  export async function connectBlackboardAccount(userToken: string): Promise<types.CalendarSource> {
    // Blackboard API varies by institution
    const res = await fetch('https://YOUR_SCHOOL.blackboard.com/learn/api/public/v1/users/me', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch Blackboard profile');
  
    const profile = await res.json();
  
    const newSource: types.CalendarSource = {
      id: profile.id,
      type: 'blackboard',
      name: profile.name || 'Blackboard Account',
      color: '#3b5998',
      isEnabled: true,
      authToken: userToken,
      calendarId: '', // user can pick later
    };
  
    return newSource;
  }
  
  


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
// import ICAL from 'ical.js';

// export async function importFromICal(source: types.CalendarSource): Promise<types.EventDetailsForNow[]> {
//   const res = await fetch(source.calendarId!);
//   const text = await res.text();

//   const jcalData = ICAL.parse(text);
//   const comp = new ICAL.Component(jcalData);
//   const events = comp.getAllSubcomponents('vevent');

//   return events.map((eventComp: any) => {
//     const event = new ICAL.Event(eventComp);
//     return {
//       id: event.uid,
//       title: event.summary,
//       start_date: event.startDate.toJSDate(),
//       end_date: event.endDate.toJSDate(),
//       event_color: source.color,
//       end_repeat: event.endDate.toJSDate(),
//       weekdays: [],
//       repeat: eventComp.getFirstPropertyValue('rrule') ? 'weekly' : 'none',
//       isAllDay: event.startDate.isDate,
//       sourceId: source.id,
//       location: event.location ?? '',
//     };
//   });
// }


import axios from 'axios';
import ICAL from 'ical.js';

export async function importFromICal(source: types.CalendarSource): Promise<types.EventDetailsForNow[]> {
  if (!source.calendarId && !source.authToken) {
    console.warn('No calendar URL provided for importFromICal');
    return [];
  }

  // Decide which field has the ICS URL
  const icalUrl = source.type === 'ical' ? source.calendarId! : (source.authToken ?? '');

  try {
    const response = await axios.get(icalUrl);
    const rawData = response.data;

    console.log(`Raw ICS data for ${source.type}:`, rawData.slice(0, 500)); // log first 500 chars

    // Parse with ical.js
    const jcalData = ICAL.parse(rawData);
const comp = new ICAL.Component(jcalData);
const vevents = comp.getAllSubcomponents('vevent');

const events: types.EventDetailsForNow[] = vevents.map(vevent => {
  const event = new ICAL.Event(vevent);
  const rrule = vevent.getFirstPropertyValue('rrule'); // recurrence rule if any

  return {
    id: event.uid,
    title: event.summary ?? 'Untitled Event',
    start_date: event.startDate.toJSDate(),
    end_date: event.endDate.toJSDate(),
    event_color: source.color,
    end_repeat: event.endDate.toJSDate(),
    weekdays: [], // could parse rrule.freq etc. if needed
    repeat: rrule ? 'weekly' : 'none', // very basic recurrence
    isAllDay: event.startDate.isDate,
    sourceId: source.id,
    location: event.location ?? '',
  };
});

console.log(`Parsed ${events.length} events from ${source.type}`);
return events;


  } catch (err) {
    console.error(`Failed to import ${source.type} events:`, err);
    return [];
  }
}


export async function importTodosFromICal(source: types.CalendarSource): Promise<types.TodoDetails[]> {
    if (!source.calendarId && !source.authToken) {
      console.warn('No calendar URL provided for importTodosFromICal');
      return [];
    }
  
    // Decide which field has the ICS URL
    const icalUrl = source.type === 'ical' ? source.calendarId! : (source.authToken ?? '');
  
    try {
      const response = await axios.get(icalUrl);
      const rawData = response.data;
  
      console.log(`Raw ICS data for ${source.type}:`, rawData.slice(0, 500)); // log first 500 chars
  
      // Parse with ical.js
      const jcalData = ICAL.parse(rawData);
      const comp = new ICAL.Component(jcalData);
      const vTodos = comp.getAllSubcomponents('vtodo');
  
      const todos: types.TodoDetails[] = vTodos.map(vtodo => {
        const todo = new ICAL.Todo(vtodo);
        const rrule = vtodo.getFirstPropertyValue('rrule'); // recurrence rule if any
  
        return {
          id: todo.uid,
          title: todo.summary ?? 'Untitled Todo',
          notes: todo.description ?? '',
          created_at: new Date().toISOString(), // ICS doesn't carry this, so fallback to now
          deadline: todo.due ? todo.due.toJSDate().toISOString() : null,
          start_date: todo.startDate ? todo.startDate.toJSDate().toISOString() : null,
          end_repeat: todo.due ? todo.due.toJSDate().toISOString() : null,
          weekdays: [], // could parse rrule.freq/byday if needed
          repeat_every: rrule ? 'weekly' : 'none', // very basic recurrence handling
          todo_color: source.color,
          location: todo.location ?? null,
  
          // Fields that ICS usually won’t provide → fill with defaults
          all_members_must_complete: false,
          assigned_by: '',
          completed_by: null,
          group_id: null,
          habit: false,
          person_id: null,
          priority: null,
          privacy: 0,
        };
      });
  
      console.log(`Parsed ${todos.length} todos from ${source.type}`);
      return todos;
  
    } catch (err) {
      console.error(`Failed to import ${source.type} todos:`, err);
      return [];
    }
  }



// export async function connectGoogleAccount(
//   supabaseUserId: string,
//   supabase: SupabaseClient<Database>
// ): Promise<types.CalendarSource> {
//   const result = await authorize(googleConfig);
//   const email = await getGoogleEmail(result.accessToken);

//   // Tell Supabase the type of your table row
//   const { data, error } = await supabase
//     .from('calendar_sources')
//     .insert({
//       owner_id: supabaseUserId,
//       type: 'google',
//       name: email,
//       color: '#4285F4',
//       is_enabled: true,
//       auth_token: result.accessToken,
//       calendar_id: '', // default empty, user can pick later
//     })
//     .select(); // important: return the inserted row

//   if (error || !data || data.length === 0) {
//     throw new Error('Failed to save Google account: ' + (error?.message || 'Unknown error'));
//   }

//   const newSource: types.CalendarSource = {
//     id: data[0].id,
//     type: 'google',
//     name: email,
//     color: '#4285F4',
//     isEnabled: true,
//     authToken: result.accessToken,
//     calendarId: '', // default empty, can be updated later
//   };

//   return newSource;
// }


async function getGoogleEmail(accessToken: string) {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const json = await res.json();
    return json.email;
}
