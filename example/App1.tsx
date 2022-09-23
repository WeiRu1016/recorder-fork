import * as React from 'react';
import Recorder from 'recorder-js';

declare let window: any;

export default () => {
    const [blob, setBlob] = React.useState(null);
    const [recorder] = React.useState(() => {
        const audioContext =  new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
 
        const recorder = new Recorder(audioContext, {
            // An array of 255 Numbers
            // You can use this to visualize the audio stream
            // If you use react, check out react-wave-stream
            // onAnalysed: data => console.log(data),
        });
        return recorder;
    });
    const [isRecording, setIsRecording] = React.useState(false);

    React.useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => recorder.init(stream))
            .catch(err => console.log('Uh oh... unable to get stream...', err));
    }, []);

    const startRecording = () => {
        recorder.start().then(() => setIsRecording(true));
    }
    const stopRecording = () => {
        recorder.stop().then(({ blob }) => {
            setBlob(blob);
        })
    }
       
    function download() {
        Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
    }

    return (
        <div>
            {isRecording ? <button onClick={stopRecording}>结束录音</button> : <button onClick={startRecording}>开始录音</button>}
            {!!blob && <button onClick={download}>下载</button>}
        </div>
    );
}