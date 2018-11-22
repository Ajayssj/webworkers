var w;
let completed = 0;
let size = 1024 * 250; // in KB
const states = ['start','stop','pause','resume'];
let currentSSState = 0, nextSSState = 1;
let currentPRState = 3, nextPRState = 2;
function startWorker(completedArg = 0) {
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("web_worker.js");
            w.postMessage({completedArg});
        }
        w.onmessage = function(event) {
            completed += event.data.speed;
            renderDownlaodText(event.data.speed);
        };
    } else {
        alert("Sorry! No Web Worker support.");
    }
}
function renderDownlaodText(speed = 0){
   $("#downloadResult").html('Downloaded ( '+ (size / 1024) +'/' + (completed / 1024).toFixed(2) + ' MB)  - ' + ( completed / size).toFixed(2) * 100 + ' %  [ speed - ' + speed + ' KB/s ]');
}
function stopWorker() { 
    if(w != undefined){
        w.terminate();
        w = undefined;
    }
}

window.addEventListener('load',() => {
    let sizeEle = $('#size');
    sizeEle.html((size / 1024) + ' MB');
    bindEvents();
})
function bindEvents(){
    $('#startStopBtn').click(function(btn){
        $(this).html(states[nextSSState]);
        currentSSState = nextSSState;
        let tmpNextState; 
        if(currentSSState == 1){
            tmpNextState = 0;
            startWorker();
            $('#pauseResumeBtn').show()  
        }else{
            stopWorker();
            tmpNextState = 1;
            completed = 0;
            speed = 0;
            renderDownlaodText();
            $('#pauseResumeBtn').hide()  
        }   
        nextSSState = tmpNextState;
    })
    $('#pauseResumeBtn').click(function(btn){
        $(this).html(states[nextPRState]);
        currentPRState = nextPRState;
        let tmpNextPRState;
        if(currentPRState == 2){
            tmpNextPRState = 3
            stopWorker();
        }else{
            startWorker(completed);
            tmpNextPRState = 2;
        }
        nextPRState = tmpNextPRState;
    })
}