import { prisma } from "../client.js";

export const getUserById = async (user_id) => {
    const userFromBD = await prisma.user.findUnique({
        where: { user_id },
    });
    return userFromBD;
};

export const getUserByUsername = async (username) => {
    const userFromBD = await prisma.user.findUnique({ 
        where: { username } 
    });
    return userFromBD;
};

export const getIncidentById = async (incident_id) => {
    const incidentFromBD = await prisma.incident.findUnique({
        where: { incident_id },
    });
    return incidentFromBD;
};

export const getParticipantById = async (participant_id) => {
    const participantFromBD = await prisma.participant.findUnique({
        where: { participant_id },
    });
    return participantFromBD;
};

export const getInvolvementById = async (involvement_id) => {
    const involvementFromBD = await prisma.involvement.findUnique({
        where: { involvement_id },
    });
    return involvementFromBD;
};