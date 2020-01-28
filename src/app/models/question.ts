
import {Choice} from './choice' ;

export interface Question {

    question: string;
    published_at:string ;
    url: string;
    choices: Choice[] ;
}