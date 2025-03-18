const getCommonData = () => {
    try {
        const resData = JSON.parse(localStorage.getItem('persist:chat') || '{}');
        return {
            currentUser: resData.user ? JSON.parse(resData.user) : null,
            token: resData.accessToken ? JSON.parse(resData.accessToken) : null
        };
    } catch (error) {
        return {
            currentUser: null,
            token: null
        };
    }
};

export const { currentUser, token } = getCommonData();