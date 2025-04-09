export const apiRoutes = {
    // Auth
    REGISTER:"/api/v1/auth/signup",
    LOGIN: '/api/v1/auth/login',
    GET_ALL_USERS: '/api/v1/auth/users',
    FORGET_PASSWORD:'/api/v1/auth/forget-password',
    CHANGE_PASSWORD: '/api/v1/auth',
    UPDATE_USER_BY_ID: '/api/v1/auth/users/',
    DELETE_USER_BY_ID: '/api/v1/auth/users/',
    GET_ALL_TENANTS: "/api/v1/auth/users/tenant",

    // Visitor
    ADD_VISITOR: '/api/visitors/register',
    GET_ALL_VISITORS: '/api/visitors/list',
    GET_VISITORS_BY_ID: '/visitors/{visitor_id}',
    DELETE_VISITOR_BY_ID: '/visitors/{visitor_id}',
    UPDATE_VISITOR_BY_ID: '/api/visitors/update/',
    GET_VISITORS_HEATMAP: '/analytics/heatmap',
    GET_VISITORS_COUNT: '/api/visitors/totalvisitors-count',
    CHECK_IN_VISITOR: '/api/visitors/checkin/',
    CHECK_OUT_VISITOR: '/visitors/checkout?token={visitor_id}',
    GET_HOURLY_VISITOR_FLOW: '/api/visitors/hourly-visitor-flow',
    GET_ALL_APPOINTMENTS: '/api/visitors/appointments',

    // Visitor Analytics
    //GET_VISITOR_ANALYTICS: '/analytics/visitor-analytics',
    GET_VISITORS_ANALYTICS:'/api/analytics/all-analytics',


    // Issue
    ADD_ISSUE: '/api/issues/report',
    GET_ALL_ISSUES: '/api/issues',
    GET_USER_ISSUES: '/api/issues/user-issues',
    GET_ISSUE_BY_ID: '/issues/{issue_id}',
    GET_ISSUE_STATUS_COUNT: '/api/issues/issues-status',
    UPDATE_ISSUE_BY_ID: '/api/issues',
    DELETE_ISSUE_BY_ID: '/issues/{issue_id}',
    GET_SPECIAL_ISSUE: '/api/issues/special-issues/',
    ADD_SPECIAL_ISSUE: '/api/issues/special-issues',

    // Office
    ADD_OFFICE: '/api/office',
    GET_ALL_OFFICES:'/api/office',
    GET_OFFICE_OCCUPANCY:'/api/office/occupancy',
    UPDATE_OFFICE:'/api/office/{office_id}',  //API to be created
    DELETE_OFFICE:'/api/office/{office_id}', //API to be created
    GET_AN_OFFICE:'/api/office/{office_id}', //API to be created

    // Upload file
    UPLOAD_FILE:'/files/upload',

    // Send Notification
    SEND_NOTIFICATION:'/alerts/notify',

    // Services
    ADD_SERVICE: '/api/services',
    GET_ALL_SERVICES: '/api/services',
    GET_SERVICE_BY_ID: '/api/services/{service_id}',
    UPDATE_SERVICE_BY_ID: '/api/services',
    DELETE_SERVICE_BY_ID: '/api/services/{service_id}',


    // Alerts
    GET_ALL_ALERTS: '/api/alerts/get-alerts',
    GET_TYPE_WISE_ALERTS: '/api/alerts/type-wise/',
    GET_ALERT_STATS: '/api/alerts/alert-stats',
    MARK_ALL_ALERTS_READ: '/api/alerts/updated-alert',



}