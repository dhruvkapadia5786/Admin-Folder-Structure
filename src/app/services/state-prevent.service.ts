import { Injectable } from '@angular/core';

@Injectable()
export class StatePreventService {

    constructor(){
    }

    setVoiceCallId(id:string){
        localStorage.setItem('voice-call-id',id);
    }

    getVoiceCallId(){
        return localStorage.getItem('voice-call-id');
    }

    removeVoiceCallId(){
        return localStorage.removeItem('voice-call-id');
    }

    setVideoCallId(id:string){
        localStorage.setItem('video-call-id',id);
    }

    getVideoCallId(){
       return localStorage.getItem('video-call-id');
    }

    removeVideoCallId(){
        return localStorage.removeItem('video-call-id');
    }

}
