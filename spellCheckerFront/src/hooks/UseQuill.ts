import {RefObject, useEffect, useState} from "react";
import Quill from 'quill'

interface Position{start:number,end:number}
function useQuill(ref:RefObject<any>){

    const [Editor,setEditorRef] = useState<Quill|null>(null)
    useEffect(() => {
        setEditorRef(ref.current.getEditor())
    }, [ref])
    function getWords() {
        let text = Editor?.getText();
        text = text?.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
        const words = text?.split(/\s+/);
        return words?.filter((word:string) => word.trim() !== '') || [];
    };

    function findWordPosition(word:string) {
        const text = Editor?.getText() || '' ;
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        let match;
        const matches = []
        while ((match = regex.exec(text)) !== null) {
            matches.push({start: match.index, end: match[0].length,word});
        }
        return matches
    }

    function removeAllUnderlines(){
        const text = Editor?.getText() ||'';
        Editor?.formatText(0, text.length, 'underline', false)
    }

    function underlineWordAtPosition(positions:Position[]) {
        positions.forEach((item:Position) => {
            Editor?.formatText(item.start, item.end, 'underline', true)
            Editor?.format('underline', false);
        })
    };

    function replaceWord(start:number,end:number,word:string){
        Editor?.deleteText(start,end)
        Editor?.insertText(start,word)
    }
    function isCurrentWordIsWrong(wrongWords: any[], position: { index: number }){
       return  wrongWords?.find(item=>item.start<=position.index && item.start+item.end >=position.index)
    }
    return {getWords,findWordPosition,removeAllUnderlines,underlineWordAtPosition,replaceWord,isCurrentWordIsWrong};
}


export  default useQuill;
