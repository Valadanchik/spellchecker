import {useEffect, useState} from 'react';
import axios from 'axios';
import {CancelTokenSource} from "axios/index";

function useCheckDataSpell() {
    const [data, setData] = useState<any>({});
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<Boolean>(false);
    const [source, setSource] = useState<CancelTokenSource>(); // Axios cancel token source

    const sendPostRequest = async (words:string[],lang:string) => {
        if (source) {
            source.cancel('Request cancelled due to duplicate request');
        }
        setLoading(true);
        // Create a new cancel token source
        const cancelTokenSource = axios.CancelToken.source();
        setSource(cancelTokenSource);

        const url = 'http://127.0.0.1:8000/api/spell/check'
        try {
            const response = await axios.post(url, {words,lang},{
                cancelToken: cancelTokenSource.token,
            });
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err);
            setData([]);

        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        return () => {
            if (source) {
                source.cancel('Request cancelled due to component unmount');
            }
        };
    }, [source]);

    return {data, error, loading, sendPostRequest};
}

export default useCheckDataSpell;
