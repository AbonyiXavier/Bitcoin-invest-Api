import { Roles } from '../models/role.model';

export = [
  {
    name: 'Administrator',
    permissions: ['role.view'],
    description: 'Admin privillage',
  },
  {
    name: 'Super Admin',
    permissions: ['role.view', 'role.manage'],
    description: 'Sper Admin privillage',
  },
];
