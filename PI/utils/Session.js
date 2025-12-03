let currentUser = null;

export const setUsuarioActual = (usuario) => {
    currentUser = usuario;
};

export const getUsuarioActual = () => {
    return currentUser;
};

export const cerrarSesion = () => {
    currentUser = null;
};
