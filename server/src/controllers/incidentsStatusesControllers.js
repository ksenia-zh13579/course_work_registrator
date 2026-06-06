import { prisma } from '../client.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStatuses = asyncHandler(async (req, res) => {
    const data = await prisma.incidentStatus.findMany({ 
        orderBy: { name: 'asc' } 
    });

    res.json({ data });
});