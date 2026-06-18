import { http, HttpResponse } from 'msw';

let incidents = [
    { incident_id: 1, date: '2025-01-01', incident_type_id: 1, incident_type: 'Кража', incident_status_id: 2, incident_status: 'Рассмотрено', description: 'Опиc-е 1', reg_number: '111' },
    { incident_id: 2, date: '2025-01-02', incident_type_id: 2, incident_type: 'Нападение', incident_status_id: 1, incident_status: 'На рассмотрении', description: 'Опис-е 2', reg_number: '222' },
];

let participants = [
    { participant_id: 1, surname: 'Иванов', name: 'Иван', patronymic: 'Иванович', address: 'ул. Ленина, 10', crimial_records: 0 },
];

let involvements = [
    { involvement_id: 1, participant_id: 1, incident_id: 1, incident_type: 'Кража', full_name: 'Иванов И.И.', status: 'SUSPECT' },
];

let nextId = { incident: 3, participant: 2, involvement: 2 };

export const handlers = [
    // Auth
    http.get('/api/profile', () => {
        return HttpResponse.json({
            data: { user_id: 1, username: 'testuser', name: 'Тест', surname: 'Тестов', role: 'ADMIN' }, // Роль ADMIN, чтобы отрендерились кнопки
        });
    }),
    http.post('/api/auth/login', async ({ request }) => {
        const body = await request.json();
        if (body.username === 'testuser' && body.password === 'password123') {
            return HttpResponse.json({
                accessToken: 'mock-access-token',
                user: { id: 1, username: 'testuser', role: 'ADMIN' },
            });
        }
        return new HttpResponse(null, { status: 401 });
    }),
    http.post('/api/auth/register', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({
            accessToken: 'mock-access-token',
            user: { id: 2, username: body.username, role: 'VIEWER' },
        });
    }),
    http.post('/api/auth/refresh', () => {
        return HttpResponse.json({ accessToken: 'new-mock-token' });
    }),

    // Incidents Types & Statuses
    http.get('/api/incidents/form/types', () => {
        return HttpResponse.json({ 
            data: [
                { incident_type_id: 1, name: 'Кража' },
                { incident_type_id: 2, name: 'Нападение' },
            ] 
        });
    }),
    http.get('/api/incidents/form/statuses', () => {
        return HttpResponse.json({ 
            data: [
                { incident_status_id: 1, description: 'На рассмотрении' },
                { incident_status_id: 2, description: 'Рассмотрено' },
            ] 
        });
    }),

    // Incidents
    http.get('/api/incidents', ({ request }) => {
        const url = new URL(request.url);
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');
        let filtered = [...incidents]; // Убрана опечатка "incid ents"
        if (startDate) filtered = filtered.filter(i => i.date >= startDate);
        if (endDate) filtered = filtered.filter(i => i.date <= endDate);
        
        return HttpResponse.json({ data: filtered });
    }),
    http.post('/api/incidents', async ({ request }) => {
        const body = await request.json();
        const newIncident = {
            incident_id: nextId.incident++,
            date: body.date,
            incident_type_id: body.incident_type_id, // Убрана опечатка "incident_type_i d"
            incident_status_id: body.incident_status_id || 1,
            description: body.description || '',
            incident_type: 'Тип',
            incident_status: 'На рассмотрении',
            reg_number: body.reg_number || '',
        };
        incidents.push(newIncident);
        return HttpResponse.json({ data: newIncident }, { status: 201 });
    }),
    http.patch('/api/incidents/:id', async ({ params, request }) => {
        const id = parseInt(params.id);
        const body = await request.json();
        const index = incidents.findIndex(i => i.incident_id === id);
        if (index === -1) return new HttpResponse(null, { status: 404 });
        incidents[index] = { ...incidents[index], ...body };
        return HttpResponse.json({ data: incidents[index] });
    }),
    http.delete('/api/incidents/:id', ({ params }) => {
        const id = parseInt(params.id);
        incidents = incidents.filter(i => i.incident_id !== id);
        return new HttpResponse(null, { status: 204 });
    }),

    // Participants
    http.get('/api/participants', () => {
        return HttpResponse.json({ data: participants }); 
    }),
    http.post('/api/participants', async ({ request }) => {
        const body = await request.json();
        const newParticipant = { participant_id: nextId.participant++, ...body };
        participants.push(newParticipant);
        return HttpResponse.json({ data: newParticipant }, { status: 201 }); // Убрана опечатка "HttpRespo nse"
    }),
    http.patch('/api/participants/:id', async ({ params, request }) => {
        const id = parseInt(params.id);
        const body = await request.json();
        const index = participants.findIndex(p => p.participant_id === id);
        if (index === -1) return new HttpResponse(null, { status: 404 });
        participants[index] = { ...participants[index], ...body };
        return HttpResponse.json({ data: participants[index] });
    }),
    http.delete('/api/participants/:id', ({ params }) => {
        const id = parseInt(params.id);
        participants = participants.filter(p => p.participant_id !== id);
        return new HttpResponse(null, { status: 204 });
    }),

    // Involvements
    http.get('/api/involvements', () => {
        return HttpResponse.json({ data: involvements });
    }),
    http.post('/api/involvements', async ({ request }) => {
        const body = await request.json();
        const newInvolvement = {
            involvement_id: nextId.involvement++,
            ...body,
            incident_type: 'Кража',
            full_name: 'Участник',
        };
        involvements.push(newInvolvement);
        return HttpResponse.json({ data: newInvolvement }, { status: 201 });
    }),
    http.patch('/api/involvements/:id', async ({ params, request }) => {
        const id = parseInt(params.id);
        const body = await request.json();
        const index = involvements.findIndex(i => i.involvement_id === id);
        if (index === -1) return new HttpResponse(null, { status: 404 });
        involvements[index] = { ...involvements[index], ...body };
        return HttpResponse.json({ data: involvements[index] });
    }),
    http.delete('/api/involvements/:id', ({ params }) => {
        const id = parseInt(params.id);
        involvements = involvements.filter(i => i.involvement_id !== id);
        return new HttpResponse(null, { status: 204 });
    }),
];