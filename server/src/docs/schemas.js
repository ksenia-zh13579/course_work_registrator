import { registry } from './openapi.js';
import { incidentSchema } from '../validators/incidentsValidator.js';
import { participantSchema } from '../validators/participantsValidator.js';
import { involvementSchema } from '../validators/involvementsValidator.js';
import { profileResponseSchema } from '../validators/profileValidator.js';

registry.register('User', profileResponseSchema);
registry.register('Incident', incidentSchema);
registry.register('Participant', participantSchema);
registry.register('Involvement', involvementSchema);