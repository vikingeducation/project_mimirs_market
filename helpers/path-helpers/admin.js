const AdminHelper = {};

AdminHelper.adminIndexPath = () => '/admin';
AdminHelper.adminOrderPath = (id) => `/admin/${ id }`;

module.exports = AdminHelper;