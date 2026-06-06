import { prisma } from '../client.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getTypes = asyncHandler(async (req, res) => {
    const data = await prisma.incidentType.findMany({ 
        orderBy: { name: 'asc' } 
    });

    res.json({ data });
});