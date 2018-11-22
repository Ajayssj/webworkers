let speed = 15; // in KB/s;
function startDownload(){
    speed = Math.ceil(Math.random() * 100); // getting random speed
    postMessage({speed});
    setTimeout("startDownload()",100);
}
startDownload();

/* self.addEventListener('message', (e) => {
    this.completed = e.data.completed;
    startDownload();
}) */