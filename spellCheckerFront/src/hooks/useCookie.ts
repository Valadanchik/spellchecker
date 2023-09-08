import { useState, useEffect } from 'react';

function getCookie(name:string) {
    const cookieValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return cookieValue ? cookieValue[2] : null;
}

function setCookie(name:string, value:string, days:number) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = days? '; expires=' + expirationDate.toUTCString():' ';
    document.cookie = name + '=' + value + expires + ';path=/';
}

function removeCookie(name:string) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
}

const useCookies = () => {
    const [cookies, setCookies] = useState<{[index: string]:any} >({});

    useEffect(() => {
        const allCookies = document.cookie.split(';').reduce((acc, current) => {
            const [name, value] = current.trim().split('=');
            return { ...acc, [name]: value };
        }, {});
        setCookies(allCookies);
    }, []);

    const get = (name:string):string => cookies[name] || getCookie(name);

    const set = (name:string, value:string, days = 7) => {
        setCookie(name, value, days);
        setCookies({ ...cookies, [name]: value });
    };

    const remove = (name:string) => {
        removeCookie(name);
        const { [name]: removedCookie, ...restCookies } = cookies;
        setCookies(restCookies);
    };

    return { cookies, get, set, remove };
};

export default useCookies;
