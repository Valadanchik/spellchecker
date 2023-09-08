import ReactQuill,{UnprivilegedEditor} from 'react-quill';
import { RangeStatic, Sources} from 'quill';
import React, {useEffect, useRef, useState} from 'react';
import useCheckDataSpell from "../hooks/UseCheckDataSpel";
import {SuggestionModal} from "./suggestionModal";
import useOutsideClickHandler from "../hooks/onOutsideClick";
import useQuill from "../hooks/UseQuill";
import useDictionary from "../hooks/useDictionary";
interface Position{start:number,end:number}
export function Editor({lang}:{lang:string}) {
    const [value, setValue] = useState<string>('');
    const [words, setWords] = useState<string[]>();
    const [wrongWords, setWrongWords] = useState<Position[]>([]);
    const [suggestions, setSuggestData] = useState<any>();
    const [showModal, setShowModal] = useState<boolean>(false);

    const QuillRef = useRef<ReactQuill>(null);
    const suggestionRef = useRef<HTMLDivElement>(null);

    const {isCurrentWordIsWrong,replaceWord,getWords,findWordPosition,removeAllUnderlines,underlineWordAtPosition} = useQuill(QuillRef);
    const {data, sendPostRequest} = useCheckDataSpell();
    const {dictionary,ignoreList,setIgnore,setDictionaryItem} = useDictionary();
    useOutsideClickHandler(suggestionRef,()=>{setShowModal(false)})

    useEffect(() => {
       if (Object.keys(data).length ) checkTextForMistakes(Object.keys(data))
    }, [data,dictionary,ignoreList])

    useEffect(()=>{
        setShowModal(false)
    },[dictionary,ignoreList])
    function checkTextForMistakes(wrongWords:string[]){
        const positions:any[] = []
        const words = getWords();
        setWords(words)
        removeAllUnderlines()
        if (wrongWords.length) {
            words.forEach((item:string) =>
                ( wrongWords.includes(item)
                    // @ts-ignore
                && ![...dictionary,...ignoreList].includes(item))
                &&  positions.push(...findWordPosition(item)))
            if (positions.length)
                underlineWordAtPosition(positions)
        }
        setWrongWords(positions)
    }
    async function handleChange(value:string) {
        setValue(value)
        const wordsArr = getWords();
        if(JSON.stringify(wordsArr) !== JSON.stringify(words)){
            await sendPostRequest(wordsArr,lang)
        }
    }
    function handleChangeSelection(selection:RangeStatic,source:Sources,editor:UnprivilegedEditor){
        const pos = editor.getSelection()
        if(pos){
            const wordData = isCurrentWordIsWrong(wrongWords,pos)
            if(wordData){
                const positions=editor.getBounds(wordData.start)
                setSuggestData({suggestions:data[wordData.word],word:wordData,positions})
                setShowModal(true)
            }
        }
    }
        function handleSelectSuggestion(word:string, oldWord:{start:number,end:number}){
            setShowModal(false)
            replaceWord(oldWord.start,oldWord.end,word)
        }
    return (<div className='editorContainer' >
        <ReactQuill ref={QuillRef} value={value} onChangeSelection={handleChangeSelection} onChange={handleChange}/>
        <div ref={suggestionRef}>
            <SuggestionModal setIgnore={setIgnore} setDictionaryItem={setDictionaryItem}   handleSelectSuggestion={handleSelectSuggestion} suggestions={suggestions} show={showModal}/>
        </div>
    </div>)
}
