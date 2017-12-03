
export function getAuthInstance() {
    return gapi.auth2.getAuthInstance()
}

export function getBasicProfile() {
    return getAuthInstance().currentUser.get().getBasicProfile()
}

export function isSignedIn() {
    return getAuthInstance().isSignedIn.get()
}

export function signOut() {
    return getAuthInstance().signOut();
}

export function getCurrentUser() {
    return getAuthInstance().currentUser.get();
}

export function getIdToken() {
    return getCurrentUser().getAuthResponse().id_token;
}

export function setCurrentUserListener(cb) {
    getAuthInstance().isSignedIn.listen(cb);
}