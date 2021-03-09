const { requiresAuth } = require('../app-setting');

exports.DoesUserHavePermission = async (userInfo, permission) => {

    if (!requiresAuth)
        return { message: '', result: true, statusCode: '' };

    //console.log('permission', userInfo.permissions);

    try { 
        if (userInfo) {
            if (userInfo.userType === "Admin" || userInfo.userType === "Superuser")
                return { message: '', result: true, statusCode: '' };
            if (!userInfo.isActive)
                return { message: "The user account is inactive", result: false, statusCode: 200 };

            const userPermission = userInfo.permissions.filter(c => c.name === permission && c.isGranted === true);
            if (userPermission && userPermission.length === 1)
                return { message: '', result: true, statusCode: '' };

            return { message: "Access to this section has been forbidden", result: false, statusCode: 403 };
        }
        else {
            return { message: "User not found", result: false, statusCode: 401 };
        }
    } catch (error) {  
        return { message: `check permission(${userInfo.id},${permission})`, result: false, statusCode: 500 };
    }
}