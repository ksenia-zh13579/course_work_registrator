// import { z } from 'zod';
import { registry } from './openapi';
import { incidentSchema } from '../validators/incidentsValidator';
import { participantSchema } from '../validators/participantsValidator';
import { involvementSchema } from '../validators/involvementsValidator';
import { profileResponseSchema } from '../validators/profileValidator';

registry.register('User', profileResponseSchema);
registry.register('Incident', incidentSchema);
registry.register('Participant', participantSchema);
registry.register('Involvement', involvementSchema);