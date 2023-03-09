class DropBoxController {
    constructor() {
        this.btnSendFileEl = document.querySelector("#btn-send-file");
        this.inputFilesEl = document.querySelector("#files");
        this.snackModalEl = document.querySelector("#react-snackbar-root")
        this.progressbarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        this.nameFileEl = this.snackModalEl.querySelector('.filename');
        this.timeLeftEl = this.snackModalEl.querySelector('.timeleft');
        this.initEvents();
    }

    initEvents() {
        this.btnSendFileEl.addEventListener("click", (e) => {
            this.inputFilesEl.click();
        })

        this.inputFilesEl.addEventListener("change", (e) => {
            this.uploadTask(e.target.files)
            this.modalShow();
            this.inputFilesEl.value = '';
        })
    }

    modalShow(show = true) {
        this.snackModalEl.style.display = (show) ? 'block' : 'none';
    }

    uploadTask(files) {
        let promises = [];

        [...files].forEach((file) => {
            promises.push(new Promise((resolve, reject) => {
                let ajax = new XMLHttpRequest();
                ajax.open("POST", "/upload");

                ajax.onload = (e) => {
                    this.modalShow(false);
                    try {
                        resolve(JSON.parse(ajax.responseText));
                    } catch (e) {
                        reject(e);
                    }
                }

                ajax.onerror = (e) => {
                    this.modalShow(false);
                    reject(e);
                }

                ajax.upload.onprogress = (e) => {
                    this.uploadProgress(e, file);
                }

                let formData = new FormData;
                formData.append('input-file', file);
                this.startUploadTime = Date.now();
                ajax.send(formData);
            }))
        })

        return Promise.all(promises);
    }

    uploadProgress(event, file) {
        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded / total) * 100);
        let timeLeft = ((100 - porcent) * timespent) / porcent;

        this.progressbarEl.style.width = `${porcent}%`;

        this.nameFileEl.innerHTML = file.name;
        this.timeLeftEl.innerHTML = this.formatTimeToHuman(timeLeft);
    }

    formatTimeToHuman(duration) {
        let secunds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${secunds} segundos`;
        }

        if (minutes > 0) {
            return `${minutes} minutos e ${secunds} segundos`;
        }

        if (secunds > 0) {
            return `${secunds} segundos`;
        }

        return '';

    }
}