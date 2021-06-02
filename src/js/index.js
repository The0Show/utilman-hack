const { ipcRenderer } = require("electron");

window.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('selectFileButton').addEventListener('click', async () => {
        ipcRenderer.send('selectEXE');
    });

    document.getElementById('applyButton').addEventListener('click', async () => {
        ipcRenderer.send('applyRegedit', document.getElementById('selectFileBox').value);
    });

    document.getElementById('revertButton').addEventListener('click', async () => {
        ipcRenderer.send('resetKey', "nice");
    });
});

ipcRenderer.on('returnFilePaths', async (event, arg) => {
    console.log(arg);

    if(arg){
        document.getElementById('selectFileBox').value = arg;
        document.getElementById('applyButton').disabled = false;
    }
});