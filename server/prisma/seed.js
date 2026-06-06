import { prisma }  from "../src/client.js";
import { getPasswordHash } from "../src/utils/passwordActions.js";
import { Role, Method, InvStatus } from "@prisma/client";

async function main() {
    const adminPassHash = await getPasswordHash("adminpass", 10);

    const adminUser = await prisma.user.upsert({
        where: {
            username: 'admin1'
        },
        update: {
            surname: 'Админский',
            name: 'Админ',
            patronymic: 'Админович',
            password_hash: adminPassHash,
            role: Role.ADMIN
        },
        create: {
            username: 'admin1',
            surname: 'Админский',
            name: 'Админ',
            patronymic: 'Админович',
            password_hash: adminPassHash,
            role: Role.ADMIN
        }
    });

    const incidentTypes = await prisma.incidentType.createManyAndReturn({
        data: [
            {name: 'ДТП'},
            {name: 'Кража'},
            {name: 'Кража со взломом'},
            {name: 'Ограбление'},
            {name: 'Нападение'},
            {name: 'Нанесение телесных повреждений'},
            {name: 'Вооруженное нападение'},
            {name: 'Драка'},
            {name: 'Поножовщина'},
            {name: 'Убийство'},
            {name: 'Пьяный дебош'},
            {name: 'Домашнее насилие'},
            {name: 'Домогательство'},
            {name: 'Изнасилование'},
            {name: 'Совращение малолетних'},
            {name: 'Употребление наркотических веществ'},
            {name: 'Распространение наркотических веществ'},
            {name: 'Производство накотических веществ'},
            {name: 'Торговля людьми'},
            {name: 'Эксплуатация детского труда'},
            {name: 'Мошенничество'},
            {name: 'Вымогательство'},
            {name: 'Шантаж'},
            {name: 'Превышение должностных полномочий'},
            {name: 'Вандализм'},
        ],
        skipDuplicates: true,
    });

    const incidentStatuses = await prisma.incidentStatus.createManyAndReturn({
        data: [
            {name: 'Reviewed', description: 'На рассмотрении'},
            {name: 'Rejected', description: 'Отказано в возбуждении дела'},
            {name: 'Accepted', description: 'Удовлетворено ходатайство о возбуждении дела'},
            {name: 'Moved', description: 'Отправлено по территориальному признаку'},
        ],
        skipDuplicates: true,
    });

    const routes = await prisma.route.createManyAndReturn({
        data: [
            {name: '/api/auth/registration'},
            {name: '/api/auth/login'},
            {name: '/api/auth/logout'},
            {name: '/api/auth/refresh'},
            {name: '/api/'},
            {name: '/api/profile'},
            {name: '/api/incidents'},
            {name: '/api/incidents/:id'},
            {name: '/api/incidents/form/types'},
            {name: '/api/incidents/form/statuses'},
            {name: '/api/participants'},
            {name: '/api/participants/:id'},
            {name: '/api/participants/search?q={query}'},
            {name: '/api/involvements'},
            {name: '/api/involvements/:id'},
            {name: '/api/involvements/search?q={query}'},
        ],
        skipDuplicates: true,
    });

    console.log(routes.find(r => r.name == '/api/logout'));

    const permissions = await prisma.permission.createManyAndReturn({
        data: [
            {name: 'logout:delete', method: Method.DELETE, route_id: routes.find(r => r.name == '/api/auth/logout').route_id},
            {name: 'profile:read', method: Method.GET, route_id: routes.find(r => r.name == '/api/profile').route_id},
            {name: 'profile:redact', method: Method.PATCH, route_id: routes.find(r => r.name == '/api/profile').route_id},
            {name: 'incidents:write', method: Method.POST, route_id: routes.find(r => r.name == '/api/incidents').route_id},
            {name: 'incident:redact', method: Method.PATCH, route_id: routes.find(r => r.name == '/api/incidents/:id').route_id},
            {name: 'incident:delete', method: Method.DELETE, route_id: routes.find(r => r.name == '/api/incidents/:id').route_id},
            {name: 'incidents_types:read', method: Method.GET, route_id: routes.find(r => r.name == '/api/incidents/form/types').route_id},
            {name: 'incidents_statuses:read', method: Method.GET, route_id: routes.find(r => r.name == '/api/incidents/form/statuses').route_id},
            {name: 'participants:read', method: Method.GET, route_id: routes.find(r => r.name == '/api/participants').route_id},
            {name: 'participants:write', method: Method.POST, route_id: routes.find(r => r.name == '/api/participants').route_id},
            {name: 'participant:redact', method: Method.PATCH, route_id: routes.find(r => r.name == '/api/participants/:id').route_id},
            {name: 'participant:delete', method: Method.DELETE, route_id: routes.find(r => r.name == '/api/participants/:id').route_id},
            {name: 'involvements:write', method: Method.POST, route_id: routes.find(r => r.name == '/api/involvements').route_id},
            {name: 'involvement:redact', method: Method.PATCH, route_id: routes.find(r => r.name == '/api/involvements/:id').route_id},
            {name: 'involvement:delete', method: Method.DELETE, route_id: routes.find(r => r.name == '/api/involvements/:id').route_id},
        ],
        skipDuplicates: true,
    });

    const viewerPerms = [
        'logout:delete', 
        'profile:read', 
        'profile:redact', 
        'incidents:write', 
        'incidents_types:read',
        'incidents_statuses:read'
    ];

    let data = [];

    for (const perm of permissions) {
        data.push({role: Role.ADMIN, permission_id: perm.permission_id });
    }

    for (const viewerPerm of viewerPerms) {
        data.push({
            role: Role.VIEWER, 
            permission_id: permissions.find(p => p.name == viewerPerm).permission_id
        });
    }

    const rolePermissions = await prisma.rolePermission.createManyAndReturn({
        data: data,
        skipDuplicates: true,
    });

    data = [];

    for (const perm of permissions) {
        data.push({user_id: adminUser.user_id, permission_id: perm.permission_id});
    }

    const userPermissions = await prisma.userPermission.createManyAndReturn({
        data: data,
        skipDuplicates: true,
    });

    console.log("База данных успешно заполнена: ", adminUser, incidentTypes, incidentStatuses, routes, permissions, rolePermissions, userPermissions);
}

main()
    .catch((e) => {
        console.log("Ошибка при заполнении базы данных: ", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });