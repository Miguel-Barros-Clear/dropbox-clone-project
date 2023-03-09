class DropBoxController {
    constructor() {
        this.btnSendFileEl = document.querySelector("#btn-send-file");
        this.inputFilesEl = document.querySelector("#files");
        this.snackModalEl = document.querySelector("#react-snackbar-root")
        this.initEvents();
    }

    initEvents() {
        this.btnSendFileEl.addEventListener("click", (e) => {
            this.inputFilesEl.click();
        })

        this.inputFilesEl.addEventListener("change", (e) => {
            this.uploadTask(e.target.files)
            this.snackModalEl.style.display = "block";
        })
    }

    uploadTask(files) {
        let promises = [];

        [...files].forEach((file) => {
            promises.push(new Promise((resolve, reject) => {
                let ajax = new XMLHttpRequest();
                ajax.open("POST", "/upload");

                ajax.onload = (e) => {
                    try {
                        resolve(JSON.parse(ajax.responseText));
                    } catch (e) {
                        reject(e);
                    }
                }

                ajax.onerror = (e) => {
                    reject(e);
                }

                let formData = new FormData;
                formData.append('input-file', file);
                ajax.send(formData);
            }))
        })

        return Promise.all(promises);
    }
}