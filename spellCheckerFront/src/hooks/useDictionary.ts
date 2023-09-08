import {useEffect, useState} from "react";
import useCookie from "./useCookie";

function useDictionary(){

    const [dictionary,setDictionary] = useState<string[]>([])
    const [ignoreList,setIgnoreList] =  useState<string[]>([])
    const {get,set} = useCookie()

    useEffect(() => {
        const dictionaryCookie = JSON.parse(get('dictionary')) || []
        const ignoreCookie = JSON.parse(get('ignore')) || []
        setDictionary(dictionaryCookie);
        setIgnoreList(ignoreCookie);
    }, []);

   function setDictionaryItem(word:string){
        const dictionary = JSON.parse(get('dictionary')) || []
        dictionary.push(word)
        setDictionary(dictionary)
        set('dictionary',JSON.stringify(Array.from(new Set(dictionary))),1000);
    }

    function setIgnore(word:string){
        const IgnoreList = JSON.parse(get('ignore')) || []
        IgnoreList.push(word)
        setIgnoreList(IgnoreList)
        set('ignore',JSON.stringify(Array.from(new Set(IgnoreList))),0);
    }

    return  {dictionary,setDictionaryItem,ignoreList,setIgnore};
}

export default useDictionary;
